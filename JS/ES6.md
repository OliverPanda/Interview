### Map, weakMap, Set, weakSet
Set: 类似于数据，但是成员的值都是唯一的， 接受一个数组(或有iterable接口的数据结构-Array, Object, Map, Set, String)作为参数  
常用Set方法: add(value), delete(value), has(value), clear()


### Prmise规范
1. Promise 必须处于3个状态中的其中一个: pending（可转换 fulfilled 或 rejected），fulfilled（不能转换为其他状态），rejected（不能转换为其他状态）
2. thenable，`then`是可以串行的链式调用，且具有 onFulfilled 和 onRejected 为可选参数
3. 错误时必须有抛出异常的原因（reason） 
4. [myPromise.js](https://github.com/OliverPanda/nativeJS-project/blob/master/promise%E5%AE%9E%E7%8E%B0/promise.js)

### Iterator ? Generator ? async/await ?
#### Iterator
Iterator: 对象的遍历器生成函数， 可以自定义obj[Symbol.iterator]使得对象具有Iterator接口  

**自带Iterator接口的数据结构**  
Object, Array, Map, Set, String, TypedArray, arguments对象, NodeList对象

Iterator接口作用：
1. 为各种数据结构提供统一的、简便的访问接口
2. 使得数据结构的成员按照某种次序排列
3. for...of的主要消费对象

Iterator默认部署在数据结构的Symbol.iterator属性

调用Iterator接口的场合
1. 解构复制, 对数组和Set进行解构会默认调用Symbol.iterator

2. 扩展运算符

3. yield* + 可遍历结构

4. 所有接受数组作为参数的API： for...of, Array.from(), Map(), Set(), WeakMap(), WeakSet(), Promise.all(), Promise.race()

```
  // 扩展运算符
  [...'String'] => ["S", "t", "r", "i", "n", "g"]

  // yield* + 可遍历结构调用iterator
  function* testFn () {
    yield [2,3,4]
  }
  function* test () {
    yield* [2,3,4]
  }
  var a = testFn()
  a.next() // {value: Array(3), done: false}
  var b = test()
  b.next() // {value: 2, done: false}
  b.next() // {value: 3, done: false}
  b.next() // {value: 4, done: false}
```

#### Gernerator
Gernerator: 有分段返回能力的函数，可用于处理多个异步操作来实现分段返回，执行 generator 函数会返回一个Generator对象，我们可以依次调用这个对象的 next 方法去使其内部协程依次执行，但是一定要注意的是同一事件循环线程下不能同时跑 2 个 生成器的 next，否则会报错已经在 running  

> 关键字： yield   next<br />
yield:  Generator函数遍历器的暂停标志, yield 123 + 456， 不会立马计算结果，只有当next将指针移动到这一步的时候才会进行求值，用于非Generator函数会报错  
next: 可以携带一个参数，当作上一个yield表达式的返回值， 不带默认undefined

Generator使用demo
```
function step1 () {
	setTimeout(() => { console.log('step1') }, 1000)
}
function step2 () {
	setTimeout(() => { console.log('step2') }, 1000)
}

function* controlGenerator () {
	yield step1()
	yield step2()
	return 'ending'
}

var a = controlGenerator()
var testReturn = a.next() // step1, testReturn: {value: undefined, done: false}
a.next() // step2, {value: undefined, done: false}
a.next() // ending, {value: 'ending', done: true}
a.next() // {value: undefined, done: true}

// 一个Generator只能进行一次return, return 后的yield全是无效的
function* testGenerator () {
	yield step1()
	return 'ending'
	yield step2()
}

var a = testGenerator()
a.next() // step1, {value: undefined, done: false}
a.next() // ending, {value: 'ending', done: true}
a.next() // 不执行step2, {value: undefined, done: true}

// 返回iterator对象实例, Generator vs normalFunction
function* g () {}
function normal () {}

var a = g()
var b = normal()
a instanceof g // true
b instanceof normal // false
```
#### async
async/await的原理其实就是利用Generator  


### let考察
```
// let没有变量提升 + let暂时性死区
var a = 1
if (1) {
  console.log(a) // ReferenceError: Cannot access 'a' before initialization
  let a = 2  
}

// 暂时性死区报错, y还没声明就被复制给x
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

结论： if无法产生局部作用域 + let没有变量提升 + let暂时性死区(TDZ)
```