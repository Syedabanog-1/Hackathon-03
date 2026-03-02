/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_STANDALONE === '1' ? { output: 'standalone' } : {}),
  env: {
    KONG_URL: process.env.KONG_URL || process.env.NEXT_PUBLIC_KONG_URL || 'http://localhost:8000',
  },
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-native", "kysely"],
  },
}
module.exports = nextConfig
