const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const dotenv = require('dotenv');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: isProd ? process.env.ANALYZER_MODE_PROD : process.env.ANALYZER_MODE_DEV,
      reportFilename: isProd ? process.env.REPORT_FILENAME_PROD : process.env.REPORT_FILENAME_DEV,
      openAnalyzer: isProd ? process.env.OPEN_ANALYZER_PROD === 'true' : process.env.OPEN_ANALYZER_DEV === 'true',
    }),
  ],
  mode: isProd ? 'production' : 'development',
  optimization: {
    usedExports: isProd, // Enable tree shaking only in production
  },
  devtool: isProd ? false : 'source-map', // Enable source maps in development
};
