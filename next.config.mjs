import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default withMDX(config);
