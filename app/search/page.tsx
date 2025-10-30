import SearchPageClient from "@/components/SearchPageClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  page?: string;
};

const SearchPage = async (props: any) => {
  const searchParams = await props.searchParams;

  console.log(searchParams);

  return (
    <Suspense fallback={<Skeleton className="w-64 h-10 rounded-md" />}>
      <SearchPageClient searchParams={searchParams} />
    </Suspense>
  );
};

export default SearchPage;
