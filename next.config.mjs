import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
    reactOwnerStack: true,
    ppr: true,
    useCache: true,
    staleTimes: {
      dynamic: 180,
      static: 180,
    },
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          // config to prevent the browser from rendering the page inside a frame or iframe and avoid clickjacking http://en.wikipedia.org/wiki/Clickjacking
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
      ],
    },
  ],
};

export default withMDX(config);
