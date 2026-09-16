import { createClient } from '@supabase/supabase-js';
import { logger } from '../app.js';
import WebSocket from 'ws';

// Local development fallback
const supabaseUrl = process.env.SUPABASE_URL || 'https://zvhsbrbeooqwienoawvo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2aHNicmJlb29xd2llbm9hd3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NDU5NzMsImV4cCI6MjEwNTEyMTk3M30.gkUhJn3yEtUpQMEJKzQ549J4-qKG2GI0hogCnemZZmo';

if (!supabaseUrl || !supabaseServiceKey) {
  logger.warn('Supabase URL or Service Role Key is missing. Database connection will fail.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket
  }
});
