module.exports = {
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
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "./server/tsconfig.json",
                }
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
    externals: {
        "ws": true,
        "child_process": true,
    },
    devtool: "source-map"
}