// Static export + base path are enabled only when building for GitHub Pages
// (the CI workflow sets these env vars). Local `npm run dev` / `build` / `start`
// behave exactly as before.
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export" } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
