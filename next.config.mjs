import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://e2b.dev/:path*",
      },
    ];
  },
};

export default withMDX(config);
