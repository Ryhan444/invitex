import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPathProvider } from "@/components/admin/AdminPathContext";
import { getAdminBasePath, isAdminConfigured } from "@/lib/security/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const basePath = getAdminBasePath();
  if (!basePath || !isAdminConfigured()) notFound();

  return <AdminPathProvider basePath={basePath}>{children}</AdminPathProvider>;
}
