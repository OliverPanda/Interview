const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  // 懒得额外的koa-router插件
  if (ctx.request.path === '/test') {
    setTimeout(() => {
      throw new Error('this is a error') // 能正常捕捉到
    }, 1000)
  }
  if (ctx.request.path === '/testNormalFunc') {
    return next().then(() => {
      setTimeout(() => {
        throw new Error('this is second error') // 能正常捕捉到
      }, 1000)
    })
  }
})


app.listen(3000)