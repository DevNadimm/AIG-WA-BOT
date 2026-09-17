import { createClient } from '@supabase/supabase-js';
import { logger } from '../app.js';
import WebSocket from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('CRITICAL ERROR: Supabase URL or Service Role Key is missing from environment variables.');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket as any
  }
});
