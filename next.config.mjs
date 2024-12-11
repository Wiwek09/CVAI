/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cvai.azurewebsites.net",
        pathname: "/cv_images/**",
      },
    ],
  },
};

export default nextConfig;
