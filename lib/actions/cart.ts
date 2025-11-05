import { auth } from "@/auth";

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart  session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
}
