const path = require('path');

module.exports = {
    entry: [
        'babel-polyfill',
        "./src/main/scripts/Index.js"
      ],
    output: {
        path: "./src/main/resources/static/scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, exclude: '/node_modules/', loader: "style!css" },
            { test: /\.(js|jsx|es6)$/, exclude: /node_modules/, loader: 'babel',
                query: {
                            plugins: ['transform-runtime'],
                            presets: ['react','es2015', 'stage-0']
                }
            },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}

        ]
    },
    resolve: {
        moduleDirectories: [
            path.join(__dirname, `node_modules`),
            path.join("./src/main/scripts/Index.js")
        ],
        extensions: [``, `.js`]
    }
};
