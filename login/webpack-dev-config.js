/**
 * 开发模式下的webpack配置
 * 在整个项目开发过程中，几乎99%的时间都是在这个模式下进行的
 * 注意。两种模式的配置有较大差异！！
 */

const path = require('path');
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'; // 拷贝文件
import precss from 'precss'
import autoprefixer from 'autoprefixer'
import rucksackCss from 'rucksack-css'
import px2rem from 'postcss-pxtorem';
const px2remOpts = {
    rootValue: 37.5,
    propWhiteList: [],
};

export default {
    debug: true,
    noInfo: true, // set to false to see a list of every file being bundled.
    devtool: '#cheap-module-eval-source-map',
    entry: [
        './src/webpack-public-path',  // 服务器静态资源路径配置，保证首先载入
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',
        path.resolve(__dirname, 'src/js/index.jsx')
    ],
    target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
        path: `${__dirname}/src`, // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js',
        // 添加 chunkFilename
        chunkFilename: '[name].[chunkhash:5].chunk.js',
    },
    plugins: [
        // 将第三方js从src直接拷贝到dist/lib目录下，这样就不需要经过es6的编译转换了
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/lib'),
                to: path.resolve(__dirname, 'dist/lib'),
                force: true,
                toType: 'dir',
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
            template: 'src/index.html',
            title: '开发模式',
            favicon:'./src/favicon.ico',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
            // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更新！
            hash:true,
            inject: 'body'
        })
    ],
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['', '.web.js', '.js', '.jsx', '.json'],

        // 路径别名, 懒癌福音
        alias:{
            // 以前你可能这样引用 import { Nav } from '../../components'
            // 现在你可以这样引用 import { Nav } from 'app/components'
            app:path.resolve(__dirname,'src/js'),

            // 以前你可能这样引用 import "../../../styles/mixins.scss"
            // 现在你可以这样引用 import "style/mixins.scss"
            style:path.resolve(__dirname,'src/styles')
            // 注意：别名只能在.js文件中使用。
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            // 组件样式，需要私有化，单独配置
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src/js'),
                loaders: [
                  'style',
                  'css?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
                  'postcss?parser=postcss-scss'
                ]
            },
            // 公有样式，不需要私有化，单独配置
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src/styles'),
                loader: 'style!css!postcss?parser=postcss-scss'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'node_modules'),
                loader: 'style!css!postcss'
            },
            {
                test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.(gif|jpe?g|png|ico)$/,
                loader: 'url?limit=10000'
            }
        ]
    },
    postcss: ()=> [precss,autoprefixer,rucksackCss,px2rem(px2remOpts)]
};
