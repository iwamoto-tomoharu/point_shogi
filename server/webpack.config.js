const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "development",
    entry: `${__dirname}/src/Main.ts`,
    output: {
        path: `${__dirname}/build`,
        filename: "server.js",
        libraryTarget: "commonjs"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    configFile: "server/tsconfig.json",
                },
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: [
            ".ts", ".js"
        ]
    },
    externals: [
        nodeExternals(),
        {
            "ws": true,
            "child_process": true,
        },
    ],
    devtool: "source-map"
}