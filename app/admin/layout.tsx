"use server";

import AdminLayoutWrapper from "@/app/admin/AdminLayoutWrapper";
import { requireAdmin } from "@/lib/constants/admin-auth-guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
