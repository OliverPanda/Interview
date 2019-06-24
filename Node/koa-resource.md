### koa源码解析  
可分为四大块: application, context, request, response

- **application**: application继承与node的事件模块， node事件模块是个发布/订阅模型，所以koa也是和Node一样的异步事件驱动

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
  - 从koa最基础的启动tcp服务的方法入手: `const app = new Koa(); app.listen(port)` -> koa源码中listen(this.callback()) -> node原生的http.createServer(callback).listen(port)的简写

  - listen(this.callback())中用到的`this.callback()`  
    => 进入callback(), `fn = compose(this.middleware)`   
    => compose是什么? **实现了中间件自执行, 成功失败都是返回promise**, 具体细节在[koa.md](./koa.md)中的koa-compose章节  
    => createContext:  对app, req, res, ctx,response, request进行初始化和挂载  
    =>  `this.handleRequest(ctx, fn)`，handleRequest: 对中间件执行过程中进行错误捕获

  - 在此整个顶部设计就此完成，从实例化 koa 对象 => 新建服务 => 存取并处理中间件 => 创建并关联上下文 => 顺序控制执行中间件 => 处理最后响应参数 => 全局监听整个中间件的执行过程及 debbug 整个 listen 的过程
  换成函数就是 Application.listen => Application.callback => koa-compose 源码分析 => Application.createContext => Application.handleRequest  

- **context**: 主要进行了cookie存取的集成 + 错误捕获 + 将ctx的一些方法和属性直接转发到ctx.request或者ctx.response下

- **request**和**response**: request和response对象的维护和更新, 没啥好说的...

### 参考
https://github.com/YOLO0927/koa2-source-code-analysis