const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: isProd ? 'static' : 'disabled',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    }),
  ],
  mode: isProd ? 'production' : 'development',
  optimization: {
    usedExports: isProd, // Enable tree shaking only in production
  }
};
