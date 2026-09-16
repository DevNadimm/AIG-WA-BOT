import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail01Icon, BubbleChatIcon, CallIcon, HelpCircleIcon, QuestionIcon, ArrowRight01Icon } from "hugeicons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Support & Help Center</h1>
          <p className="text-zinc-400 text-sm mt-1">Get assistance with your AI automation platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <BubbleChatIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <CardTitle className="text-lg text-zinc-100">Contact Support</CardTitle>
            </div>
            <CardDescription className="text-zinc-400">Reach out to our technical team directly.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <a href="mailto:support@thinkcodify.com" className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 transition-colors group">
              <div className="p-2 bg-zinc-800 rounded-md group-hover:bg-indigo-500/20 transition-colors">
                <Mail01Icon className="h-4 w-4 text-zinc-300 group-hover:text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">Email Support</h4>
                <p className="text-xs text-zinc-500 mt-0.5">support@thinkcodify.com</p>
              </div>
            </a>

            <a href="#" className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 transition-colors group">
              <div className="p-2 bg-zinc-800 rounded-md group-hover:bg-emerald-500/20 transition-colors">
                <CallIcon className="h-4 w-4 text-zinc-300 group-hover:text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">WhatsApp Support</h4>
                <p className="text-xs text-zinc-500 mt-0.5">+880 1234 567 890</p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <HelpCircleIcon className="h-5 w-5 text-orange-400" />
              </div>
              <CardTitle className="text-lg text-zinc-100">Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-zinc-800/50">
              
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-semibold text-zinc-200 flex items-start gap-2">
                  <QuestionIcon className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                  Why is my AI not responding to messages?
                </h4>
                <p className="text-xs text-zinc-400 pl-6 leading-relaxed">
                  Ensure the WhatsApp engine is connected in the settings. Check if the conversation state is accidentally set to "HUMAN ACTIVE". The AI only responds when the state is "AI ACTIVE".
                </p>
              </div>

              <div className="p-5 space-y-2">
                <h4 className="text-sm font-semibold text-zinc-200 flex items-start gap-2">
                  <QuestionIcon className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                  How do I train the AI on my data?
                </h4>
                <p className="text-xs text-zinc-400 pl-6 leading-relaxed">
                  Go to the Knowledge tab and upload your FAQs, business policies, or product information. The AI automatically uses this data to answer customer queries accurately.
                </p>
              </div>

              <div className="p-5 space-y-2">
                <h4 className="text-sm font-semibold text-zinc-200 flex items-start gap-2">
                  <QuestionIcon className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                  Can the bot book appointments directly?
                </h4>
                <p className="text-xs text-zinc-400 pl-6 leading-relaxed">
                  Yes, using the "Tools" functionality, you can connect the AI to your booking API. Create a tool, specify the API endpoint, and the AI will execute it when users request an appointment.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
