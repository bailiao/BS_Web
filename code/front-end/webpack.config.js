// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var package     = require('./package.json');

// module.exports = {
//     entry:{
//         vendor: Object.keys(package.dependencies),
//         index: './src/js/index.js',
//     },
//     output:{
//         path:__dirname+'/dist',
//         filename:'[name].bundle.js'
//     },
//     // module:{
//     //     rules:[
//     //         {test:/\.css$/,loader:"style-loader!css-loader"},
//     //         {test:/\.js$/,loader:"babel-loader",enforce:'pre',
//     //         exclude:/node_modules/,query:{presets:['es2015']}}
//     //     ]
//     // },
//     watch:true,
//     resolve:{
//         alias:{
//             vue: 'vue/dist/vue.js'
//         },
//         extensions: [".js", ".ts"] 
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             hash: true,
//             title: 'Myapplication',
//             myPageHeader: 'DATA',
//             template: './src/html/index.html',
//             chunks: [ 'index'],
//             filename: './src/index.html' 
//         })
//    ]
// }
var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index:"./src/js/index.js",
        task:"./src/js/task.js",
    },
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                //处理css资源
                test: /\.css$/,
                use:["style-loader","css-loader"],
                // use: [
                //     // {
                //     //     loader: MiniCssExtractPlugin.loader,
                //     //     options: {
                //     //       publicPath: './dist',
                //     //     },
                //     // },
                //     // {
                //     //     loader: 'css-loader',
                //     // },
                // ]
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         // // 自动修复eslint的错误，测试时把这儿改成false
            //         // fix: true
            //     }
            // }
        ],
    },
    plugins: [
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: "./src/html/index.html", to: "index.html" },
        //     ],
        
        // }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new HtmlWebpackPlugin({
            template: './src/html/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './src/html/taskList.html',
            filename: 'taskList.html',
            chunks: ['task']
        }),
        // new MiniCssExtractPlugin({
        //     filename: 'style.css',
        // }),

    ],
    //   devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        }
            
    }
};
