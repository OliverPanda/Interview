### Map, weakMap, Set, weakSet


### Generator, Generator返回值


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