## HTTP缓存分为协商缓存和强缓存
### 缓存优先级
1. 优先级： 强缓存 > 协商缓存
2. 强缓存中优先级: cache-control > expired 

### 强缓存
如果资源缓存max-age时间没到的话， 直接获取本地硬盘或者内存中的内容。直接返回200， 不再重新请求资源，适用于静态资源img, css, js等，通常用nginx统一处理
  - expired, 设置max-age, 获取的是本地时间, 能够人工轻易改变
  - cache-control, 采用倒计时计算过期时间
### 响应头设置expires和cache-control的区别
1. expires在浏览器时间和服务器时间不同的情况下会出现偏差，导致结果不一致
2. cache-control能解决浏览器和服务器时间不一致带来的问题。采用类似倒计时的方式进行计算过期时间，此外cache-control还能有更多选项用于精细地控制缓存， 如public, private, no-cache, no-store
3. 同时存在cache-control和expires的话，cache-control的max-age会覆盖expires


### 协商缓存
1. 判断Last-Modified: [GMT Date] 与 If-Modified-Since: [last res GMT Date]是否相等， 如果相等的话表示资源没变化， 返回响应码304 Not Modified， 不相等则重新请求
2. Etags判断法：etag是服务端返回的一个hash字符串, 第一次请求会设置hash字符串，第二次请求判断If-None-Match与etag是否相等, 相等 => 304


为了提高性能，设立的缓存的规则： 
1. 添加expires 或者 cache-control到报文头中
2. 配置ETags，**ETags**: 服务器和浏览器的功能，**用于判断浏览器缓存和原来服务器上的是否一致**
3. Ajax缓存： 大多数缓存只应用在GET请求中<br /> **本地没有缓存文件的时候 -> 请求服务端的内容并缓存起来 => 再次get这个资源 => 本地有缓存文件 => 检查本地缓存文件是否可以直接使用（判断If-Modified-Since字段，在服务端是否有更新的时间， 没有的话返回304，客户端使用本地文件）**
