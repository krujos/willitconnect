const webpackConfig = require('./webpack.config');
delete webpackConfig.entry;
delete webpackConfig.output;
delete webpackConfig.optimization;

webpackConfig.externals = Object.assign({}, webpackConfig.externals, {
    'jsdom': 'window',
    'cheerio': 'window',
    'text-encoding': 'window'
});

module.exports = karma => {
    const config = {
        basePath: ``,
        frameworks: [ 'mocha', 'chai', 'sinon-chai' ], 
        files: ['tests.webpack.js'],
        plugins: [
            'karma-chrome-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-sinon',
            'karma-sinon-chai',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-mocha-reporter'
        ],
        preprocessors: {
            'tests.webpack.js': [ 'webpack', 'sourcemap' ]
        },
        reporters: [ 'mocha' ],
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        autoWatch: true, 
        colors: true,
        browsers: [ 'ChromeHeadless' ],
        singleRun: false,
        logLevel: karma.LOG_INFO
    };

    karma.set(config);
};
