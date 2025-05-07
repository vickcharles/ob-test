const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// The compiled JavaScript files will be in the /dist directory
const baseUrl = path.join(__dirname, 'dist');

// Load paths from tsconfig
const { paths } = require('./tsconfig.json').compilerOptions;

// Register the path mapping for compiled JS files
tsConfigPaths.register({
  baseUrl,
  paths: {
    '@/*': ['*'] // Map @/* to dist/* for the compiled JavaScript
  }
}); 