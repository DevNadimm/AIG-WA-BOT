import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen01Icon, SourceCodeIcon, BulbIcon, FlashIcon, ArrowRight01Icon, Robot01Icon, CloudServerIcon, Comment01Icon } from "hugeicons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Documentation</h1>
          <p className="text-zinc-400 text-sm mt-1">Learn how to configure, customize, and integrate the WhatsApp AI Engine.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-zinc-800 bg-[#0c0c0e]">
            <CardHeader className="border-b border-zinc-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <FlashIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <CardTitle className="text-lg text-zinc-100">Quick Start Guide</CardTitle>
              </div>
              <CardDescription className="text-zinc-400">Get your AI bot up and running in minutes.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-zinc-300 text-sm leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs border border-zinc-700">1</span>
                  Connect WhatsApp
                </h3>
                <p className="pl-8 text-zinc-400">Navigate to Settings &gt; Connections and scan the QR code using your WhatsApp Mobile app. This establishes a WebSocket connection with the Baileys engine.</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs border border-zinc-700">2</span>
                  Create an Intent
                </h3>
                <p className="pl-8 text-zinc-400">Go to Intents and define trigger words (e.g., "book appointment", "help"). The AI will map customer queries to these intents automatically.</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs border border-zinc-700">3</span>
                  Design a Workflow
                </h3>
                <p className="pl-8 text-zinc-400">In the Workflows tab, link your Intents to AI prompts or API function calls (Tools). This determines how the AI responds when an Intent is triggered.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-[#0c0c0e]">
            <CardHeader className="border-b border-zinc-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Robot01Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <CardTitle className="text-lg text-zinc-100">AI Behavior & Handovers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-zinc-400 text-sm space-y-4">
              <p>The system uses Google Gemini Flash models to process incoming messages. It has three conversation states:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                <li><strong className="text-emerald-400">AI ACTIVE:</strong> The AI handles all incoming messages automatically using your configured Knowledge and Workflows.</li>
                <li><strong className="text-indigo-400">HUMAN ACTIVE:</strong> An admin has taken over the chat. The AI pauses completely until released.</li>
                <li><strong className="text-orange-400">WAITING HUMAN:</strong> The AI could not understand the request or the user explicitly asked to talk to a human. The AI notifies the admin.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Navigation */}
        <div className="space-y-6">
          <Card className="border-zinc-800 bg-[#0c0c0e]">
            <CardHeader className="pb-3 border-b border-zinc-800/50">
              <CardTitle className="text-base text-zinc-100">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-zinc-800/50">
                <Link href="#" className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <BookOpen01Icon className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">API Reference</span>
                  </div>
                  <ArrowRight01Icon className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                </Link>
                <Link href="#" className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <SourceCodeIcon className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">Custom Tools Setup</span>
                  </div>
                  <ArrowRight01Icon className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                </Link>
                <Link href="#" className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <CloudServerIcon className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">Deployment Guide</span>
                  </div>
                  <ArrowRight01Icon className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-[#0c0c0e] bg-gradient-to-br from-indigo-500/5 to-transparent">
            <CardContent className="p-6">
              <div className="p-3 bg-indigo-500/10 w-fit rounded-lg mb-4">
                <BulbIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">Need a custom setup?</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                We provide custom development services to integrate this engine with your existing CRM, ERP, or internal database.
              </p>
              <Link href="/dashboard/support">
                <Button className="w-full">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
