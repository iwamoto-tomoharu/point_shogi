module.exports = {
    entry: `${__dirname}/src/Main.ts`,
    output: {
        path: `${__dirname}/build`,
        filename: "client.js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "./client/tsconfig.json",
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
    devServer: {
        contentBase: `${__dirname}/public`,
        port: 8080,
    },
    devtool: "source-map"
}