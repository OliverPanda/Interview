## 通过公开install方法编写Vue插件
1. vue-router是Vue的一个插件
2. Vue.js 的插件应该有一个公开方法 install
```
 // src/index.js
 import { install } from './install'
 // ...
 VueRouter.install = install
 // ...
```

所以理所当然的， 我们先去看看插件中具体做了什么,有个整体的概念
```
import View from './components/view'
import Link from './components/link'

export let _Vue

// Vue.use(middleware)的时候会自动注入Vue
export function install (Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined
  // 判断父组件是否已经初始化router，没有的话就是根组件 -> 进行router等的注入,
  // 有？ -> 不是根组件 -> 沿用parent组件中的router, 
  // 如果为keep-alive的vue实例的话，根本不会触发这些钩子，所以pass
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    // demo: var q = 1 if (isDef(q) && isDef(q = 2)) { console.log(q ) // 2 }
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      // if里的一堆赋值操作， i的值从 vm.$options._parentNode -> vm.$options._parentNode.data -> vm.$options._parentNode.data.registerRouteInstance, 最终这里的i为vm.$options._parentNode.data.registerRouteInstance
      i(vm, callVal)
    }
  }
  
  // 在beforeCreate中进行注入, 根实例before会先将所有的路由列表中的路由生成为VueComponent
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current) // 把_route定义为一个可响应对象
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this) // 初始化下个vue实例的路由, this指向下个vue实例
    }
  })
  
  // 后面就是扩展路由的一些常用方法，组件，路由守卫
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```
![beforeCreate-destoryed, this指向的组件不是同一个](http://note.youdao.com/yws/res/7187/WEBRESOURCE18c6110e911df04d87d2a2fdb67cd537)

由上图跑的vue-router-example可以知道：  
1. 无论是否为懒加载，在根Vue实例的beforeMount之前会先将所有的router生成为VueComponent<br /><br />
2. 进入当前Vue实例的beforeMOunt会再实例化一个新的VueComponent, destoryed的时候，registerInstance(this)这个this其实指向的是下一个组件<br /><br />
3. 每次匹配到一次路由，都会新生成一个新的Vue实例，Vue实例在使用完一次跳转到另外的路由后，就会被销毁，而不是储存起来

[不是keep-alive的Vue实例不存储，直接用完销毁，下次再重新生成实例，点击查看运行截图](http://note.youdao.com/yws/res/7299/WEBRESOURCE360f10c1f83abc3313cae2786c32dd48)
<br /><br /><br />
---
## 回到VueRouter对象和其初始化
1. 构造函数
2. init()

#### 构造函数
构造函数中主要就是变量的初始化 + 判断当前传入的mode，根据传入的mode去选用不同的webAPi对路由进行处理<br />
hash: hashHistory()  
history: HTML5History()
```
    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      // this.fallback 表示在浏览器不支持 history.pushState 的情况下，根据传入的 fallback 配置参数，决定是否回退到hash模式
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
```

#### init
a. 将传入的所有Vue实例(包括根实例)存储到this.apps数组中<br />实测结果为： 无论hash还是history模式，init()只会执行一次，传入的参数一直都是vue的根实例, this.apps一直都是[vue根实例]<br /> 根实例存储到this.app中<br />
b. 根据不同的模式，进行不同的初始化操作
```
    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }
    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
```

## 路由切换history.transitionTo
1. 根据目标location + 当前路径去执行this.matcher.match匹配出目标路径
2. 执行confirmTransition()进行真正意义上的切换，并更新当前路径this.current为跳转之后的路径，confirmTransition()会进行当前路径和目标路径的判断, 如果isSameRoute或者出错的话，是不执行路由跳转的
```
const abort = err => {
  if (isError(err)) {
    if (this.errorCbs.length) {
      this.errorCbs.forEach(cb => { cb(err) })
    } else {
      warn(false, 'uncaught error during route navigation:')
      console.error(err)
    }
  }
  onAbort && onAbort(err)
}
if (
  isSameRoute(route, current) &&
  // in the case the route map has been dynamically appended to
  route.matched.length === current.matched.length
) {
  this.ensureURL()
  return abort()
}
```


## routes和router的区别
刚刚开始使用vue-router的时候往往会被$route和$router这两个东西绕晕<br />
区别：<br />
routes: Array<RouteConfig><br />
router: VueRouter<br />
$routes是路由表数组， $router是一个VueRouter对象
