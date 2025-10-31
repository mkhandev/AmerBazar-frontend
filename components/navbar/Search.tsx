"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Search = () => {
  //const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");

  //Keep the search box synced with URL
  // when click clear button from search page
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());

    const category = searchParams.get("category");
    const price = searchParams.get("price");
    const rating = searchParams.get("rating");
    const sortby = searchParams.get("sortby");

    if (category) query.set("category", category);
    if (price) query.set("price", price);
    if (rating) query.set("rating", rating);
    if (sortby) query.set("sortby", sortby);

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
