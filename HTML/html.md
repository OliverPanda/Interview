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


### 浏览器渲染流程： 
1. 处理 HTML 标记并构建 DOM 树。
2. 处理 CSS 标记并构建 CSSOM 树。
3. 将 DOM 与 CSSOM 合并成一个渲染树。
4. 根据渲染树来布局，以计算每个节点的几何信息。
5. 将各个节点绘制到屏幕上  
[渲染流程](./浏览器渲染流程.png)


### xss、csrf、sql注入预防
1. xss: 跨站式脚本攻击，如何攻击：往form中提交js脚本，通常原因: 直接将客户端传过来的参数存入数据库， 常见场景： 表单提交， **解决： 参数转义后再入数据库**

2. csrf：跨站请求伪造，伪造恶意请求，**预防：关键数据用post， https + token**

3. sql注入：往表单传递sql语句获取数据库信息， **预防： 过滤特殊字符 + 对表单取值和类型校验**


### 事件代理
1. 场景： 子节点动态生成的话，子节点需要注册的事件应该注册在父节点上
2. 优点: 节省内存， 移除子节点的时候不用注销事件(如果是直接将事件添加在子节点，移除子节点的时候不注销事件容易引发内存泄漏)

### 一次性插入大量的元素，例如插入1000个div(渲染优化)
1. 使用document.createDocumentFragment()，只渲染一次
2. 创建独立渲染层， 单独渲染

```
// 独立渲染层常用CSS
transform: translateZ(0);
backface-visibility: hidden;
```



