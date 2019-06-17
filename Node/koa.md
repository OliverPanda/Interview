### express和koa的对比，两者中间件的原理，koa捕获异常多种情况说一下?

express中间件： 使用嵌套回调的方式进行实现，不会等待异步操作，这也使得异步操作中的error难以捕获

koa中间件: 使用generator或者async/await的方式进行中间件的执行，会等待异步操作
koa中使用洋葱模型， 定义了use去收集中间件, app.use(middleware)把中间件存储到this.middlewares队列中， 然后compose中进行执行，执行完毕resolve到下一个中间件，确保只有上一个中间件执行完才会执行下一个中间件<br />

express异常捕获： 
- trycatch, 但是异步处理和回调中的报错无法捕捉到
- 采用uncaughtException事件，发生请求错误的时候无法响应请求而且可能导致内存溢出

koa异常捕获：
- app.on('error', (err, ctx) => {})

### koa源码解析，引用自路哥
https://github.com/YOLO0927/koa2-source-code-analysis  
大概总结： 
1. 四大块: application, context, request, response

- application继承与node的事件模块， node事件模块是个发布/订阅模型，所以koa也是和Node一样的异步事件驱动
  - application数据结构:  
    ```
      application: {
        proxy: false,
        middlewara: []
        env: 'development',
        context,
        rquest,
        response
      }
    ```


### 常用koa组件

