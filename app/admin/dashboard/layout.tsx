import React from "react";
import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminFromCookies } from "@/lib/security/request-guard";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defence in depth: middleware already checks the session.
  const adminUser = await getAdminFromCookies();
  if (!adminUser) notFound();

  return (
    <div className="min-h-screen bg-netflix-carbon text-white flex flex-col md:flex-row">
      <AdminSidebar adminUser={adminUser} />
      <main className="flex-1 min-w-0 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
