/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Vercel deployment — disables custom server expectation
  output: undefined,

  // Allow Google profile images for NextAuth avatars
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Ignore ESLint errors during production build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during production build (hackathon)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
