const Webpack = require('webpack');
const Path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const fs = require('fs');
const glob = require('glob');

const isProduction = process.argv.indexOf('-p') >= 0;
const outPath = Path.join(__dirname, './build');
const sourcePath = Path.join(__dirname, './src');


// 清除build文件夹下的所有文件
console.log('Clean build files...');
glob(outPath + '/*/*.*', {}, function (er, files) {
    files.forEach(function (file) {
        console.log('delete file:' + file);
        fs.unlinkSync(file);
    });
    console.log('Clean done.');
});

module.exports = {
    context: sourcePath,
    entry: {
        main: './index.tsx',
        // vendor: [
        //     'react',
        //     'react-dom',
        //     'react-redux',
        //     'react-router',
        //     'react-router-dom',
        //     'react-router-redux',
        //     'react-addons-perf',
        //     'redux',
        //     'redux-actions',
        //     'redux-form',
        //     'redux-thunk',
        //     'redux-inject-reducer',
        //     'redux-promise-middleware'
        // ]
    },
    output: {
        path: outPath,
        publicPath: './',
        filename: 'assets/js/[name][hash].js',
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        // Fix webpack's default behavior to not load packages with jsnext:main module
        // https://github.com/Microsoft/TypeScript/issues/11677
        mainFields: ['browser', 'main']
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|tsx|js|ts)$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [ tsImportPluginFactory( { libraryName: "antd", style: "css" }) ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                },
                exclude: /node_modules/
            },
            { test: /\.(jpg|jpeg|png|gif|svg)/, use: 'url-loader?limit=5000&name=img/[name].[hash].[ext]' },
            // css
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMap: !isProduction,
                                importLoaders: 1,
                                localIdentName: '[local]'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('postcss-import')({ addDependencyTo: Webpack }),
                                    require('postcss-url')(),
                                    require('postcss-cssnext')(),
                                    require('postcss-reporter')(),
                                    require('postcss-browser-reporter')({ disabled: isProduction }),
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','less-loader']
                })
            },
            // static assets
            { test: /\.html$/, use: 'html-loader' },
        ],
    },
    plugins: [
        new ManifestPlugin({
            fileName: 'manifest.json',
            basePath: 'assets/'
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // node_modules内的任何必需模块都将提取给依赖包
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        Path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // 将webpack运行时和模块清单提取到其自己的文件，以防止在更新应用程序包时更新依赖包
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin({
            filename: 'assets/css/[name][contenthash].css',
            disable: !isProduction
        }),
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
    ],
    devServer: {
        contentBase: sourcePath,
        historyApiFallback: true,
        hot: true,
        stats: {
            warnings: false
        },
    },
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty'
    }
};