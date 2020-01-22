
const merge = require('webpack-merge');
const common = require('./webpack.common');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const browsers = "last 50 versions";
const autoprefixerConfig = autoprefixer({
    browsers
});

// source files
const inputPath = {
    fonts: 'src/assets/fonts',
    images: 'src/assets/images',
    videos: 'src/assets/videos',
    sprites: 'src/assets/fonts/sprites/*.svg',
    css: 'src/assets/css',
    javascriptVendors: 'src/assets/js/vendors',
}

const outputPath = {
    fonts: 'fonts',
    images: 'images',
    videos: 'videos',
    sprites: 'fonts/sapl-sprites.svg',
    extract: 'css/main.min.css',
    css: 'css/vendors',
    javascriptVendors: 'js/vendors',
}

// multiple entry HtmlWebpackPlugin
const entry = {
    index: "index",
    index2: "index2",
};

const entryHtmlPlugins = Object.keys(entry).map(function (entryName) {
    return new HtmlWebpackPlugin({
        template: `src/views/${entryName}.html`,
        filename: `${entryName}.html`,
        inject: false
    })
});

module.exports = merge(common, {
    mode: "production",
    module: {
        rules: [
            //html
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        removeComments: true,
                        collapseWhitespace: true,
                    },
                }, ],
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
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: () => {
                                    return autoprefixerConfig;
                                }
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                outputStyle: "compressed",
                            },
                        },
                    ]
                })
            },
        ]
    },

    plugins: [
        new CleanWebpackPlugin('dist'),
        new CopyWebpackPlugin([
            {
                from: inputPath.fonts,
                to: outputPath.fonts,
                ignore: ['sprites/*'],
            },
            {
                from: inputPath.images,
                to: outputPath.images,
            },
            {
                from: inputPath.videos,
                to: outputPath.videos,
            },
            {
                from: inputPath.css,
                to: outputPath.css,
            },
            {
                from: inputPath.javascriptVendors,
                to: outputPath.javascriptVendors,
            }
        ]),
        new ImageminPlugin({
            test: /\.(jpe?g|png)$/i,
            plugins: [
                imageminMozjpeg({
                    quality: 65,
                    progressive: true
                })
            ],
            optipng: {
                enabled: false,
            },
            pngquant: {
                quality: 65,
                speed: 5,
            },
        }),
        new SVGSpritemapPlugin(inputPath.sprites, {
            output: {
                filename: outputPath.sprites,
                svg4everybody: true,
                svgo: true,
            },
            sprite: {
                prefix: 'si-',
            },
        }),
        new ExtractTextPlugin({
            filename: outputPath.extract,
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                beautify: false,
                ecma: 6,
                compress: true,
                comments: false,
            }
        })
    ].concat(entryHtmlPlugins)
});
