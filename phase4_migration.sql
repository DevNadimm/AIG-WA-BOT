-- Phase 4: Knowledge Base & RAG Infrastructure

-- 1. Agent Knowledge Scope Map
CREATE TABLE agent_knowledge_sources (
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    PRIMARY KEY (agent_id, source_id)
);

-- 2. PGVector Search RPC function
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT,
    filter_agent_id UUID DEFAULT NULL
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    chunk_text TEXT,
    similarity FLOAT,
    source_name VARCHAR,
    source_type VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id AS chunk_id,
        kc.document_id,
        kc.chunk_text,
        1 - (kc.embedding <=> query_embedding) AS similarity,
        ks.name AS source_name,
        ks.type AS source_type
    FROM knowledge_chunks kc
    JOIN knowledge_documents kd ON kc.document_id = kd.id
    JOIN knowledge_sources ks ON kd.source_id = ks.id
    WHERE ks.status = 'PUBLISHED'
      AND (
        filter_agent_id IS NULL OR
        ks.id IN (
            SELECT source_id FROM agent_knowledge_sources WHERE agent_id = filter_agent_id
        )
      )
      AND 1 - (kc.embedding <=> query_embedding) > match_threshold
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
