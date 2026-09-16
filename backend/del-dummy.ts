import 'dotenv/config';
import { supabase } from './src/config/supabase.js';

async function main() {
  // Delete conversations and messages for LID-based customers
  const { data: lidCustomers } = await supabase
    .from('customers')
    .select('id, phone')
    .like('phone', '2809%');

  console.log('LID customers found:', lidCustomers?.length || 0);

  if (lidCustomers && lidCustomers.length > 0) {
    for (const c of lidCustomers) {
      // Delete messages first (FK constraint)
      const { data: convs } = await supabase
        .from('conversations')
        .select('id')
        .eq('customer_id', c.id);
      
      if (convs) {
        for (const conv of convs) {
          await supabase.from('conversation_messages').delete().eq('conversation_id', conv.id);
          console.log(`Deleted messages for conversation: ${conv.id}`);
        }
      }
      
      await supabase.from('conversations').delete().eq('customer_id', c.id);
      await supabase.from('customers').delete().eq('id', c.id);
      console.log(`Deleted customer: ${c.phone}`);
    }
  }

  console.log('Done!');
}

main();
