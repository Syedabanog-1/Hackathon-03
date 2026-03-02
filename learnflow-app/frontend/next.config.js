/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone output is only for Docker/K8s — Vercel manages its own output
  ...(process.env.BUILD_STANDALONE === '1' ? { output: 'standalone' } : {}),
  env: {
    KONG_URL: process.env.KONG_URL || process.env.NEXT_PUBLIC_KONG_URL || 'http://localhost:8000',
  },
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless", "ws"],
  },
}
module.exports = nextConfig
