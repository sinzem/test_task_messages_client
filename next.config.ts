import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/:path*`, 
  //     },
  //   ]
  // },
  experimental: {
    serverActions: {
      allowedOrigins: ["sinzem.uno", "localhost:3000"]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "7888-178-150-89-75.ngrok-free.app",
        // protocol: "http",
        // hostname: "localhost",
        // hostname: "185.237.204.125",
        // hostname: "192.168.0.184",
        // hostname: "172.29.80.1",
        // hostname: "172.20.240.1",
        // hostname: "172.28.128.1",
        // port: "5500",
        pathname: "/**"
      } 
    ]
  }
};

export default nextConfig;
