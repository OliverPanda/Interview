const Koa = require("koa")
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.cookies.set('testCookie', 'test cookie content')
  // ctx.message === ctx.response.message
  ctx.message = '我是测试信息'
  console.log(ctx.response.message) // 我是测试信息
  // 用ctx.path 或者 ctx.request.path进行路由控制
  if (ctx.path === '/') {
    // 测试cookies设置
    var cookie = ctx.cookies.get('testCookie')
    return ctx.body = {
      code: 0,
      data: cookie
    }
  } else {
    return ctx.body = 'this page can not get the cookie returned'
  }
  await next()
})

app.listen(3000)