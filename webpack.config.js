const path = require('path');
const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');

module.exports = {
      context: __dirname,
    entry: [
        'babel-polyfill',
        "./src/main/script/Index.js"
      ],
    output: {
        path: __dirname + "/build/resources/main/static/script/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, exclude: '/node_modules/', loader: 'style-loader!css-loader' },
            { test: /\.(js|jsx|es6)$/, exclude: /node_modules/, loader: 'babel-loader',
                query: {
                            plugins: ['transform-runtime'],
                            presets: ['react', 'stage-2', "env"]
                }
            },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'}

        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, `node_modules`),
            path.join("./src/main/script/Index.js")
        ],
        extensions: [`.js`, `.jsx`]
    },
  plugins: debug ? [] : [
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourcemap: false,
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        }
      })
    ],
};

