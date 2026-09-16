'use server'

import { createClient } from"@/lib/supabase/server"
import { revalidatePath } from"next/cache"

export async function connectWhatsApp(sessionId: string, phone: string) {
  const supabase = await createClient()

  // Simulate scanning QR and updating state to CONNECTED
  const { error } = await supabase
    .from("whatsapp_sessions")
    .update({ 
      status:"CONNECTED",
      phone_number: phone
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Error connecting WhatsApp:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/settings")
}

export async function disconnectWhatsApp(sessionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("whatsapp_sessions")
    .update({ 
      status:"DISCONNECTED",
      phone_number: null
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Error disconnecting WhatsApp:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/settings")
}
