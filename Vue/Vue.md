## 双向绑定
最基础的做法： 两个变量a,b, 当a或者b其中的一方的值发生了改变了之后，在回调中对另外一个变量赋值

Vue中进行了自动双向绑定的过程，主要使用了观察者模式<br />
建立观察者对a,b等响应式对象进行了监听，当监听到某一个响应式对象的值发生了改变，就触发改响应式对象的set属性描述符，对其他的响应式对象的值进行更新

## 响应式对象
- 总体使用观察者模式
    - Dep类： 提供了发布订阅的方法，存储Watcher中最终收集到的依赖，以便用于改变的时候发布(notify)
    - Watcher类：在初始化组件的时候，都会先初始化一个Watcher实例，Watcher类中定义了get描述符用于在初始化组件实例的时候让dep收集当前的watcher，另外还定义了一些关于依赖维护的方法
    - Observer类：创建响应式对象，给对象的属性添加getter和setter，数据get的时候增加一次watcher， set的时候执行一次更新
    
- 定义响应式对象：Observer中给对象定义的getter/setter
    - 使用defineProperty方法去给所有的observer实例定义getter/setter
    - 利用defineProperty方法定义响应式对象的get和set描述符, get能触发依赖收集(dep.depend()), set用于触发派发更新(dep.notify())

- 依赖收集和派发更新的过程
    - Vue的mount过程是通过mountComponent函数， mountComponent的过程中会实例化一个Watcher，然后对Dep.target赋值为当前watcher，并且执行addDep进行依赖收集(收集到的所有依赖都是watcher类型)
    - 响应式对象的值改变的时候，触发set属性，调用Dep类中的notify方法，通知所有的watcher进行更新

---

## vuex, property was assigned but it has no setter
出现场景： 
使用mapState(['test'])API把this.$store.state映射到this下之后, 对this.test进行复制操作(触发setter), 但是没有set

解决： 
computed: {
  // 设置当前站点, getter和setter不要使用箭头函数， 可能会导致this错误
  test: {
    <!-- getter -->
    get: function () {
      console.log(this)
      console.log(this.$store)
      return this.$store.state.station.type
    },
    <!-- setter -->
    set: (val) => this.saveStation(val)
  }
}

---

### Vue中有Parent > Child，如何在不改变Child的情况下， 通过Parent监听到Child的属性变化并响应

--- 


## transition组件
源码地址: src/platforms/web/runtime/component/transtion.js + src/platforms/web/runtime/transtion-util.js

过渡动画提供了 2 个时机，一个是 create 和 activate 的时候提供了 entering 进入动画，一个是 remove 的时候提供了 leaving 离开动画，那么接下来我们就来分别去分析这两个过程

##### Vue 的过渡实现分为以下几个步骤：

自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。

如果过渡组件提供了 JavaScript 钩子函数，这些钩子函数将在恰当的时机被调用。

如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。

总结： 所以真正执行动画的是我们写的 CSS 或者是 JavaScript 钩子函数，而 Vue 的 <transition> 只是帮我们很好地管理了这些 CSS 的添加/删除，以及钩子函数的执行时机。

使用JS钩子方式的话， 会直接运行用户在JS钩子中的回调， CSS的话会自动添加删除类名并且存在有效类名的话其实是直接用setTimeout的

##### Vue过渡事件钩子, 会被存进vnode.data中
- before-enter(before-leave, before-appear)
- enter(leave, appear)
- after-enter(after-leave, after-appear)
- enter-cancelled(leave-cancelled, appear-cancelled)

##### 怎么保证transition动画已经结束？
- **有准确的duration参数使用setTimeout， 否则无论使用transitionend或者animationend监听（无论用CSS还是JS钩子）**
- 没有cancelled && transition上存在有效duration属性 ===> setTimeout(cb, duration)
- 否则运行whenTransitionEnds, whenTransitionEnds中为元素添加了transitionend || animationend方法，监听到方法触发则调用end进行移除监听 && 调用回调
```
if (!cb.cancelled) {
  addTransitionClass(el, toClass)
  if (!userWantsControl) {
    if (isValidDuration(explicitEnterDuration)) {
      setTimeout(cb, explicitEnterDuration)
    } else {
      whenTransitionEnds(el, type, cb) // 为元素添加transitionend
    }
  }
}
```

