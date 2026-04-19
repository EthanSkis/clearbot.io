/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Route handlers + server actions both talk to Supabase; keep them
    // running in the Node runtime so we can use the admin client.
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
};

export default nextConfig;
