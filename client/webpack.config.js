module.exports = {
    entry: `${__dirname}/src/Index.tsx`,
    output: {
        path: `${__dirname}/build`,
        filename: "client.js",
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "typings-for-css-modules-loader?modules&namedExport&camelCase"
                }, {
                    loader: "sass-loader"
                }]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "./client/tsconfig.json",
                }
            },
            {
                enforce: "pre",
                test: /\.jsx?$/,
                loader: "source-map-loader"
            },
        ]
    },
    resolve: {
        extensions: [
            ".ts", ".tsx", ".js", ".scss"
        ]
    },
    cache: true,
    devServer: {
        contentBase: `${__dirname}/public`,
        port: 8080,
    },
    devtool: "source-map"
}