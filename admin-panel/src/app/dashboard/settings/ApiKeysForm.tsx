"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key01Icon, FloppyDiskIcon, AiBrain01Icon, ViewIcon, ViewOffSlashIcon, PlusSignIcon, Delete01Icon } from "hugeicons-react";
import { updateApiKeys } from "./actions";

export function ApiKeysForm({ bot }: { bot: any }) {
  const [isPending, startTransition] = useTransition();
  
  // Initialize with array of keys
  const getInitialKeys = () => {
    if (!bot?.llm_api_key) return [""];
    try {
      if (bot.llm_api_key.trim().startsWith("[")) {
        return JSON.parse(bot.llm_api_key);
      }
      return bot.llm_api_key.split(",").map((k: string) => k.trim()).filter(Boolean);
    } catch {
      return [bot.llm_api_key];
    }
  };

  const [keys, setKeys] = useState<string[]>(getInitialKeys());
  const [showKey, setShowKey] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...keys];
    newKeys[index] = value;
    setKeys(newKeys);
  };

  const handleAddKey = () => {
    setKeys([...keys, ""]);
  };

  const handleRemoveKey = (index: number) => {
    const newKeys = [...keys];
    newKeys.splice(index, 1);
    if (newKeys.length === 0) newKeys.push(""); // always keep at least one input
    setKeys(newKeys);
  };

  const handleSave = () => {
    startTransition(async () => {
      setMessage({ type: "", text: "" });
      
      const validKeys = keys.filter(k => k.trim() !== "");
      // Save as JSON string
      const saveValue = validKeys.length > 0 ? JSON.stringify(validKeys) : "";

      const result = await updateApiKeys(bot.id, saveValue);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "API Keys updated successfully." });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    });
  };

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-800 bg-[#0c0c0e]/50 rounded-xl">
        <h3 className="text-zinc-200 font-medium text-lg">No Bot Found</h3>
        <p className="text-sm text-zinc-500 mt-2 max-w-md">Please create a bot instance first.</p>
      </div>
    );
  }

  return (
    <Card className="border-zinc-800 bg-[#0c0c0e]">
      <CardHeader className="border-b border-zinc-800/50">
        <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
          <Key01Icon className="w-5 h-5 text-indigo-400" /> API Keys
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Configure your LLM provider keys directly here so you don't need them in .env. Multiple keys are supported for fallback.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AiBrain01Icon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-zinc-200">Google Gemini API</h3>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddKey} className="h-8 text-xs">
              <PlusSignIcon className="w-3 h-3 mr-1" /> Add Fallback Key
            </Button>
          </div>
          
          <div className="space-y-4">
            {keys.map((key, index) => (
              <div key={index} className="space-y-2 relative">
                <Label className="text-xs text-zinc-400 uppercase tracking-wider flex justify-between">
                  <span>Secret Key {index > 0 ? `(Fallback ${index})` : ''}</span>
                </Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input 
                      type={showKey[index] ? "text" : "password"}
                      value={key}
                      onChange={(e) => handleKeyChange(index, e.target.value)}
                      placeholder="AIzaSy..."
                      className="bg-zinc-900 border-zinc-800 pr-10 focus-visible:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey({ ...showKey, [index]: !showKey[index] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showKey[index] ? <ViewOffSlashIcon className="w-4 h-4" /> : <ViewIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {keys.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => handleRemoveKey(index)} className="h-9 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-zinc-800">
                      <Delete01Icon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <p className="text-xs text-zinc-500 mt-2">These keys are used by the backend to process natural language. If the first key is rate-limited, the next key will be used automatically.</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-3 text-sm rounded-lg border ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            {message.text}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-zinc-900/50 border-t border-zinc-800 px-6 py-4">
        <Button 
          variant="default"
          onClick={handleSave} 
          disabled={isPending}
        >
          <FloppyDiskIcon className="w-4 h-4 mr-2" />
          {isPending ? "Saving..." : "Save API Keys"}
        </Button>
      </CardFooter>
    </Card>
  );
}
