/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig = {
  distDir: "build",
  output: "export",
  assetPrefix: isProd ? basePath : undefined,
  basePath: isProd ? basePath : undefined,

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(fs|vs|frag|vert|glsl)$/,
      use: "raw-loader",
    });

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/sync", // Use webassembly/sync instead of webassembly/async
      use: "wasm-loader",
    });

    return config;
  },
};

export default nextConfig;
