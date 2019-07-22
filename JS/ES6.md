### Map, weakMap, Set, weakSet
#### Set
Set: 类似于数据，但是成员的值都是唯一的， 接受一个数组(或有iterable接口的数据结构-Array, Object, Map, Set, String)作为参数    

常用Set方法: add(value), delete(value), has(value), clear()  
常用Set属性：setInstance.size  
Set加入值的时候不会进行类型转换, **NaN也是可以加入Set中, 且NaN !== NaN， 所以NaN也只能加入一个**    

**Set中使用的判断两个值是否相等使用的是全等(===)**  
键名和键值一样

#### WeakSet
1. 成员不可重复（根据引用地址进行判断）
2. 成员只能是有遍历器的对象，没有size属性
3. 成员都是弱引用, 随时会消失？(**什么时候触发消失？**)， 成员不可遍历， 因为是弱引用，所以删除实例的时候不会引发内存泄漏

#### Set vs WeakSet
1. **WeakSet的成员只能是有遍历器的对象(Array, Object, Set, Map, WeakSet, WeakMap)**, Set可以是任意值或者函数
2. WeakSet没有clear()方法, 没有size属性, 没法遍历成员, Set可以遍历成员
```
// set可以是任意值或者函数
var set = new Set()
set.add(5) // Set(1) {5}
set.add('5') // Set(2) {5, "5"}
set.add(undefined) // Set(3) {5, "5", undefined}
set.add(function () {return 'a'}) // Set(4) {5, "5", undefined, ƒ}
set.add(1 + '23') // // Set(5) {5, "5", undefined, ƒ, '123'}
set.add( (function () {return 'a'})() ) // Set(6) {5, "5", undefined, ƒ, '123', 'a'}

var ws = new WeakSet()
ws.add(1) // TypeError: Invalid value used in weak set
ws.add({a: '1'}) // [[Entries]]: Array(1) - 0: Object(value:)
ws.add([1,2,3]) // [[Entries]]: Array(2)
ws.add(new Set([1,2,3])) // [[Entries]]: Array(3)

// WeakSet对于“重复”的定义是根据引用判断的
var ws2 = new WeakSet()
ws.add({a: 1}) // [[Entries]]: Array(1)
ws.add({a: 1}) // [[Entries]]: Array(2)
var obj = {a: 1}
ws.add(obj) // [[Entries]]: Array(3)
ws.add(obj) // [[Entries]]: Array(3), 添加失败, 通过引用地址判断是否是相同对象
```

#### Map
1. Map和Object一样是键值对的合集
2. Map中key的范围不限于字符串，可以用各种类型的值当key（包括object）
3. 和WeakSet中一样，判断是否相同的key值也是通过引用地址进行判定
```
<!-- 表达式形式 -->
new Map([ ['a', 'b'] ]) // Map(1) {"a" => "b"}, 注意是两个[]
new Map([ ['aa', 'bb', 'cc', 'dd'] ]) // Map(1) {"a" => "b"}, 只取前两个
new Map(new Set([[1,2],[2,3],['a', 'b']])) // Map(3) {1 => 2, 2 => 3, "a" => "b"}

// key的值通过引用地址判定是否为同一个
const m = new Map()
m.set(['a'], 555) // 临时变量temp1 = ['a'], 会分配新的临时引用地址
m.get(['a']) // 又一个临时变量temp2 = ['a'], temp2引用地址与上面的temp1引用地址不一样, undefined
var obj = ['a'] // 给['a']赋值到obj上， 分配引用地址objAddr
m.set(obj, 555)
m.get(obj) // 555, 通过obj的引用地址objAddr判断找到对应值
```
Map常用方法： set(property, value), get(property)  

#### WeakMap
只接受非null对象作为参数



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

2. 扩展运算符(...)

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
1. **async函数的返回值是 Promise 对象** 
2. **await fn()后面的函数fn得是Promise对象()**, 否则返回对应的值

##### async/await的原理其实就是利用Generator, 将 Generator 函数和自动执行器，包装在一个函数里
```
async func fn(args) {
}
// 等同于
function fn(args) {
  // spawn函数就是自动执行器
  return spawn(function* () {

  })
}
```


### Promise
#### Promise/A+规范
1. 三个状态: pending(默认), fulfilled, rejected
2. thenable: then返回一个new Promise, 使得能够继续then
3. 能够进行错误捕捉并reject

#### Promise特性
1. 对象状态改变只有两种可能: 1. pending => fulfilled  2. pending => rejected
2. resolve函数的作用： 将Promise对象从pending => fulfilled, reject作用: 将Promise从pending => rejected
3. 当处于Pending状态(没手动resolve和reject)的时候，无法知道是什么状态
4. Promise(func), func里resolve不是promise的话， func会立即执行，Promise.then里的内容是异步的微任务
5. then方法返回新的Promise实例
6. 在Promise实例p2中， resolve(p1), 如果p1是Promise实例, p1是pending则p2的回调函数func会等到p1状态改变才执行，如果p1是fulfilled或者rejectes, 则p2的回调函数func会立即执行

#### 实现思路： 
> Promise使用demo: 
```
new Promise((resolve, reject) => {

}).then(fulfilledCb[, rejectedCb]).catch((err) => {

})
```
1. Promise回调中自带resolve,reject,所以在构造的时候就应该加上, 然后因为回调不知道会放到哪里用, 所以还是绑定下作用域
```
class MyPromise {
  constructor (cb) {
    try {
      cb(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }
}
```

2. 用到this._resolve, this._reject, 前面提到resolve, reject作用是改变状态, 根据特性4和特性6, resolve的时候需要考虑一下参数是promise的话可能阻塞promise回调执行的情况， 那么开始编写吧！

```
class MyPromise {
  constructor (cb) {
    this._status = PENDING // 传给进入then的时候的状态
    this._value = undefined // promise返回给then的值, val或err
    ...
    cb(this._resolve.bind(this), this._reject.bind(this))
    ...
  }
  _resolve(val) {
    if (this._status !== PENDING) return
    if (val instanceof MyPromise) {
      // 调用val.then(fulfilledCb, rejectedCb)判断val的状态之后才运行当前promise的回调
    }
    this.status = FULFILLED
  }
  _reject (val) {
    if (this._status !== PENDING) return
    this.status = REJECTED
  }
}
```
3. then
#### 特性入手分析
- then用法： `then(fulfilledCb[, rejectedCb])`
- 因为thenable特性，then返回的是一个promise
#### 做了什么？
1. 存储根据上一个promise返回的状态(this._status)判断执行then参数里的fulfilledCb还是rejectedCb
2. 出错 && 没定义rejectedCb的话 => 直接将status置为rejected
3. 捕获resolve(cal)或者reject(val)时遇到的错误
```
  class myPromise {
    ...
    then (fulfilledCb, rejectedCb) {
      return new myPromise((resolve, reject) => {
        // 判断this._status + 错误捕获
      })
    }
  }
```

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

### 静态方法不能用于实例
```
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor
    return this.newColor
  }

  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor
  }
}

const freddie = new Chameleon({ newColor: 'purple' })
freddie.colorChange('orange') // TypeError
```