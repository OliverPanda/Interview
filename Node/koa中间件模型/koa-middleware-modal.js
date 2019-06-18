const Koa = require("koa")
const app = new Koa()
console.log(app, 'test')
app.use(async (ctx, next) => {
  console.log(1)
  await next() // dispatch.bind(null, i + 1)
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(5)
  await next()
  console.log(6)
})

app.listen(3000)
// 1
// 3
// 5
// 6
// 4
// 2
