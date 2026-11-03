"use client";

import React, { createContext, useCallback, useContext } from "react";

/**
 * The admin area is served from a secret, env-configured base path
 * (ADMIN_PATH). The real path is never shipped in the JS bundle: the server
 * layout passes it down through this context to admin-only components.
 */
const AdminPathContext = createContext<string>("");

export function AdminPathProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return <AdminPathContext.Provider value={basePath}>{children}</AdminPathContext.Provider>;
}

/**
 * Returns a builder for admin URLs. Pass the path relative to the admin root,
 * e.g. `adminHref("/dashboard/events/create")`.
 */
export function useAdminHref() {
  const basePath = useContext(AdminPathContext);
  return useCallback((path = "") => `${basePath}${path}`, [basePath]);
}
