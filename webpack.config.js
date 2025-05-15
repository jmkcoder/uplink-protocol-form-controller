const path = require('path');
const fs = require('fs');

// Custom plugin to generate description
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
