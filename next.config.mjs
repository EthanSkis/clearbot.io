/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the supabase-js runtime in Node (not bundled) so the admin client's
  // Node-specific dependencies keep working in server components + route handlers.
  serverExternalPackages: ['@supabase/supabase-js']
};

export default nextConfig;
