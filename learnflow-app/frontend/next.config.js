/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    KONG_URL: process.env.KONG_URL || 'http://localhost:8000',
  },
}
module.exports = nextConfig
