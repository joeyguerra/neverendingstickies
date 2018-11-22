const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
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
            template: path.join(__dirname, "/public/index.html")
        })
    ]
}