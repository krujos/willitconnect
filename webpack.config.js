const path = require('path');
const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// Add core-js polyfills
require('core-js/stable');

module.exports = {
    context: __dirname,
    mode: debug ? 'development' : 'production',
    entry: [
        "./src/main/script/Index.js"
    ],
    output: {
        path: path.resolve(__dirname, "build/resources/main/static/script/"),
        filename: "bundle.js",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(js|jsx|es6)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'entry',
                                corejs: 3
                            }],
                            ['@babel/preset-react', {
                                runtime: 'automatic'
                            }]
                        ],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000
                    }
                },
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000
                    }
                },
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000
                    }
                },
                generator: {
                    filename: 'images/[name][ext]'
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules'),
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.es6']
    },
    optimization: {
        minimize: !debug,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    compress: {
                        warnings: false,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true
                    }
                }
            })
        ]
    },
    devtool: debug ? 'source-map' : false
};
