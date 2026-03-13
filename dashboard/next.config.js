/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    GITHUB_REPO: process.env.GITHUB_REPO,
    COOLIFY_APP_UUID: process.env.COOLIFY_APP_UUID,
  },
}
module.exports = nextConfig
