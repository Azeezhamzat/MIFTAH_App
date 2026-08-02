/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces .next/standalone: a minimal, self-contained server bundle
  // (only the node_modules subset actually used, no devDependencies) —
  // this is what the Electron desktop build packages, instead of shipping
  // the entire project's node_modules.
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

module.exports = nextConfig;
