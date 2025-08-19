/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude functions folder from Next.js build
  webpack: (config, { isServer }) => {
    // Ignore functions folder during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/functions/**', '**/node_modules/**']
    };
    
    return config;
  },
  
  // Exclude functions directory from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Exclude functions from file system routing
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Removed experimental optimizeCss due to build issues
  // experimental: {
  //   optimizeCss: true,
  // }
};

module.exports = nextConfig;