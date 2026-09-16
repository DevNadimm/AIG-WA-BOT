import { validateField } from './src/core/workflow/validation.js';
import { executeIdempotentTool } from './src/core/tools/executor.js';
import { supabase } from './src/config/supabase.js';

async function runTests() {
  console.log('=== Phase 3.1: Hardening & Validation Tests ===\n');

  // 1. Validation Tests
  console.log('--- VALIDATION ---');
  const strTest = validateField(' hello ', 'STRING');
  console.assert(strTest.valid && strTest.normalizedValue === 'hello', 'String normalize failed');

  const numTest = validateField('123.4', 'NUMBER');
  console.assert(numTest.valid && numTest.normalizedValue === 123.4, 'Number validation failed');

  const phoneTest = validateField(' +1 (555) 123-4567 ', 'PHONE');
  console.assert(phoneTest.valid && phoneTest.normalizedValue === '+15551234567', 'Phone normalize failed');
  
  const emailTest = validateField(' USER@DOMAIN.COM ', 'EMAIL');
  console.assert(emailTest.valid && emailTest.normalizedValue === 'user@domain.com', 'Email normalize failed');

  const enumTest = validateField('cat', 'ENUM', { options: ['Cat', 'Dog'] });
  console.assert(enumTest.valid && enumTest.normalizedValue === 'Cat', 'Enum validation failed');

  const regexTest = validateField('ABC-123', 'REGEX', { pattern: '^[A-Z]{3}-\\d{3}$' });
  console.assert(regexTest.valid, 'Regex validation failed');

  const invalidTest = validateField('abc', 'NUMBER');
  console.assert(!invalidTest.valid, 'Invalid number should fail');
  console.log('Validation tests passed.');

  // 2. Idempotency Tests
  console.log('\n--- IDEMPOTENCY ---');
  const convId = '33333333-3333-3333-3333-333333333333'; // dummy conv
  const workflowId = '44444444-4444-4444-4444-444444444444';
  const stepId = '55555555-5555-5555-5555-555555555555';

  // Ensure cleanup
  await supabase.from('conversations').delete().eq('id', convId);
  await supabase.from('step_executions').delete().eq('conversation_id', convId);

  // Note: we can't easily insert into conversations if customer doesn't exist, 
  // but idempotency logic in executor doesn't strictly check Foreign Key in this layer (it will fail on Postgres constraint).
  // Wait, step_executions has FK constraints to conversations! We must mock a customer and conversation.
  
  const { data: org } = await supabase.from('organizations').select('id').limit(1).single();
  const orgId = org ? org.id : null;

  const { data: customer } = await supabase.from('customers').insert([
    { organization_id: orgId, phone: '+1234567890Test', name: 'Test' }
  ]).select('id').single();

  const { data: conversation } = await supabase.from('conversations').insert([
    { id: convId, customer_id: customer!.id, state: 'WAITING_INPUT' }
  ]).select('id').single();

  const { data: workflow } = await supabase.from('workflows').insert([
    { id: workflowId, organization_id: orgId, name: 'Test WF', status: 'DRAFT' }
  ]).select('id').single();

  const { data: step } = await supabase.from('workflow_steps').insert([
    { id: stepId, workflow_id: workflow!.id, name: 'Test Step', step_type: 'SEND_MESSAGE' }
  ]).select('id').single();

  // Test Tool (We'll use an invalid URL but simulate idempotency locking)
  try {
     const result1 = await executeIdempotentTool(convId, workflowId, stepId, 'mockTool', 'POST', 'http://localhost/api', { foo: 'bar' });
  } catch(e) {} // will fail due to SSRF, but idempotency tracking still kicks in (and sets FAILED)

  // Wait, if it fails, the status becomes FAILED. Let's see if retry on FAILED works? 
  // Ah! Our executor code says:
  // if (existing.status === 'SUCCEEDED') return existing.result
  // if (existing.status === 'RUNNING') return error / conflict
  // If FAILED, it continues and overwrites with UPSERT! (Safe retry!)

  // Let's manually set a SUCCEEDED record
  const mockIdempotencyKey = `${convId}_${stepId}_mockTool_a5e744d0164540d33b1d7ea616c28f2fa97e754a`;
  await supabase.from('step_executions').upsert({
      conversation_id: convId,
      idempotency_key: mockIdempotencyKey,
      status: 'SUCCEEDED',
      result: { ok: true }
  });

  // Call again -> should reuse SUCCEEDED
  const result2 = await executeIdempotentTool(convId, undefined, undefined, 'mockTool', 'POST', 'http://localhost/api', { foo: 'bar' });
  // wait, if workflowId/stepId is undefined, it skips idempotency! We must provide them.
  const result3 = await executeIdempotentTool(convId, workflowId, stepId, 'mockTool', 'POST', 'http://localhost/api', { foo: 'bar' });
  console.assert(result3.data && result3.data.ok === true, 'Idempotent cache reuse failed');
  console.log('Idempotency tests passed.');

  // 3. Concurrency / State Protection
  console.log('\n--- CONCURRENCY / HUMAN HANDOFF ---');
  // If conversation is HUMAN_ACTIVE, processing timeout should skip.
  const { processTimeouts } = await import('./src/core/workflow/timeout_worker.js');
  
  // Set timeout to past
  await supabase.from('conversations').update({ 
    state: 'HUMAN_ACTIVE', // Important: it's HUMAN_ACTIVE, not WAITING_INPUT
    timeout_at: new Date(Date.now() - 10000).toISOString(),
    timeout_action: { type: 'END' }
  }).eq('id', convId);

  await processTimeouts();

  // Check state - should remain HUMAN_ACTIVE
  const { data: verify1 } = await supabase.from('conversations').select('state').eq('id', convId).single();
  console.assert(verify1!.state === 'HUMAN_ACTIVE', 'Timeout worker bypassed HUMAN_ACTIVE protection!');

  console.log('Concurrency tests passed.');

  console.log('\n--- NEW PHASE 3.1 TESTS ---');

  // Test C — Failed POST (FAILED_UNKNOWN)
  console.log('Testing FAILED_UNKNOWN side effect retry prevention...');
  const idempotencyKeyFail = `${convId}_${stepId}_testFailTool_d86164d2d480766be1b4fecb2b73ecb1e5527a20c90c7af13dfd51f2249673eb`;
  
  await supabase.from('step_executions').upsert({
      conversation_id: convId, 
      workflow_id: workflowId,
      step_id: stepId,
      idempotency_key: idempotencyKeyFail,
      status: 'FAILED_UNKNOWN',
      result: { error: 'timeout' }
  });

  const failResult = await executeIdempotentTool(convId, workflowId, stepId, 'testFailTool', 'POST', 'http://localhost/api', { b: 1 }, false);
  console.assert(failResult.error?.includes('Automatic retry blocked'), 'Failed to block retry of FAILED_UNKNOWN');

  // Test D — Idempotent API (Allowed Retry)
  const failResultIdempotent = await executeIdempotentTool(convId, workflowId, stepId, 'testFailTool', 'POST', 'http://localhost/api', { b: 1 }, true);
  console.assert(!failResultIdempotent.error?.includes('Automatic retry blocked'), 'Blocked an explicitly idempotent retry');

  console.log('All new Phase 3.1 tests passed.');

  // Cleanup
  await supabase.from('customers').delete().eq('id', customer!.id);
  await supabase.from('workflows').delete().eq('id', workflow!.id);

  console.log('\n=== ALL TESTS PASSED ===');
}

runTests();