##### 怎么设置duration才能够被拿到然后走setTimeout呢？
var { duration } = vnode.data.transition.duration
isObject(duration) ? duration.enter : duration
```
<transition :duration="1000">...</transition>
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

##### 页面切换transition的时候，会先闪烁一下上一个页面再显示下一个页面
原因： transition默认进入下一个动画和离开上一个动画是同时发生的，所以两个页面都会被重绘
解决： 添加transition过渡模式


##### 拓展： 怎么解决定时器的延时问题 ？
1. JS中的定时器是有误差的（JS中会在事件循环中设置一个类似while(1)的函数，去计算经过了多久时间）
2. setInterval(cb, delay)的话，延迟会越来越高，可以通过setTimeout回调函数中嵌套setTimeout来实现setInterval的功能
3. transition延时错误具体解决方案： 不停setTimeout能使得延时不会叠加
```
var callback = function() {
  count++;
  var offset = new Date().getTime() - (startTime + count * 1000);
  var nextTime = 1000 - offset;
  if (nextTime < 0) {
    nextTime = 0;
  }
  for (var i=0; i<=1000000000; i++) {

  }
  console.log(offset);
  setTimeout(callback, nextTime);
}
interval = window.setTimeout(callback, 1000);
```

---

### NextTick原理和实现
##### nextTick的执行实际
- 事件循环中， 每个tick的流程: 主进程script，所有同步任务 => 执行微任务队列 => 执行宏任务队列  
- 每次经过一次事件循环，进入到下一次事件循环的时候触发nextTick的回调
- 真正意义上， nextTick是在所有依赖都更新之后进行调用

##### 为什么需要nextTick这个API ？
1. **数据改变之后会先缓存而不是马上更新视图**，改变数据的时候， watcher不会立刻发出， 而是放到队列， 防止重复触发一个watcher, 造成不必要的dom更新
2. 当前tick的变更会在nextTick中响应和更新DOM
3. 源码参考src/observer/scheduler.js

##### nextTick具体实现流程(Observer模块流程)
-> 响应式对象改变 <br />
-> 触发响应式对象的set描述符<br />
-> dep.notify对收集到的subs: Array<Watcher>调用Watcher.update() <br />
-> 异步 ？ queueWatcher(this) : run(Scheduler Job)， 默认异步，设置同步: .sync修饰符<br />
-> src/observer/scheduler， queueWatcher中依赖改变不是马上改变，等待去除重复的watcher id之后再进入到nextTick中进行更新

##### 为什么nextTick能确保依赖都已经更新了？
nextTick函数是在flushSchedulerQueue之后才进行调用的<br /><br />
在flushSchedulerQueue中run所有的watchers， 其中使用sort((a, b) => a.id - b.id)确保同一个Watcher不会更新两次，并且通过控制user watchers和render watcher的执行顺序确保同一个watcher更新多次的时候，run的是render watcher里的(因为user watchers创建早于render watchers)  <br /><br />
run做了什么？ 把当前的值缓存到oldValue变量中， 把新值赋值给this.value



### 让插槽内容能访问子组件才有的数据
[Vue官方教程, 把对象当成slot的属性传入 + 父级给slot命名获取具体某个slot下的数据](https://cn.vuejs.org/v2/guide/components-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD)




### keep-alive组件(src/core/components/keep-alive.js)细节
1. 是个抽象组件， 在组件实例建立父子关系的时候会被忽略， abstract组件还有transition
2. keepAlive只处理第一个组件，所以一般配合组件或者router-view使用<br />
3. keepAlive, include(匹配的组件)和exclude(不匹配的组件)可以使用正则，数组，字符串形式, 在matches()函数中做了处理<br /><br />
4. **首次执行keep-alive, 直接进入patch阶段, patch.js(core/vdom/patch.js)中的createComponent函数**, 先执行Render函数 ---> 缓存vnode，设置vnode.data.keepAlive为true, isReactived为false ---> **完成patch**和正常组件一样执行initComponent ---> 数据变化则对比新旧vnode之间的componentsName，一样的话说明没变，不一样的话, destory重新建立keepAlive的vnode<br /><br />
5. **缓存执行keep-alive先进入prePatch阶段**，更新实例属性, 判断第一个组件是否命中keepAlive缓存 -> **patch**, 命中缓存，设置isReactived = true ---> isReactived为true的话是不执行mount过程的(源码: src/core/vdom/create-component.js) ---> 通过insert(parentElm, vnode.elm, refElm) 就把缓存的 DOM 对象直接插入到目标元素

---

### v-show
1. 管理和控制style.display
2. v-show的值更新的时候， 会先判断是否有过度动画

### 自定义指令实现Vue.directive
指令钩子函数参数： 
- el绑定的元素
- binding对象， 指令接受到的参数和自身属性
  - name，指令名，不包含v-
  - value，指令绑定值
  - oldValue: 指令绑定前一个值，update和componentUpdated中才可用
  - arg，参数，例如 v-my-directive:foo 中，参数为 "foo"
  - modifiers，例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
- vnode
- oldVnode

自定义指令生命周期:<br />
bind: 指令第一次绑定到元素调用，只调用一次<br />
inserted: 被绑定元素插入父节点调用（只能保证父节点存在但不一定插入到文档）<br />
update: 所在组件VNode更新时调用， 不保证子组件VNode也更新完<br />
componentUpdated: 所在组件VNode更新完并且子组件VNode也更新完调用<br />
unbind：只调用一次，指令与元素解绑时调用
```
  // 全局注册指令
  Vue.directive('my-directive', {
    bind: function () {},
    inserted: function (el) { // el为被绑定指令的元素 },
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })
  
  // 组件内局部注册指令
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  }

  // getter，返回已注册的指令
  var myDirective = Vue.directive('my-directive')

```


### Vue插件实现
插件： 通常用于向Vue.prototype中添加全局方法，属性，函数， 指令，mixin，或者提供自己的方法(vue-router)等

使用： Vue.use(plugins) === 执行plugin的install函数 + 向插件注入Vue
开发： MyPlugins.install = function (Vue, options) {}
```
let myPlugins = {}
myPlugins.install = function (Vue, options) {
  Vue.myGlobalMethod = function () {
    // 注入全局方法
  }

  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // ...
    }
  })

  Vue.mixin({
    created: function () {
      // ...
    }
  })

  Vue.prototype.$myMethod = function (options) {
    // 原型上添加方法，使得实例上可用
  }
}

export default myPlugins
```


