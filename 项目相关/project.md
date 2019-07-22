### 跨域解决方法
1. 后端配置cors(access-control-allow-origin， access-control-allow-headers响应头)

2. jsonp, jsonp原理? jsonp返回什么?  
jsonp原理: web页面上src属性不受同源策略影响，所以能通过src引入一个script, script中注入服务端返回的数据, 那我们就可以拿到script中返回的数据了  
**jsonp返回的是一个函数的调用**，传入了获取到的数据  
> jsonp工作步骤： 客户端将请求的参数传入服务端 -> 服务端进行访问 -> 获取到数据 -> 通过script.src的形式注入到客户端

3. webpack配置ProxyTable --- **原理： 服务器访问服务器是没有跨域问题的**，**流程**: 先启动一个本地同源代理服务器 => 对代理服务器发起请求 => 由代理服务器请求外部服务器资源

4. 调用本地接口跨域 --- 修改本地谷歌安全策略

5. 后端cors头配置实例demo
- 如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名
- Access-Control-Allow-Origin表示可以请求数据的域名（必须）
- Access-Control-Allow-Credentials（是否允许传cookie，传cookie的话，Allow-Origin不能为*, 并且ajax要带withCredentials属性）
- 后端配置cors 
```
nginx配置中
add_header 'Access-Control-Allow-Origin' *;
add_header 'Access-Control-Allow-Methods' 'GET, POST, DELETE, PUT, OPTIONS';
```


6. jsonp实例demo
```
  // 最简单实例
  <script>
    // 获取到jsonp数据的回调
    function jsonpCallback () {

    }
  </script>
  <script src="/demo/testJsonp.shtml?callback=jsonpCallback"></script>
  
  // jsonp请求封装
  function requestJSONP(url) {
    // create script with passed in URL
    var script = document.createElement('script');
    script.src = url;
    
    // after the script is loaded (and executed), remove it
    script.onload = function () {
      this.remove();
    };
    
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(script);
  }

  function processWeather(data) {
    // 获取数据后的回调
  }
  var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid=%2210543%22&format=json&callback=processWeather';

  requestJSONP(url);

  // ajax-jsonp实例
  function callback_fn(data){
    console.log("callback_fn");
    console.log(data);
  }
  $.ajax({
    type:"get",
    dataType:"jsonp",
    url:"http://sax.sina.com.cn/newimpress?adunitid=PDPS000000047325&rotate_count=36",
    jsonpCallback:"callback_fn",
    success: function(data) {
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      // alert("" + textStatus + "," + errorThrown);
    }
  })
```

### 出现跨域的场景？
同源策略限制: 浏览器出于安全考虑，不允许跨域名调用其他页面的对象，只有当协议，域名，端口都相同的时候才会被认为是同一个域名，否则认为需要做跨域处理  
所以vue, react项目就算请求本地的PHP端口也可能会报错，因为端口号不同，所以还是会被同源策略限制， 本地开发的时候可以更改谷歌的安全性:  **在谷歌的快捷方式后目标加--args --disable-web-security --user-data-dir --allow-file-access-from-files**