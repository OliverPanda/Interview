### 冒泡排序 + 快速排序 + 插入排序
[冒泡排序流程](./bubble.gif)
```
/*
  冒泡排序思路: 和相邻的元素进行比较，前者 > 后者的话位置调换把大的放到后面 => 每每相邻的比对完了之后， 再继续从第一个开始继续循环1, 2
  核心: 比较arr[i]和 arr[i + 1]
*/
function bubbleSort (arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

/*
  快速排序思路：1. 取出最中间的项mid作为标准  2. item < mid的话，放到存储小于mid的数组left中, item >= mid的话, 放到mid的右边right数组中  3. 对left和right递归步骤1,2 -> 获得排序后的left和right  4.组合数组[...left, mid, ...right]
*/
function quickSort (arr) {
  var len = arr.length
  if (len <= 1) { // 递归出口
    return arr
  }
  var pivotIndex = Math.floor(arr.length / 2)
  var pivot = arr.splice(pivotIndex, 1)[0] // 解决最后剩余[1,1]使无法正确找到出口问题, splice返回数组, 能改变原来的数组var a = [1,1] =>a.splice(1,1)[0]  console.log(a) // [1]
  var left = []
  var right = []
  arr.forEach(row => {
    row < pivot ? left.push(row) : right.push(row) // [1,1]的情况下left.length为0, right.length为2
  })
  return quickSort(left).concat(pivot, quickSort(right))
}

/*
  插入排序思路： 
  1. 获取到a[i]并保存(a[i]的值会变, 所以保存), current = a[i]
  2. current与下标i之前的元素(a[prevIndex])一一对比，如果current < a[prevIndex]的话current前移
*/
function insertion(array) {
  if (!array || array.length <= 2) return
  var swap = function (array, left, right) {
    let temp = array[right]
    array[right] = array[left]
    array[left] = temp
  }
  for (let i = 1; i < array.length; i++) {
    for (let j = i - 1; j >= 0 && array[j] > array[j + 1]; j--)
      swap(array, j, j + 1);
  }
  return array;
}

```

### 折半查找(二分法查找)



### 找出最大值的下标



### 斐波那契
/*
  斐波那契: arr: [1,1,2,3,5,8,13...]
  第一第二项返回1, 第三项开始返回arr[n - 1] + arr[n - 2]
  n: 第几项, 从1开始
*/
function feb (n) {
  if (!n) {
    throw new Error('no params or n === 0')
  }
  if (n <= 2) {
    return 1
  } else {
    return feb(n - 2) + feb(n - 1)
  }
}

### 汉诺塔