import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = "";
const siteUrl = isGitHubPages
  ? "https://strashineltd.github.io"
  : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
