import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-netflix-carbon text-white flex flex-col md:flex-row">
      {/* Sidebar (Responsive drawer on mobile, sticky sidebar on desktop) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
