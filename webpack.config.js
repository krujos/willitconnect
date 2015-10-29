var path = require('path');

module.exports = {
    entry: [
        "./src/main/resources/static/scripts/index.js"
      ],
    output: {
        path: "./src/main/resources/static/scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, exclude: '/node_modules/', loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    }
};
