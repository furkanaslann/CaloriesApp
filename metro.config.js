const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Block the problematic path that doesn't exist
config.resolver = {
  ...config.resolver,
  blockList: [
    ...(config.resolver?.blockList || []),
    // Block the non-existent @tybys/wasm-util/dist directory
    /node_modules\/@tybys\/wasm-util\/dist\/.*/,
  ],
};

module.exports = config;

