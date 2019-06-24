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
    - Vue的mount过程是通过mountComponent函数， mountComponent的过程中会实例化一个Watcher，然后对Dep.target赋值为当前watcher，并且执行addDep进行依赖收集
    - 响应式对象的值改变的时候，触发set属性，调用Dep类中的notify方法，通知所有的watcher进行更新


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