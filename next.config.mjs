/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/for-brands", destination: "/brands", permanent: true },
      { source: "/for-beauty-pros", destination: "/beauty-pros", permanent: true },
    ];
  },
};

export default nextConfig;
