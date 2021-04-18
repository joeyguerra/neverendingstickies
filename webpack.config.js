const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
module.exports = {
    mode: "production",
    output: {
        libraryTarget: "var",
        library: "App"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Main Page",
            template: path.join(__dirname, "/views/index.html")
        })
    ]
}