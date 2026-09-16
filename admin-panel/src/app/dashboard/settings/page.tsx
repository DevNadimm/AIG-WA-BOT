import { createClient } from"@/lib/supabase/server";
import { Settings01Icon, Shield01Icon, Key01Icon } from "hugeicons-react";
import { WhatsAppConnection } from"./WhatsAppConnection";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Fetch bot instance and session
  const { data: bots } = await supabase
    .from("bot_instances")
    .select("*, whatsapp_sessions(*)")
    .limit(1);

  const bot = bots?.[0];
  const session = bot?.whatsapp_sessions?.[0];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Settings01Icon</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage system configuration and external integrations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Settings01Icon Sidebar */}
        <nav className="w-full lg:w-64 shrink-0 space-y-1.5">
          <button className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
            <span className="flex items-center gap-3">
              <Settings01Icon className="w-4 h-4" /> Integrations
            </span>
          </button>
          
          <button className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
            <span className="flex items-center gap-3">
              <Key01Icon className="w-4 h-4" /> API Keys
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">Soon</span>
          </button>
          
          <button className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
            <span className="flex items-center gap-3">
              <Shield01Icon className="w-4 h-4" /> Security
            </span>
          </button>
        </nav>

        {/* Settings01Icon Content */}
        <div className="flex-1 space-y-6 max-w-4xl">
          
          {session ? (
            <WhatsAppConnection session={session} />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-800 bg-[#0c0c0e]/50 rounded-xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <Shield01Icon className="w-8 h-8 text-red-500/70" />
              </div>
              <h3 className="text-zinc-200 font-medium text-lg">No Configuration Found</h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-md">Your database is missing a default bot instance. Please insert a bot instance to manage WhatsApp connections.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
