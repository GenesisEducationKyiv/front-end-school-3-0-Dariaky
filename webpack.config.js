const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: isProd ? process.env.ANALYZER_MODE_PROD : process.env.ANALYZER_MODE_DEV,
      reportFilename: isProd ? process.env.REPORT_FILENAME_PROD : process.env.REPORT_FILENAME_DEV,
      openAnalyzer: false
    }),
    new DefinePlugin({
      ngDevMode: JSON.stringify(!isProd), // Define ngDevMode based on the environment
    }),
  ],
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            dead_code: true,
            unused: true,
          },
        },
      }),
    ],
    usedExports: isProd, // Enable tree shaking only in production
  },
  devtool: isProd ? false : 'source-map', // Enable source maps in development
};
