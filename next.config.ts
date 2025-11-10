import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "api.amerbazar.mkhandev.info",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000", // match your local dev port
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // optional if using localhost instead of 127.0.0.1
      },
    ],
  },
};

export default nextConfig;
