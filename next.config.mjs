import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
