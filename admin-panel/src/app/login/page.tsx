import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { login } from"./actions"
import { BotIcon } from "hugeicons-react";
import { SubmitButton } from"./SubmitButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#09090b] text-zinc-100 font-sans relative overflow-hidden p-4">
      {/* Background Gradients & Patterns */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzZjNmNDYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djI2aDJWMzRoMjZ2LTJoLTI2VjBoLTJ2MjZIMHYyaDI2eiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/20">
            <BotIcon className="h-7 w-7 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">AIG WA BOT</span>
        </div>

        <Card className="w-full bg-[#0c0c0e]/80 backdrop-blur-xl border-zinc-800 shadow-2xl">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">Welcome back</CardTitle>
            <CardDescription className="text-zinc-400">
              Sign in to your admin account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={login} className="space-y-5">
              {params?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
                  {params.error}
                </div>
              )}
              
              <div className="space-y-2 text-left">
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
              
              <div className="space-y-2 text-left">
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
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6 pb-6">
            <p className="text-center text-xs text-zinc-500">
              By signing in, you agree to our <a href="#" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2">Terms of Service</a>.
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-zinc-600 text-xs text-center">
          &copy; {new Date().getFullYear()} ThinkCodify Projects.<br/>All rights reserved.
        </div>
      </div>
    </div>
  )
}
