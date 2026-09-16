import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import Link from"next/link";
import { ArrowLeft01Icon } from "hugeicons-react";
import { createWorkflow } from"./actions";

export default function NewWorkflowPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/workflows">
          <Button variant="outline" size="icon">
            <ArrowLeft01Icon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Create New Workflow</h1>
          <p className="text-zinc-400 text-sm mt-1">Define the base settings for your new automation.</p>
        </div>
      </div>

      <form action={createWorkflow}>
        <Card className="border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="border-b border-zinc-800/50 pb-6">
            <CardTitle className="text-lg text-zinc-100">Workflow Details</CardTitle>
            <CardDescription className="text-zinc-400">
              Basic information. You can add the steps in the next screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="name" className="text-zinc-200 font-medium text-sm">Workflow Name</Label>
                <p className="text-zinc-500 text-sm mt-1">A human readable name for this automation.</p>
              </div>
              <div className="col-span-2">
                <Input id="name" name="name" placeholder="e.g. Medical Visa Process" required className="bg-[#121214] border-zinc-700 text-zinc-100" />
              </div>
            </div>

            <hr className="border-zinc-800/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="trigger_type" className="text-zinc-200 font-medium text-sm">Trigger Type</Label>
                <p className="text-zinc-500 text-sm mt-1">What causes this workflow to start?</p>
              </div>
              <div className="col-span-2">
                <select 
                  id="trigger_type" 
                  name="trigger_type" 
                  className="w-full h-10 px-3 py-2 bg-[#121214] border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                >
                  <option value="INTENT">Intent Matched</option>
                  <option value="KEYWORD">Keyword Match</option>
                  <option value="MANUAL">Manual / Agent</option>
                </select>
              </div>
            </div>

            <hr className="border-zinc-800/50" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="timeout_seconds" className="text-zinc-200 font-medium text-sm">Timeout (Seconds)</Label>
                <p className="text-zinc-500 text-sm mt-1">Max duration to wait for user responses in steps.</p>
              </div>
              <div className="col-span-2">
                <Input id="timeout_seconds" name="timeout_seconds" type="number" defaultValue="300" min="10" required className="bg-[#121214] border-zinc-700 text-zinc-100 font-mono" />
              </div>
            </div>

            <hr className="border-zinc-800/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="description" className="text-zinc-200 font-medium text-sm">Description</Label>
                <p className="text-zinc-500 text-sm mt-1">Briefly explain what this workflow accomplishes.</p>
              </div>
              <div className="col-span-2">
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Handles collecting patient visa docs and routing to the right team..." 
                  rows={4} 
                  required 
                  className="bg-[#121214] border-zinc-700 text-zinc-100 resize-none"
                />
              </div>
            </div>

          </CardContent>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-[#09090b] rounded-b-xl">
            <Link href="/dashboard/workflows">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit">Create & Build</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
