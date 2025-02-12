"use client"; //  Mark this as a Client Component

import { useState } from "react";
import { Input } from "@/components/ui/input";
import SpeciesCard from "./species-card";
import type { Database } from "@/lib/schema"; // Import correct schema

type Species = Database["public"]["Tables"]["species"]["Row"];

interface SpeciesListClientProps {
  species: Species[]; // Ensure species is an array of the correct type
  sessionId: string;
}

export default function SpeciesListClient({ species, sessionId }: SpeciesListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filters species based on search query
  const filteredSpecies = species.filter((sp) =>
    [sp.scientific_name, sp.common_name, sp.description]
      .filter(Boolean) // Remove null/undefined values
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Search bar for filtering */}
      <Input
        type="text"
        placeholder="Search species..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      <div className="flex flex-wrap justify-center">
        {filteredSpecies.length > 0 ? (
          filteredSpecies.map((sp) => (
            <SpeciesCard key={sp.id} species={sp} sessionId={sessionId} />
          ))
        ) : (
          <p className="text-gray-500">No species found.</p>
        )}
      </div>
    </>
  );
}
