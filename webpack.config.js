const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Custom plugin to generate description and TypeScript declarations
class UplinkDescriptionPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('UplinkDescriptionPlugin', (stats) => {
      const uplinkConfig = require('./uplink.config.json');
      const packageJson = require('./package.json');
      
      // Generate description from the controller
      const controllerPath = path.resolve(__dirname, uplinkConfig.entry);
      const content = fs.readFileSync(controllerPath, 'utf-8');
      
      // Extract class description if present
      const description = content.match(/\/\*\*[\s\S]*?\*\//)
        ? content.match(/\/\*\*[\s\S]*?\*\//)[0]
        : uplinkConfig.description || packageJson.description || '';

      // Update uplink.config.json with the description
      uplinkConfig.description = description.replace(/\/\*\*|\*\/|\*/g, '').trim();
      fs.writeFileSync('./uplink.config.json', JSON.stringify(uplinkConfig, null, 2));
      
      // Generate TypeScript declaration files with documentation
      console.log('Generating TypeScript declaration files with documentation...');
      try {
        execSync('npx tsc --declaration --emitDeclarationOnly --outDir ./dist/types', { stdio: 'inherit' });
        
        // Generate API documentation using TypeDoc
        console.log('Generating API documentation with TypeDoc...');
        execSync('npx typedoc --options typedoc.json', { stdio: 'inherit' });
      } catch (error) {
        console.error('Error generating TypeScript declarations or documentation:', error);
      }
    });
  }
}

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: '@uplink-protocol/form-controller',
      type: 'umd',
      umdNamedDefine: true,
    },
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new UplinkDescriptionPlugin()
  ],
  mode: 'production',
  optimization: {
    minimize: true
  }
};
