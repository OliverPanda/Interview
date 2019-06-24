const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(function (ctx, next) {
  console.log(3)
  next()
})

app.use(async (ctx, next) => {
  console.log(4)
  await next()
  console.log(5)
})

app.listen(3000)
// 1 3 4 5 2