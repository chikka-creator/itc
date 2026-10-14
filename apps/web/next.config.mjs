/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@itc/config', '@itc/types'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        libsql: 'commonjs libsql',
        '@libsql/client': 'commonjs @libsql/client',
        bcryptjs: 'commonjs bcryptjs',
      });
    }
    return config;
  },
};

export default nextConfig;
