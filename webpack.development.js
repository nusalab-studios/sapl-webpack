const path = require("path");
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// multiple entry HtmlWebpackPlugin
const entry = {
    index: "index",
    index2: "index2",
};

const entryHtmlPlugins = Object.keys(entry).map(function (entryName) {
    return new HtmlWebpackPlugin({
        template: `src/views/${entryName}.html`,
        filename: `${entryName}.html`,
        inject: false,
    })
});

module.exports = merge(common, {
    mode: 'development',
    watch: true,
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: "3000",
        compress: true,
        open: true,
    },

    module: {
        rules: [
            //html
            {
                test: /\.html$/,
                use: 'html-loader',
            },

            // compile sass
            // automatic browser prefixing
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                outputStyle: "expanded",
                                sourceMap: true,
                            },
                        },
                    ]
                })
            },
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: "css/main.min.css"
        }),
    ].concat(entryHtmlPlugins)
});
