"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from"@/components/ui/dialog";
import { EyeIcon, Robot01Icon, CpuIcon } from "hugeicons-react";

export function ViewAgentDialog({ agent }: { agent: any }) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        <EyeIcon className="h-4 w-4 mr-2" /> View Details
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#0c0c0e] border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Robot01Icon className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">{agent.name}</DialogTitle>
              <DialogDescription className="text-zinc-400 mt-1">
                {agent.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">AI Model</p>
              <div className="flex items-center gap-2 text-zinc-200">
                <CpuIcon className="h-4 w-4 text-zinc-400" />
                {agent.ai_models?.name ||"Unknown"}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Language & Temp</p>
              <p className="text-zinc-200 capitalize">
                {agent.language} &bull; {agent.temperature}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">System Prompt (Rules)</p>
            <div className="bg-[#121214] border border-zinc-800 rounded-md p-4 max-h-[300px] overflow-y-auto">
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                {agent.system_prompt}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
