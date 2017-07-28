const webpack = require('webpack')
const path = require('path')
const endPath = path.resolve(__dirname, 'public')

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  cache: true,
  // watch: true,
  entry: [
    'react-hot-loader/patch', // Activa Hot Module Reloading HMR para React
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    './src/main.jsx'
  ],
  output: {
    path: endPath,
    filename: 'app.js',
    publicPath: '/' // Necesario para el Hot-Reloading
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: '/node_modules/',
        use: 'babel-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    contentBase: endPath,
    inline: true,
    compress: true,
    port: 9000,
    publicPath: '/'
  }
}
