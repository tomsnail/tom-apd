/**
 * Created by Administrator on 2017-09-14.
 */

var htmlWebpackPlugin = require('html-webpack-plugin');
//var PrerenderSpaPlugin = require('prerender-spa-plugin')
var glob = require('glob');
var path=require('path');

var webpackConfig = {
    /* 一些webpack基础配置 */
    //js入口文件我们默认以多入口为例子，其他用法可以关注我的文章后续会发出来
    entry:{
        header:'./src/js/header.js',
        footer:'./src/js/footer.js'
    },
    //打包输出的js文件位置［name］会按照模块的名称自动生成两个js文件
    output:{
        filename:'javascripts/[name]-bundle.js',
        chunkFilename: "javascripts/[id]-bundle.js?",
        //这里没有使用 path模块来构建目录的路径有需要的可以单独修改
        path:__dirname+'/public',
        //publicPath非常重要它可以放置页面的依赖关系在生成之后出现路径问题
        publicPath:'/'
    },
    //webpack把vuejs的名称指向修改出问题需要它来修改
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    //loader加载器
    module:{
        rules:[
            {
                test:/\.js/,
                loader:'babel-loader',
                include:[path.resolve(__dirname,'src/js')],
            },
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {	//css加载器
                test:/\.css$/,
                loader:'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loader: ["style", "css", "sass"]
            },
            //{
            //    test: /\.(scss|sass)$/,
            //    loader: ["node-sass", "vue-style-loader", "css-loader", "sass-loader"]
            //},
            {   //html加载器（html－webpack－plugin默认以ejs加载页面防止报错我们需要html加载器）
                test:/\.html$/,
                loader:'html-loader'
            },
            {
                test: /\.(png|eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                loader: "file-loader"
            }
        ]
    },
    //html页面扩展
    plugins:[
        /*new PrerenderSpaPlugin(
            // Absolute path to compiled SPA
            path.resolve(__dirname, '../views'),
            // List of routes to prerender
            [ '/about'],
            {
                // options
            }
        ),*/
    ]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function(filepath) {
        // 取倒数第二层(view下面的文件夹)做包名
        var split = filepath.split('/');
        var filename = split[split.length - 1];
        var name=filename.split('.')[0];

        entries[name] = './' + filepath;
    });

    return entries;
}

var entries = getEntries('src/js/*.js');

Object.keys(entries).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];

    // 每个页面生成一个html
    var plugin = new htmlWebpackPlugin({
        // 生成出来的html文件名
        filename: __dirname+'/views/'+name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './src/tpl/index.html',
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        //chunks: [name,'header','footer'],
        chunks: [name]
    });
    webpackConfig.plugins.push(plugin);

})
module.exports=webpackConfig;


