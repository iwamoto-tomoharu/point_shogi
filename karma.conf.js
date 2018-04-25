module.exports = (config) => {
    let webpackConfig = require(`./${config.basePath}/webpack.config.test`);
    config.set({
        frameworks: ["jasmine"],
        files: ["**/*.spec.ts", "**/*.spec.tsx"],
        preprocessors: {
            "**/*.spec.ts": ["webpack"],
            "**/*.spec.tsx": ["webpack"]
        },
        mime: {
            "text/x-typescript": ["ts","tsx"]
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: "errors-only",
            noInfo: true
        },
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ["Chrome"],
        // singleRun: true, //テスト実行後にブラウザを落とす
    })
};