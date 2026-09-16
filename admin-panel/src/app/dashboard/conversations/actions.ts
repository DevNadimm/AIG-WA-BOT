'use server'

import { createClient } from"@/lib/supabase/server"
import { revalidatePath } from"next/cache"

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // We need to fetch the customer's phone or lid to send the WhatsApp message
  const { data: conv } = await supabase
    .from("conversations")
    .select("customers(phone, whatsapp_lid)")
    .eq("id", conversationId)
    .single()

  const phone = conv?.customers?.phone;
  const lid = conv?.customers?.whatsapp_lid;
  
  if (!phone && !lid) {
    throw new Error("Could not find customer phone number or LID");
  }

  // 1. Call the local backend API to actually send the message via Baileys
  // The backend API will also insert the message into the database!
  try {
    const res = await fetch('http://localhost:3001/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone,
        lid: lid,
        text: content,
        conversationId: conversationId,
        senderType: 'HUMAN'
      })
    });
    
    if (!res.ok) {
      throw new Error("Backend failed to send WhatsApp message");
    }
  } catch (err: any) {
    console.error("Failed to call WhatsApp backend API:", err);
    throw new Error("Failed to send message:" + err.message);
  }

  // Update last_message_at
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId)

  revalidatePath("/dashboard/conversations")
}

export async function changeConversationState(conversationId: string, state: 'HUMAN_ACTIVE' | 'AI_ACTIVE') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("conversations")
    .update({ 
      state
      // assigned_agent_id: state === 'HUMAN_ACTIVE' ? user.id : null  // Temporarily disabled due to foreign key constraints (needs human_agents mapping)
    })
    .eq("id", conversationId)

  if (error) {
    console.error("Error changing state:", error)
    throw new Error(error.message)
  }

  // If handing over to human, send an automatic notification message
  if (state === 'HUMAN_ACTIVE') {
    try {
      const { data: conv } = await supabase
        .from("conversations")
        .select("customers(phone, whatsapp_lid)")
        .eq("id", conversationId)
        .single()
        
      const phone = conv?.customers?.phone;
      const lid = conv?.customers?.whatsapp_lid;
      
      if (phone || lid) {
        await fetch('http://localhost:3001/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            lid: lid,
            text:"আপনাকে আমাদের একজন হিউম্যান এজেন্টের কাছে ট্রান্সফার করা হয়েছে। তিনি খুব শীঘ্রই আপনাকে রিপ্লাই দেবেন।",
            conversationId: conversationId,
            senderType: 'SYSTEM'
          })
        });
      }
    } catch (err) {
      console.error("Error sending handover notification:", err)
    }
  }

  revalidatePath("/dashboard/conversations")
}
