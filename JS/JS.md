### 写一个js函数，实现对一个数字每3位加一个逗号，如输入100000， 输出100,000（不考虑负数，小数）—百度前端面试题
```
  // 我自己平时用到的方案
  function toThousands (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3}) + $)/g, '$1,')
  }
```

### 数组去重
1. 最简单的方法： Array.from(new Set(targetArray))， [...new Set(targetArray)]
```
  // 单纯用new Set的话可以去重， 不过返回的数据格式是Set，所以要Array.from
  var a = Array.from(new Set([1,2,2,2, 3, 4])) // [1, 2, 3, 4]
```
2. filter
```
/**
 * 
 * @param {需要去重的数组} target
 * indexOf(searchValue, start=0)
 * arr: 会传入target
 * 对数组使用indexOf()会返回第一个匹配到的index， 所以只会返回第一次匹配
 */
function unique (target) {
  return target.filter((item, index, arr) => arr.indexOf(item, 0) === index)
}
```

### 二维数组扁平化为一维数组
1. Array.property.flat(depth), depth默认为1，会移除数组中的空项
```
var arr = [1, 2, [3, 4, [5, 6]]]
arr.flat() // [1, 2, 3, 4, [5, 6]], 默认深度1
```
[flat-demo截图](./flat-demo.png)

2. 使用concat
```
  var a = [1,2,3,[4,5]]
  [].concat.apply([], a) // [1, 2, 3, 4, 5]
  [].concat.call([], a[0], a[1], a[2], a[3]) // [1,2,3,4,5]

  var b = [[1,2,3],[3,4],[5]]
  Array.prototype.concat.apply([], b) // [1, 2, 3, 3, 4, 5]
  Array.prototype.concat.call([], b) // [Array(3), Array(2), Array(1)] - [[1,2,3], [3,4], [5]]
```
[flat-concat截图](./flatByConcat.png)


### call和apply的区别？
call(): 除了作用域外，可以接受多个参数，依次传入
apply(): apply(作用域, 参数数组), 除了作用域外，只接受一个数组参数合集
```
  var a = [1,2,3,[4,5]]
  [].concat.apply([], a) // [1, 2, 3, 4, 5]

  [].concat.call([], a) // [1,2,3,[4,5]]

  [].concat.call([], a[0], a[1], a[2], a[3]) // [1,2,3,4,5]
```


### forEach中无法使用await也无法break？
原因： 因为forEach中代码片段大概为: while( i < arr.length) { callback() }, forEach把处理的函数当作一个回调进行调用, 所以回调中的await和break不能影响到forEach
<br />
无法await解决方法： 换成for( itme of arr ) {}  
无法break的解决方法: trycatch + throw error 
```
// fix break demo:
try {
  arr.forEach((item, index) => {
      if (item !== 5) {
        // break conditions: when to excute break
        throw new Error('退出forEach循环')
      }
  })
} catch (error) {
  // handleError
  Toast(error.message)
}
```
---

## ES6
### Map, weakMap, Set, weakSet


### Generator, Generator返回值
