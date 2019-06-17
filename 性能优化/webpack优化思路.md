### JS压缩
uglifyjs-webpack-plugin
```
// npm install uglifyjs-webpack-plugin --save-dev
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    }
}
```

### HTML压缩
new htmlWebpackPlugin()
```
<!-- 以下内置能在HTML的src和href的时候省略部分协议，节省资源 -->
new HtmlWebpackPlugin({
    template: __dirname + '/views/index.html', // new 一个这个插件的实例，并传入相关的参数
    filename: '../index.html',
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    },
    chunksSortMode: 'dependency'
})

作者：腾讯课堂NEXT学院
链接：https://juejin.im/post/5b0b7d74518825158e173a0c
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

### webpack3新特性 
ModuleConcatenationPlugin  
[ModuleConcatenationPlugin-变量提升后的bundle-减少变量声明](https://zhuanlan.zhihu.com/p/27980441)

### 提取公共资源：
new webpack.optimize.CommonsChunkPlugin
https://webpack.docschina.org/plugins/commons-chunk-plugin/#src/components/Sidebar/Sidebar.jsx

### 提取CSS并且压缩
[extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)

### 代码分割
splitChunksPlugins => webpack.configuration.optimization
https://webpack.js.org/plugins/split-chunks-plugin/#root

### gzip压缩
1. nginx增加gzip头
2. 不要对图片优化，得不偿失， 服务器CPU占用太大
3. [webpack配置gzip](https://webpack.js.org/plugins/compression-webpack-plugin/#root)
> // nginx开启gzip<br />
gzip on;
gzip_types text/plain application/javascriptapplication/x-javascripttext/css application/xml text/javascriptapplication/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;


### 性能优化实例
https://juejin.im/post/5b0b7d74518825158e173a0c