import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default Vercel build model: `/` prerenders to static HTML, `/api/chat`
  // runs as a Function. No `output: 'export'` (it would kill the API route),
  // no Cache Components, no React Compiler, no Tailwind (see PLAN.md).
};

export default nextConfig;
