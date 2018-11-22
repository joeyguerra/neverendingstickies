const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    mode: "production",
    entry: "./lib/App.mjs",
    output: {
        libraryTarget: "var",
        library: "App"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Main Page",
            template: "./public/index.html"
        })
    ]
}