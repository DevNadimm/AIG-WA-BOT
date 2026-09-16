import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import Link from"next/link";
import { ArrowLeft01Icon, Delete02Icon } from "hugeicons-react";
import { createClient } from"@/lib/supabase/server";
import { updateKnowledge, deleteKnowledge } from"./actions";
import { notFound } from"next/navigation";

export default async function EditKnowledgePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Fetch source
  const { data: source, error: sourceError } = await supabase
    .from("knowledge_sources")
    .select("*")
    .eq("id", id)
    .single();

  if (sourceError || !source) {
    notFound();
  }

  // Fetch document content
  const { data: document } = await supabase
    .from("knowledge_documents")
    .select("content")
    .eq("source_id", id)
    .single();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/knowledge">
            <Button variant="outline" size="icon">
              <ArrowLeft01Icon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Edit Knowledge Source</h1>
            <p className="text-zinc-400 text-sm mt-1">Update reference material for the AI to learn from.</p>
          </div>
        </div>
        
        <form action={deleteKnowledge}>
          <input type="hidden" name="id" value={source.id} />
          <Button type="submit" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2">
            <Delete02Icon className="h-4 w-4" /> Delete Knowledge
          </Button>
        </form>
      </div>

      <form action={updateKnowledge}>
        <input type="hidden" name="id" value={source.id} />
        
        <Card className="border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="border-b border-zinc-800/50 pb-6">
            <CardTitle className="text-lg text-zinc-100">Document Information</CardTitle>
            <CardDescription className="text-zinc-400">
              Update the content and metadata of this knowledge source.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="name" className="text-zinc-200 font-medium text-sm">Title</Label>
                <p className="text-zinc-500 text-sm mt-1">A clear title for this document.</p>
              </div>
              <div className="col-span-2">
                <Input id="name" name="name" defaultValue={source.name} required className="bg-[#121214] border-zinc-700 text-zinc-100" />
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
                  defaultValue={source.type}
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
                <Input id="category" name="category" defaultValue={source.category} required className="bg-[#121214] border-zinc-700 text-zinc-100" />
              </div>
            </div>
            
            <hr className="border-zinc-800/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Label htmlFor="content" className="text-zinc-200 font-medium text-sm">Knowledge Content</Label>
                <p className="text-zinc-500 text-sm mt-1">Update the exact rules, facts, or FAQs here.</p>
              </div>
              <div className="col-span-2">
                <Textarea 
                  id="content" 
                  name="content" 
                  defaultValue={document?.content ||""}
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
            <Button type="submit">Save Changes</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
