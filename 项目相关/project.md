### 跨域解决方法
1. 后端配置cors(access-control-allow-origin， access-control-allow-headers响应头)

2. jsonp, jsonp原理? jsonp返回什么?  
jsonp原理: web页面上src属性不受同源策略影响，所以能通过src引入一个script, script中注入服务端返回的数据, 那我们就可以拿到script中返回的数据了  
**jsonp返回的是一个函数的调用**，传入了获取到的数据  
> jsonp工作步骤： 客户端将请求的参数传入服务端 -> 服务端进行访问 -> 获取到数据 -> 通过script.src的形式注入到客户端

3. webpack配置ProxyTable --- **原理： 服务器访问服务器是没有跨域问题的**，**流程**: 先启动一个本地同源代理服务器 => 对代理服务器发起请求 => 由代理服务器请求外部服务器资源

4. 跨域html的话，可以用iframe.src

### 出现跨域的场景？
同源策略限制: 浏览器出于安全考虑，不允许跨域名调用其他页面的对象，只有当协议，域名，端口都相同的时候才会被认为是同一个域名，否则认为需要做跨域处理  
所以vue, react项目就算请求本地的PHP端口也可能会报错，因为端口号不同，所以还是会被同源策略限制， 本地开发的时候可以更改谷歌的安全性:  **在谷歌的快捷方式后目标加--args --disable-web-security --user-data-dir --allow-file-access-from-files**