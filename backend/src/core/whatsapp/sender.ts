import { WASocket } from '@whiskeysockets/baileys';
import { logger } from '../../app.js';

let globalSocket: WASocket | null = null;

export function setWhatsAppSocket(sock: WASocket) {
  globalSocket = sock;
}

export function getWhatsAppSocket() {
  return globalSocket;
}

import { supabase } from '../../config/supabase.js';

export async function sendWhatsAppMessage(remoteJid: string, text: string, conversationId?: string, senderType: string = 'AI') {
  if (!globalSocket) {
    logger.error('WhatsApp socket is not initialized. Cannot send message.');
    return;
  }
  
  // Clean the remoteJid just in case it has a plus sign or spaces
  const cleanJid = remoteJid.replace('+', '').replace(/ /g, '');
  
  try {
    const sentMsg = await globalSocket.sendMessage(cleanJid, { text });
    logger.info(`Message sent to ${cleanJid}`);
    
    if (conversationId) {
      await supabase.from('conversation_messages').insert([{
        conversation_id: conversationId,
        sender_type: senderType,
        content: text,
        status: 'sent',
        whatsapp_message_id: sentMsg?.key?.id || null
      }]);
    }
  } catch (error) {
    logger.error({ err: error }, `Failed to send message to ${remoteJid}`);
  }
}
