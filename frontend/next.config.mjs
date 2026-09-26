/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@saas/types', '@saas/validation'],
};

export default nextConfig;
