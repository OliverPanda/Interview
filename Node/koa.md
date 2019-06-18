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

  - application 数据结构
  ```
    application: {
      middleware: [], // 中间件合集, use的时候push进队列
      env,
      context,
      request,
      response
    }
  ```
  - koa最基础的启动tcp服务的方法: const app = new Koa() -> app.listen(port) -> listen(this.callback()) -> node原生的http.createServer(callback).listen(port)的简写
  - listen中用到的this.callback() => fn = compose(this.middleware) => compose是什么? koa-compose插件, 返回promise,成功resolve的话会带一个函数fn(context, dispatch.bind(null, i + 1))
  - createContext:
  ```
  <!-- 
    对app, ctx, req, res, response, request进行初始化赋值
    response和request是koa自身定义的对象, req和res是node的request, response对象
   -->
  context.app = request.app = response.app = application
  context.req = request.req = response.req = req
  context.res = request.res = response.res = res
  request.ctx = response.ctx = context
  ```



### koa-compose
koa的中间件模型： 洋葱模型  
洋葱模型： （to be continue）
1. app.use(middlewareFunction) => 存放进application下的this.middleware队列中  
2. fn = compose(this.middleware)


compose主要实现:
i为中间件在this.middleware队列中的Index, 递归dispatch(i)

> compose过程详细解剖 
// 解剖:
dispatch(0) => 返回fn(context, dispatch(1)) 
=> 执行了dispatch(1) => 返回fn(context, dispatch(2))  
=> dispatch(3) => 返回fn(context, dispatch(4))
=> ... => 最后一个中间件， 返回fn(context, dispatch(this.middleware.length))
=> i === this.middleware.length, fn = next => 调用next => !next => !fn => return Promise.resolve()

我们留意到, 每次返回的fn(context, dispatch(n))和use中间件的参数async (ctx, next)很像，那么dispatch(n)和next之间会不会有什么关系呢？



### 常用koa组件
koa-bodyparser: req.body解析

koa-router: 路由

koa-etag: http协商缓存

koa-logger: 日志

