"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Search = () => {
  //const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const category = searchParams.get("category");
    const query = new URLSearchParams();

    if (category) query.set("category", category);
    if (search.trim()) query.set("q", search.trim());

    router.push(`/search?${query.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="flex flex-row items-center gap-1">
        <Input
          name="q"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="w-full md:w-[100px] lg:w-[500px] bg-white"
        />

        <Button type="submit">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
