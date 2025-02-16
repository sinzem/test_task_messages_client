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
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.184",
        // hostname: "172.29.80.1",
        // hostname: "172.20.240.1",
        port: "5500",
        pathname: "/**"
      } 
    ]
  }
};

export default nextConfig;
