/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  reactStrictMode: false,
  // Production
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "cvai.rebuzzpos.com",
  //       pathname: "/cv_images/**",
  //     },
  //   ],
  // },
  // Local
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "cvai.azurewebsites.net",
  //       pathname: "/cv_images/**",
  //     },
  //   ],
  // },
  // Vs Code
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/cv_images/**",
      },
    ],
  },
};

export default nextConfig;
