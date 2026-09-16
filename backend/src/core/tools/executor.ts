import { logger } from '../../app.js';
import * as net from 'net';

interface ToolExecutorResult {
  data?: any;
  error?: string;
}

export async function executeExternalApi(url: string, method: string, headers: any, body?: any): Promise<ToolExecutorResult> {
  try {
    const parsedUrl = new URL(url);
    
    // 1. SSRF Protection: Reject private/internal IP ranges
    // This is a basic string check on the hostname. In a fully robust system,
    // DNS resolution would happen first to catch DNS rebinding, but this is a good first step.
    const blockedHostnames = [
      'localhost',
      '127.0.0.1',
      '::1',
      '0.0.0.0',
      '169.254.169.254'
    ];
    
    if (blockedHostnames.includes(parsedUrl.hostname.toLowerCase())) {
      return { error: 'Access to internal hostnames is prohibited.' };
    }

    // Block private IPv4 ranges if the hostname is an IP address
    if (net.isIPv4(parsedUrl.hostname)) {
      const parts = parsedUrl.hostname.split('.').map(Number);
      if (
        parts[0] === 10 || // 10.0.0.0/8
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // 172.16.0.0/12
        (parts[0] === 192 && parts[1] === 168) // 192.168.0.0/16
      ) {
        return { error: 'Access to private IP ranges is prohibited.' };
      }
    }

    // 2. Timeout Protection
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000); // 5000ms default timeout

    logger.info(`Executing safe API request to ${url} [${method}]`);
    
    // 3. Execute Request
    const response = await fetch(url, {
      method: method || 'GET',
      headers: headers || { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      redirect: 'error' // SSRF Protection: prevent following redirects to internal IPs
    });

    clearTimeout(timeout);

    // If response is large, we should technically limit it, but parsing json() here
    // is acceptable for Step 1.
    const data = await response.json();
    return { data };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      logger.error(`API execution timed out for ${url}`);
      return { error: 'External service request timed out.' };
    }
    logger.error({ err: error }, `API execution failed for ${url}`);
    return { error: 'External service is unavailable.' };
  }
}

import { supabase } from '../../config/supabase.js';
import * as crypto from 'crypto';

export async function executeIdempotentTool(
  conversationId: string,
  workflowId: string | undefined,
  stepId: string | undefined,
  toolName: string,
  method: string,
  url: string,
  body: any,
  supportsIdempotency: boolean = false
): Promise<ToolExecutorResult> {
  const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
  const isSideEffect = !isSafeMethod;
  
  if (!isSideEffect || !workflowId || !stepId) {
    return await executeExternalApi(url, method, { 'Content-Type': 'application/json' }, body);
  }

  const payloadHash = crypto.createHash('sha256').update(JSON.stringify(body || {})).digest('hex');
  const idempotencyKey = `${conversationId}_${stepId}_${toolName}_${payloadHash}`;

  const { data: existingExecution } = await supabase
    .from('step_executions')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .single();

  if (existingExecution) {
    if (existingExecution.status === 'SUCCEEDED') {
      logger.info({ event: 'workflow_execution_reused', idempotency_key: idempotencyKey });
      return { data: existingExecution.result };
    }
    if (existingExecution.status === 'RUNNING') {
      const startedAt = new Date(existingExecution.created_at).getTime();
      const age = Date.now() - startedAt;
      if (age < 30000) {
        logger.warn({ event: 'workflow_state_conflict', idempotency_key: idempotencyKey }, 'Concurrent execution detected');
        return { error: 'Operation is currently processing. Please try again later.' };
      } else {
        logger.info({ event: 'workflow_stale_execution_detected', idempotency_key: idempotencyKey }, 'Recovering stale execution');
      }
    }
    if (existingExecution.status === 'FAILED_UNKNOWN' && !supportsIdempotency) {
      logger.warn({ event: 'workflow_unsafe_retry_blocked', idempotency_key: idempotencyKey });
      return { error: 'Previous execution state unknown. Automatic retry blocked to prevent duplicate side effects.' };
    }
  }

  logger.info({ event: 'workflow_execution_started', idempotency_key: idempotencyKey, tool_name: toolName });
  const { error: upsertError } = await supabase.from('step_executions').upsert({
    conversation_id: conversationId,
    workflow_id: workflowId,
    step_id: stepId,
    idempotency_key: idempotencyKey,
    status: 'RUNNING',
    updated_at: new Date().toISOString()
  });

  if (upsertError) {
    logger.error({ err: upsertError, idempotency_key: idempotencyKey }, 'Failed to write execution state');
  }

  const headers: any = { 'Content-Type': 'application/json' };
  if (supportsIdempotency) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  const result = await executeExternalApi(url, method, headers, body);

  if (!result.error) {
    logger.info({ event: 'workflow_execution_succeeded', idempotency_key: idempotencyKey });
    await supabase.from('step_executions').update({
      status: 'SUCCEEDED',
      result: result.data,
      updated_at: new Date().toISOString()
    }).eq('idempotency_key', idempotencyKey);
  } else {
    // If it's a side effect and the API doesn't support idempotency, we can't be sure the remote server didn't process it.
    const newStatus = (!supportsIdempotency) ? 'FAILED_UNKNOWN' : 'FAILED';
    logger.info({ event: 'workflow_execution_failed', idempotency_key: idempotencyKey, error: result.error, status: newStatus });
    await supabase.from('step_executions').update({
      status: newStatus,
      result: { error: result.error },
      updated_at: new Date().toISOString()
    }).eq('idempotency_key', idempotencyKey);
  }

  return result;
}
