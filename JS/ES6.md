### Map, weakMap, Set, weakSet


### Prmise规范
1. Promise 必须处于3个状态中的其中一个: pending（可转换 fulfilled 或 rejected），fulfilled（不能转换为其他状态），rejected（不能转换为其他状态）
2. thenable，`then`是可以串行的链式调用，且具有 onFulfilled 和 onRejected 为可选参数
3. 错误时必须有抛出异常的原因（reason）
[myPromise](https://github.com/OliverPanda/nativeJS-project/blob/master/promise%E5%AE%9E%E7%8E%B0/promise.js)

### async/await原理？Generator, Generator返回值 （to be continue）
async/await的原理其实就是利用Generator  
Gernerator: 有分段返回能力的函数，可用于处理多个异步操作来实现分段返回，执行 generator 函数会返回一个遍历器对象，我们可以依次调用这个对象的 next 方法去使其内部协程依次执行，但是一定要注意的是同一事件循环线程下不能同时跑 2 个 生成器的 next，否则会报错已经在 running


### if无法产生局部作用域 + let没有变量提升,let暂时性死区(TDZ)
```
// let没有变量提升 + let暂时性死区
var a = 1
if (1) {
  console.log(a) // ReferenceError: Cannot access 'a' before initialization
  let a = 2  
}

// 暂时性死区, y还没声明就被复制给x
function bar (x = y, y = 2) {
  return [x, y]
}
function bar2 (x = 2, y = x) {
  return [x, y]
}
bar() // ReferenceError
bar2() // [2,2]


// if无法产生作用域
var a = 1
if (1) {
  console.log(a) // 1
  var a = 2  
  console.log(a) // 2
}
console.log(a) // 2
```