import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { login } from"./actions"
import { BotIcon, SparklesIcon, Shield01Icon, FlashIcon } from "hugeicons-react";
import { SubmitButton } from"./SubmitButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-zinc-100 font-sans">
      
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0c0c0e] overflow-hidden flex-col justify-between p-12 border-r border-zinc-800 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.5)]">
        {/* Background Gradients & Grid */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzZjNmNDYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2aDJWMzRoMjZ2LTJoLTI2VjBoLTJ2MjZIMHYyaDI2eiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none" />
        
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
          <p className="text-lg text-zinc-400 leading-relaxed">
            A dynamic, configuration-driven WhatsApp AI Agent platform. Manage intents, workflows, and patient support directly from this panel.
          </p>
          
          <div className="space-y-5 pt-8">
            <div className="flex items-center gap-4 text-zinc-300">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                <SparklesIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-100">AI-driven Intent Routing</span>
                <span className="text-sm text-zinc-500">Smartly categorizes user requests.</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-zinc-300">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-sm">
                <FlashIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-100">Dynamic Workflow Engine</span>
                <span className="text-sm text-zinc-500">Executes step-by-step logic seamlessly.</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-zinc-300">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                <Shield01Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-100">Secure Human Handoff</span>
                <span className="text-sm text-zinc-500">Transfer complex issues to agents safely.</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-zinc-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} ThinkCodify Projects. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative bg-[#09090b]">
        <div className="absolute top-8 right-8 lg:hidden flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <BotIcon className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">AIG WA BOT</span>
        </div>

        <Card className="w-full max-w-md bg-[#0c0c0e] border-zinc-800 shadow-2xl p-2 sm:p-4">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome back</CardTitle>
            <CardDescription className="text-zinc-400 text-base">
              Sign in to your admin account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={login} className="space-y-6">
              {params?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
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
                  className="bg-[#121214] border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-12"
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
                  className="bg-[#121214] border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-12 tracking-widest placeholder:tracking-normal"
                />
              </div>
              
              <SubmitButton />
            </form>
          </CardContent>
          <CardFooter className="pt-6 pb-2 justify-center">
            <p className="text-center text-xs text-zinc-500">
              By signing in, you agree to our <a href="#" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2">Terms of Service</a>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
