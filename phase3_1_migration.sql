-- Phase 3.1: Workflow Reliability & State-Machine Hardening

ALTER TABLE conversations ADD COLUMN timeout_at TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN timeout_action JSONB; 

CREATE TABLE IF NOT EXISTS step_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    step_id UUID REFERENCES workflow_steps(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'RUNNING', -- RUNNING, SUCCEEDED, FAILED
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for cron timeout processor
CREATE INDEX IF NOT EXISTS idx_conversations_timeout ON conversations(state, timeout_at) WHERE state = 'WAITING_INPUT' AND timeout_at IS NOT NULL;
