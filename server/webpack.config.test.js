module.exports = {
    mode: "development",
    resolve: {
        extensions: [".ts", ".js", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: "server/tsconfig.json",
                }
            }
        ]
    }
}