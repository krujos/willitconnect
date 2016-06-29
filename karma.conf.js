const webpackConfig = require('./webpack.config');
delete webpackConfig.entry;
delete webpackConfig.output;
delete webpackConfig.plugins;

webpackConfig.externals = Object.assign({}, webpackConfig.externals, {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true,
    'text-encoding': 'window'
});

module.exports = karma => {
    const config = {
        basePath: ``,
        frameworks: [ 'mocha', 'chai' ], 
        files: ['tests.webpack.js'],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-mocha-reporter'
        ],
        preprocessors: {
            'tests.webpack.js': [ 'webpack' ]
        },
        reporters: [ 'mocha' ],
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        },
        autoWatch: true, 
        colors: true
    };

    config.logLevel = config.LOG_INFO;
    config.browsers = [ 'PhantomJS' ];
    karma.set(config)
};
