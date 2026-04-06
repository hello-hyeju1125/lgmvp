/** @type {import('next').NextConfig} */
const isNextDevCommand =
  process.argv[2] === "dev" || process.env.npm_lifecycle_event === "dev";

const nextConfig = {
  // `next build`가 `.next`를 덮어쓴 뒤에도 `next dev`가 실행 중이면, dev가 기대하는
  // `/_next/static/chunks/main-app.js` 등이 디스크에서 404가 나 화면이 깨집니다.
  // 개발 전용 출력은 `.next-dev`로 분리합니다 (NODE_ENV는 config 로드 시점에 아직 없을 수 있음).
  distDir: isNextDevCommand ? ".next-dev" : ".next",
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
    // 로컬에서는 네이티브 파일 감시가 안정적입니다. 폴링은 원격/도커 볼륨 등에서만 켭니다.
    if (dev && process.env.CHOKIDAR_USEPOLLING === "1") {
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
