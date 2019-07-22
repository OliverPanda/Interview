### webpack使用流程
1. 参数合并, const finalConfiguration = webpack-merge(configuration)

2. const conpiler = webpack(configuration), compiler作用域整个compliatioin(编译)阶段

3. compiler.run()


### loader编写
loader通常用于解析某后缀名的文件，webpack中loader默认返回一个字符串，

1. 同步loader ---> this.callback()   异步loader ---> this.async()

2. 常用loader解析
  - style-loader: 把css文件require()进来<loaderUtils.stringifyRequest可以把url转为可require的路径>
  - css-loader: 解析@import和link转为require
  - file-loader: module.exports.raw = true表示loader返回一个二进制buffer, this.emitFile()告诉webpack要生成文件

3. 基础例子
```
const { getOptions } = require('loader-util')
module.exports = function (source) {
  var options = getOptions(this)
  console.log('该loader的参数为： ', options)
  return `JSON.stringify(source)`
}

```

### plugins
1. 基础实例
```
// 异步plugins
class BaseAsyncPlugins {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('msg', (complilation, callback) => {
      // ...
      callback()
    })
  }
}
module.exports = BaseAsyncPlugins

// 同步plugins
class BaseSyncPlugins {
  apply (compiler) {
    compiler.hooks.emit.tap('msg', (params) => {
      // params可有可无
      return true // emit output
    })
  }
}
module.exports = BaseSyncPlugins
```

### loader和plugins的区别
loader一般用于文件解析， 比如require某个文件的时候，调用某一个或多个loader对该文件进行解析，一般返回字符串，可以定义loader的export.defautls.raw = true返回buffer

plugins比loader要灵活，plugins是一个有apply(compiler)方法的js对象， 会被webpack compiler进行调用， 然后**作用于整个webpack的编译(compilation)过程，甚至可以调用API中断webpack的编译**

总结： 
loader更多的感觉是针对于webpack编译之前的文件解析操作   
plugin则是更多偏向编译过程中的操作, plugin里的apply(compiler)中能用很多compiler的钩子函数， 能注入到不同的编译阶段，甚至可以中断webpack的编译


### 常用webpack配置说明、loader实例、plugins实例
https://github.com/OliverPanda/webpackPractice

