import { apiUrl } from "@/lib/constants/common";

export async function fetchCategories() {
  const res = await fetch(`${apiUrl}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
