### 移动端的点击事件为什么会存在 300ms 的延迟现象?
这是因为在移动端的前提下，直接点击屏幕，手机浏览器需要知道你是否是想执行双击放大网页内容的操作
解决：使用 touch 相关事件去解决这个延迟问题，如 touchStart 即可，有些移动端 UI 库将这个操作称为 fastclick

### 设置rem布局
1. 设置文档节点根元素的字体大小为标准单位
  ```
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px'
  ```
2. 所有盒子模型的单位都替换为 rem，一般来说移动端宽 375 的情况下，1 rem == 50px 为最佳
3. 监听屏幕 resize 事件，动态赋值第一步字体单位


### 移动端适配1px
会出现1px的原因：在移动端我们可通过BOM `window.devicePixelRatio`获取设备的像素比，而 iphone6/7/8 的像素比为 2，即在此设备内 1px 反应出来实际是肉眼的 2 物理像素，即 1px => 2px，所以才出现了移动端需要适配 1px 的问题，由此产生的字体或元素宽高变化我们使用 rem 布局即可解决

解决：
1. 设置viewport + rem 
2. 使用伪类 + transform scale，这种方法很简单，就是在所需元素上加 before 或 after 伪类，通过设置伪类元素的宽高或边界，然后使用`transform: scale(0.5)`缩小一倍即可


### DOM事件中 target 和 currentTarget 的区别
event.target 是指触发事件的元素目标，event.currentTarget 是指当前正在处理事件的元素（你绑定的元素），简单来说就是当嵌套 div 时，点击事件同时注册多个 div，外部 div 会接收到内部 div 通过事件冒泡上来的事件，此时内部触发这次事件的 div 就是 target，而你使用外部 div 接收事件做处理时这个外部 div 就是 currentTarget，**记住触发元素是 target，监听元素是 currentTarget 即可**;