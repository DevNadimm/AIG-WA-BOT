import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { login } from"./actions"
import { BotIcon, SparklesIcon, Shield01Icon, FlashIcon } from "hugeicons-react";
import { SubmitButton } from"./SubmitButton"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-zinc-100 font-sans">
      
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden flex-col justify-between p-12 border-r border-zinc-800">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <BotIcon className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">AIG WA BOT</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
            Automate your healthcare communication.
          </h1>
          <p className="text-lg text-zinc-400">
            A dynamic, configuration-driven WhatsApp AI Agent platform. Manage intents, workflows, and patient support directly from this panel.
          </p>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="h-8 w-8 rounded-full bg-zinc-800/80 flex items-center justify-center border border-zinc-700">
                <SparklesIcon className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="font-medium">AI-driven Intent Routing</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="h-8 w-8 rounded-full bg-zinc-800/80 flex items-center justify-center border border-zinc-700">
                <FlashIcon className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium">Dynamic Workflow Engine</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="h-8 w-8 rounded-full bg-zinc-800/80 flex items-center justify-center border border-zinc-700">
                <Shield01Icon className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium">Secure Human Handoff</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} ThinkCodify Projects. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 right-8 lg:hidden flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <BotIcon className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">AIG WA BOT</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-zinc-400 text-sm">Sign in to your admin account to continue.</p>
          </div>

          <form action={login} className="space-y-6 mt-8">
            {params?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                {params.error}
              </div>
            )}
            
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-zinc-300 font-medium text-sm">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="admin@aig.com"
                className="bg-[#121214] border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-11"
              />
            </div>
            
            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300 font-medium text-sm">Password</Label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="bg-[#121214] border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-11 tracking-widest placeholder:tracking-normal"
              />
            </div>
            
            <SubmitButton />
          </form>
          
          <p className="text-center text-xs text-zinc-500 pt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
