### express和koa的对比，两者中间件的原理，koa捕获异常多种情况说一下?
express中间件： 使用普通函数嵌套回调的方式进行实现，不会等待异步操作，这也使得异步操作中的error难以捕获

koa中间件: 使用generator或者async/await的方式进行中间件的执行，会等待异步操作

express异常捕获： 
- trycatch, 但是异步处理和回调中的报错无法捕捉到
- 采用uncaughtException事件，发生请求错误的时候无法响应请求而且可能导致内存溢出

koa异常捕获：
- app.on('error', (err, ctx) => {})

koa中间件使用： 
```
  const Koa = require('koa')
  const app = new Koa()

  app.use(async (ctx, next) => {
    // code can be excute when Requesting
    await next()
    // code after response
  })

  // normal function
  app.use(function (ctx, next) {
    // code can be excute when Requesting
    return next().then((response) => {
      // code after response
    })
  })
```

express中间件使用： 
```
  const app = express()
  app.use(function (req, res, next) {
    ...
    await next() // simply callback not handle with async code
    ...
  })
```

### koa-compose
koa的中间件模型： 洋葱模型  
- 洋葱模型简介： 
```
  最外层的中间件首先执行。
  调用next函数，把执行权交给下一个中间件。
  ...
  最内层的中间件最后执行。
  执行结束后，把执行权交回上一层的中间件。
  ...
  最外层的中间件收回执行权之后，执行next函数后面的代码。
```

- 洋葱模型源码实现流程：
1. app.use( **async** middlewareFunction ) => 存放进application下的this.middleware队列中  
2. fn = compose(this.middleware) => **compose主要做了中间件自执行**
3. 所有中间件自执行完毕，返回Promise对象并把next赋值fn，运行next，`let fn = middleware[i]; if (i === middleware.length) fn = next`
4. 执行await next()之后的代码


- compose主要实现:  
i为中间件在this.middleware队列中的Index, 递归dispatch(i)

> compose过程详细解剖和koa中间件使用伪代码
// 解剖:
dispatch(0) => 返回fn(context, dispatch(1)) 
=> 执行了dispatch(1) => 返回fn(context, dispatch(2))  
=> dispatch(3) => 返回fn(context, dispatch(4))
=> ... => 最后一个中间件， 返回fn(context, dispatch(this.middleware.length))
=> i === this.middleware.length, fn = next => 调用next => !next => !fn => return Promise.resolve()

// 伪代码
```
  // 正常使用
  app.use(async md1(ctx, next) => {
    <!-- 同步的内容 -->
    await next()
    <!-- 异步的内容 -->
  })

  // 伪代码
  <!-- nextMiddleWareName可以视为next，用于定位下一个中间件 -->
  var koaMiddleware = async md1(ctx, nextMiddleWareName2) => {
    <!-- 第二个中间件代码<await next之前的> -->
    return async nextMiddleWareName(ctx, nextMiddleWareName3) {
      <!-- 进行await next() => 执行next进入第二个中间件的闭包中 -->
      <!-- 第二个中间件代码 -->
      return async nextMiddleWareName3 (ctx, nextMiddleWareName4) {
        <!-- 第三个中间件代码 -->
        return async nextMiddleWareName4 {
          ...
          return finalMiddleware (ctx, next) {
            return Promise.resolve()
          }
        }
      }
    }
  }
```

### 为什么koa会是洋葱型？？
koa中间件是通过函数嵌套进行完成的， 详细可以看看前面`koa-compose章节`里的中间件伪代码, 在await之前会执行本中间件内的代码， 然后在await之后的代码需要等待后面的中间件自执行完毕后才会执行

**为什么response的时候是从最后一个中间件开始返回呢?**  
中间件自执行完毕， 到达最后一个中间件之后， 当前作用域为最内层的闭包， 所以要返回的话，只能从内层向外面进行依次返回


### app.context vs 回调中的ctx
ctx = context + 7个属性挂载(app, res, req, response, request, originalUrl, state)  
[context vs ctx](./koa-js/context-ctx.js)

### 常用koa组件
koa-bodyparser: req.body解析

koa-router: 路由

koa-static: 静态资源

koa-etag: http协商缓存

koa-logger: 日志

