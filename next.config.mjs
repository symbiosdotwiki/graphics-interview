/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(fs|vs|frag|vert|glsl)$/,
      use: 'raw-loader',
    });

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/sync', // Use webassembly/sync instead of webassembly/async
      use: 'wasm-loader',
    });

    return config;
  },
};

export default nextConfig;