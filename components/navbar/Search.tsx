import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

const Search = () => {
  return (
    <form action="/search" method="GET">
      <div className="flex flex-row items-center gap-1">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="w-full md:w-[100px] lg:w-[500px] bg-white"
        />

        <Button>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
