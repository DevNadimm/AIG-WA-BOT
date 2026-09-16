import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import Link from"next/link";
import { ArrowLeft01Icon } from "hugeicons-react";
import { createKnowledge } from"./actions";

export default function NewKnowledgePage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/knowledge">
          <Button variant="outline" size="icon">
            <ArrowLeft01Icon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Add Knowledge Source</h1>
          <p className="text-zinc-400 text-sm mt-1">Provide reference material for the AI to learn from.</p>
        </div>
      </div>

      <form action={createKnowledge}>
        <Card className="border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="border-b border-zinc-800/50 pb-6">
            <CardTitle className="text-lg text-zinc-100">Document Information</CardTitle>
            <CardDescription className="text-zinc-400">
              For now, we support TEXT and FAQ inputs. PDF upload will be available soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="name" className="text-zinc-200 font-medium text-sm">Title</Label>
                <p className="text-zinc-500 text-sm mt-1">A clear title for this document (e.g. Visiting Hours Policy).</p>
              </div>
              <div className="col-span-2">
                <Input id="name" name="name" placeholder="Hospital Visiting Hours" required className="bg-[#121214] border-zinc-700 text-zinc-100" />
              </div>
            </div>

            <hr className="border-zinc-800/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="type" className="text-zinc-200 font-medium text-sm">Document Type</Label>
                <p className="text-zinc-500 text-sm mt-1">Format of the content you are providing.</p>
              </div>
              <div className="col-span-2">
                <select 
                  id="type" 
                  name="type" 
                  className="w-full h-10 px-3 py-2 bg-[#121214] border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                >
                  <option value="TEXT">Plain Text / Article</option>
                  <option value="FAQ">FAQ List</option>
                </select>
              </div>
            </div>

            <hr className="border-zinc-800/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="category" className="text-zinc-200 font-medium text-sm">Category</Label>
                <p className="text-zinc-500 text-sm mt-1">Group similar documents together.</p>
              </div>
              <div className="col-span-2">
                <Input id="category" name="category" placeholder="e.g. Hospital Policy, Visa, Doctors" required className="bg-[#121214] border-zinc-700 text-zinc-100" />
              </div>
            </div>
            
            <hr className="border-zinc-800/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="content" className="text-zinc-200 font-medium text-sm">Knowledge Content</Label>
                <p className="text-zinc-500 text-sm mt-1">Paste the exact rules, facts, or FAQs here. The AI will read this to answer questions.</p>
              </div>
              <div className="col-span-2">
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="Visiting hours are strictly from 4 PM to 7 PM. Only 2 visitors are allowed per patient..." 
                  rows={12} 
                  required 
                  className="bg-[#121214] border-zinc-700 text-zinc-100 font-sans text-sm leading-relaxed"
                />
              </div>
            </div>

          </CardContent>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-[#09090b] rounded-b-xl">
            <Link href="/dashboard/knowledge">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit">Publish Knowledge</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
