import { supabase } from '../../config/supabase.js';
import { logger } from '../../app.js';
import { sendWhatsAppMessage } from '../whatsapp/sender.js';
import { configCache } from '../config/cache.js';

let isRunning = false;

export async function processTimeouts() {
  if (isRunning) return;
  isRunning = true;

  try {
    const { data: expiredConversations, error } = await supabase
      .from('conversations')
      .select('id, whatsapp_session_id, current_workflow_id, current_step_id, timeout_action, customer_id')
      .eq('state', 'WAITING_INPUT')
      .lte('timeout_at', new Date().toISOString())
      .limit(50); // Batch process

    if (error) {
      logger.error({ err: error }, 'Failed to fetch expired timeouts');
      return;
    }

    for (const conv of expiredConversations) {
      // 1. Atomic Version Protection: Verify state hasn't changed before processing
      // We do an immediate atomic UPDATE to clear the timeout and set a temporary processing state
      // But if we just update to AI_ACTIVE, we might break things. Better: just clear timeout_at
      const { data: updated, error: lockError } = await supabase
        .from('conversations')
        .update({ timeout_at: null })
        .eq('id', conv.id)
        .eq('state', 'WAITING_INPUT') // State hasn't changed (e.g. to HUMAN_ACTIVE)
        .not('timeout_at', 'is', null) // Hasn't been cleared
        .select('id')
        .single();

      if (lockError || !updated) {
        logger.info({ event: 'workflow_state_conflict', conversation_id: conv.id }, 'Skipped timeout due to state change (e.g. Human active)');
        continue; // Someone else processed or state changed
      }

      logger.info({ event: 'workflow_wait_timeout', conversation_id: conv.id, step_id: conv.current_step_id });

      const action = conv.timeout_action;
      if (!action) {
        // Just end workflow by default
        await supabase.from('conversations').update({ 
            state: 'AI_ACTIVE',
            current_workflow_id: null,
            current_step_id: null
        }).eq('id', conv.id);
        continue;
      }

      logger.info({ event: 'workflow_timeout_action', conversation_id: conv.id, action: action.type });

      // Fetch customer phone number
      let phone = '';
      const cust = configCache.getTable('customers').find((c: any) => c.id === conv.customer_id);
      if (cust) phone = cust.phone;
      if (!phone && conv.customer_id) {
         const { data: cData } = await supabase.from('customers').select('phone').eq('id', conv.customer_id).single();
         if (cData) phone = cData.phone;
      }

      const remoteJid = phone ? `${phone}@s.whatsapp.net` : '';

      if (action.type === 'SEND_MESSAGE') {
        if (remoteJid) {
            await sendWhatsAppMessage(remoteJid, action.message || "Timeout occurred.", conv.id);
        }
        await supabase.from('conversations').update({ 
            state: 'AI_ACTIVE',
            current_workflow_id: null,
            current_step_id: null
        }).eq('id', conv.id);
      } else if (action.type === 'HANDOFF') {
        if (remoteJid) {
            await sendWhatsAppMessage(remoteJid, action.message || "Transferring to a human agent.", conv.id);
        }
        await supabase.from('conversations').update({ state: 'WAITING_HUMAN' }).eq('id', conv.id);
      } else {
        await supabase.from('conversations').update({ 
            state: 'AI_ACTIVE',
            current_workflow_id: null,
            current_step_id: null
        }).eq('id', conv.id);
      }
    }
  } catch (err) {
    logger.error({ err }, 'Error in timeout processor');
  } finally {
    isRunning = false;
  }
}

export function startTimeoutWorker() {
  setInterval(processTimeouts, 10000); // run every 10 seconds
}
