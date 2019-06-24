const Koa = require('koa')
const app = new Koa()

console.log('context-all-property \n')
var str1 = ''
var len1 = 0
for(var i in app.context) {
  len1++
  str1 += i + '    '
}
console.log(len1, str1 + '\n')

console.log('context-enumerable-property \n')
console.log(Object.keys(app.context) + '\n')

app.use(async (ctx, next) => {
  console.log('ctx-all-property \n')
  var str2 = ''
  var len2 = 0
  for(var i in ctx) {
    len2++
    str2 += i + '        '
  }
  console.log(len2, str1 + '\n')

  console.log('ctx-enumerable-property \n')
  console.log(Object.keys(app.context) + '\n')
})
app.listen(3000)
// 1 3 4 5 2