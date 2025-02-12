"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];



const speciesSchema = z.object({
  scientific_name: z.string().min(1).trim(),
  common_name: z.string().nullable(),
  kingdom: z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]),
  total_population: z.number().int().positive().nullable(),
  description: z.string().nullable(),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog({ species }: { species: Species }) {
  const [open, setOpen] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species?.scientific_name ?? "",
      common_name: species?.common_name ?? "",
      kingdom: species?.kingdom ?? "Animalia",
      total_population: species?.total_population ?? null,
      description: species?.description ?? "",
    },
  });

  const onSubmit = async (input: FormData) => {
    const { error } = await supabase.from("species").update(input).eq("id", species.id);

    if (error) {
      return toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setOpen(false);

    toast({
      title: "Species updated!",
      description: "The species information has been successfully updated.",
    });

    window.location.reload(); // Refresh to show updated data
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>Update the details of this species.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }}>
          <div className="grid gap-4">
            <Input {...form.register("scientific_name")} placeholder="Scientific Name" />
            <Input {...form.register("common_name")} placeholder="Common Name" />
            <Input type="number" {...form.register("total_population")} placeholder="Total Population" />
            <Textarea {...form.register("description")} placeholder="Description" />
            <div className="flex justify-between">
              <Button type="submit">Save Changes</Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
