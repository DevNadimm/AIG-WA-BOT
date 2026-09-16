'use server'

import { createClient } from"@/lib/supabase/server"
import { revalidatePath } from"next/cache"

export async function addStep(workflowId: string, stepType: string, orderIndex: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("workflow_steps")
    .insert({
      workflow_id: workflowId,
      step_type: stepType,
      name: `New ${stepType} Step`,
      order_index: orderIndex,
      configuration: {}
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/workflows/${workflowId}`)
  return data
}

export async function updateStep(stepId: string, workflowId: string, name: string, configuration: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("workflow_steps")
    .update({
      name,
      configuration
    })
    .eq("id", stepId)

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/workflows/${workflowId}`)
}

export async function deleteStep(stepId: string, workflowId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("workflow_steps")
    .delete()
    .eq("id", stepId)

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/workflows/${workflowId}`)
}

export async function reorderSteps(workflowId: string, stepIdsInOrder: string[]) {
  const supabase = await createClient()

  // For MVP, just update each step's order_index sequentially
  for (let i = 0; i < stepIdsInOrder.length; i++) {
    await supabase
      .from("workflow_steps")
      .update({ order_index: i })
      .eq("id", stepIdsInOrder[i])
  }

  revalidatePath(`/dashboard/workflows/${workflowId}`)
}
