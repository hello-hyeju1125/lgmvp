/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // EC2 등 원격/마운트 환경에서 파일 변경 감지 보장
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 200,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;
