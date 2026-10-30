import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pyodide runs in a separate sandboxed process (grader/runner.mjs); keep it out of the bundle.
  serverExternalPackages: ["better-sqlite3", "pyodide"],
};

export default nextConfig;
