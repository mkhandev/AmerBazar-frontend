"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/actions/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading)
    return (
      <div className="bg-white grid [grid-template-columns:repeat(auto-fit,minmax(175px,1fr))] gap-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="p-3 border-r border-b">
            <Skeleton className="h-[130px] w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    );

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1 className="text-[22px] font-normal mb-3">Categories</h1>
      <div className="bg-white grid [grid-template-columns:repeat(auto-fit,minmax(175px,1fr))] gap-3">
        {data?.map((cat: any) => (
          <Link
            key={cat.id}
            href="/"
            className="block p-3 hover:shadow-lg box-border border-r border-b"
          >
            <div>
              <img
                src={cat.image}
                alt={cat.name}
                className="max-h-[130px] mx-auto object-contain"
              />
              <div className="pt-2">
                <h2 className="text-[15px] font-normal text-center">
                  {cat.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
