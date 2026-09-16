import { createClient } from"@/lib/supabase/server";
import { notFound } from"next/navigation";
import { WorkflowBuilder } from"./WorkflowBuilder";
import Link from"next/link";
import { Button } from"@/components/ui/button";
import { ArrowLeft01Icon } from "hugeicons-react";

export default async function WorkflowBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch workflow
  const { data: workflow, error: workflowError } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", id)
    .single();

  if (workflowError || !workflow) {
    notFound();
  }

  // Fetch steps
  const { data: steps, error: stepsError } = await supabase
    .from("workflow_steps")
    .select("*")
    .eq("workflow_id", id)
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/workflows">
          <Button variant="outline" size="icon">
            <ArrowLeft01Icon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{workflow.name}</h1>
          <p className="text-zinc-400 text-sm mt-1">Workflow Builder &bull; {workflow.trigger_type}</p>
        </div>
      </div>

      {/* The interactive builder UI */}
      <WorkflowBuilder workflowId={workflow.id} initialSteps={steps || []} />
    </div>
  );
}
