import { createClient } from '@supabase/supabase-js'; 
import ws from 'ws';

const supabase = createClient(
  'https://zvhsbrbeooqwienoawvo.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2aHNicmJlb29xd2llbm9hd3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NDU5NzMsImV4cCI6MjEwNTEyMTk3M30.gkUhJn3yEtUpQMEJKzQ549J4-qKG2GI0hogCnemZZmo',
  {
    realtime: {
      transport: ws
    }
  }
); 

supabase.auth.signUp({ 
  email: 'admin@aig.com', 
  password: 'password123' 
}).then(console.log).catch(console.error);
