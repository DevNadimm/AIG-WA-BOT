import { ingestDocument } from './src/core/knowledge/ingestion.js';
import { searchKnowledge } from './src/core/knowledge/search.js';
import { supabase } from './src/config/supabase.js';

async function testPhase4() {
  console.log("=== Testing Phase 4 RAG Engine ===");
  
  // 1. Agent Isolation Setup
  const agent1Id = '11111111-1111-1111-1111-111111111111';
  const agent2Id = '22222222-2222-2222-2222-222222222222';
  
  // Clean up previous test
  await supabase.from('agent_knowledge_sources').delete().in('agent_id', [agent1Id, agent2Id]);
  await supabase.from('knowledge_sources').delete().in('name', ['Test Source 1', 'Test Source 2']);
  await supabase.from('ai_agents').delete().in('id', [agent1Id, agent2Id]);

  const { data: org } = await supabase.from('organizations').select('id').limit(1).single();
  const orgId = org ? org.id : null;

  // Insert dummy agents
  await supabase.from('ai_agents').insert([
    { id: agent1Id, organization_id: orgId, name: 'Agent 1', status: 'ACTIVE' },
    { id: agent2Id, organization_id: orgId, name: 'Agent 2', status: 'ACTIVE' }
  ]);
  
  // Create Knowledge Source 1
  const { data: source1 } = await supabase.from('knowledge_sources').insert([
    { organization_id: orgId, name: 'Test Source 1', type: 'TEXT', status: 'PUBLISHED' }
  ]).select('id').single();
  
  // Create Knowledge Source 2
  const { data: source2 } = await supabase.from('knowledge_sources').insert([
    { organization_id: orgId, name: 'Test Source 2', type: 'TEXT', status: 'PUBLISHED' }
  ]).select('id').single();

  // Map Agent 1 -> Source 1, Agent 2 -> Source 2
  await supabase.from('agent_knowledge_sources').insert([
    { agent_id: agent1Id, source_id: source1!.id },
    { agent_id: agent2Id, source_id: source2!.id }
  ]);

  console.log("Agents and Sources created and mapped.");

  // 2. Ingest Data
  await ingestDocument(source1!.id, 'Hospital Hours', 'The hospital is open 24/7. Visiting hours are 10 AM to 8 PM.');
  await ingestDocument(source2!.id, 'Billing Dept', 'The billing department is closed on Sundays. Email billing@hospital.com.');
  
  console.log("Documents ingested.");

  // 3. Test Retrieval Isolation
  // Query Agent 1 for "billing" -> Should return nothing or low similarity
  const search1 = await searchKnowledge('When is billing open?', agent1Id, 0.01, 3);
  console.log(`Agent 1 searching 'billing': Found ${search1.length} chunks`);
  if (search1.some(c => c.source_name === 'Test Source 2')) {
    console.error("FAIL: Agent 1 retrieved Agent 2's knowledge!");
  } else {
    console.log("SUCCESS: Agent 1 isolation holds.");
  }

  // Query Agent 2 for "visiting hours"
  const search2 = await searchKnowledge('What are visiting hours?', agent2Id, 0.01, 3);
  console.log(`Agent 2 searching 'visiting hours': Found ${search2.length} chunks`);
  if (search2.some(c => c.source_name === 'Test Source 1')) {
    console.error("FAIL: Agent 2 retrieved Agent 1's knowledge!");
  } else {
    console.log("SUCCESS: Agent 2 isolation holds.");
  }
  
  // 4. Test URL SSRF Logic
  // I will test URL ingestion using localhost which should fail safely
  const { data: source3 } = await supabase.from('knowledge_sources').insert([
    { organization_id: orgId, name: 'SSRF Test', type: 'URL', status: 'PUBLISHED' }
  ]).select('id').single();

  await ingestDocument(source3!.id, 'Localhost', '', 'http://127.0.0.1/admin');
  
  const { data: verifySource3 } = await supabase.from('knowledge_sources').select('status').eq('id', source3!.id).single();
  if (verifySource3?.status === 'FAILED') {
    console.log("SUCCESS: SSRF safely blocked URL ingestion.");
  } else {
    console.error("FAIL: SSRF blocked but status is not FAILED.");
  }
  
  // Cleanup
  await supabase.from('knowledge_sources').delete().in('id', [source1!.id, source2!.id, source3!.id]);
  await supabase.from('ai_agents').delete().in('id', [agent1Id, agent2Id]);
  
  console.log("Tests Complete.");
}

testPhase4();
