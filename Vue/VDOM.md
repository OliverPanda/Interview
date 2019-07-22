### 为什么要VDOM
因为浏览器的DOM属性太多，直接操作DOM对象对于重绘和会留的负担都很大，并且DOM属性中不是所有都需要<br /><br />
Vnode是对真实DOM的抽象描述，核心定义主要有几个关键属性，标签名，数据，子节点，键值，VNODE只是用来映射到真实DOM的渲染，不需要包含操作DOM的方法  
**VNode映射到DOM中要经历create、diff、patch等过程**，VNode的创建是通过createElement创建的
### VNode的核心定义
标签名、数据、子节点、键值、子节点数组、text文本

> VUE中的VNODE借鉴与开源库snabbdom，然后加上了vue特色的属性


```
    // sanbbdom中的Vnode的定义
    export interface VNode {
      sel: string | undefined;
      data: VNodeData | undefined;
      children: Array<VNode | string> | undefined;
      elm: Node | undefined;
      text: string | undefined;
      key: Key | undefined;
    }
    
    export interface VNodeData {
      props?: Props;
      attrs?: Attrs;
      class?: Classes;
      style?: VNodeStyle;
      dataset?: Dataset;
      on?: On;
      hero?: Hero;
      attachData?: AttachData;
      hook?: Hooks;
      key?: Key;
      ns?: string; // for SVGs
      fn?: () => VNode; // for thunks
      args?: Array<any>; // for thunks
      [key: string]: any; // for any other 3rd party module
    }
    
    export function vnode(sel: string | undefined,
                          data: any | undefined,
                          children: Array<VNode | string> | undefined,
                          text: string | undefined,
                          elm: Element | Text | undefined): VNode {
      let key = data === undefined ? undefined : data.key;
      return {sel: sel, data: data, children: children,
              text: text, elm: elm, key: key};
    }
```

### VUE中的VNODE定义和属性
```
    export default class VNode {
      tag: string | void;
      data: VNodeData | void;
      children: ?Array<VNode>;
      text: string | void;
      elm: Node | void;
      ns: string | void;
      context: Component | void; // rendered in this component's scope
      key: string | number | void;
      componentOptions: VNodeComponentOptions | void;
      componentInstance: Component | void; // component instance
      parent: VNode | void; // component placeholder node
    
      // strictly internal
      raw: boolean; // contains raw HTML? (server only)
      isStatic: boolean; // hoisted static node
      isRootInsert: boolean; // necessary for enter transition check
      isComment: boolean; // empty comment placeholder?
      isCloned: boolean; // is a cloned node?
      isOnce: boolean; // is a v-once node?
      asyncFactory: Function | void; // async component factory function
      asyncMeta: Object | void;
      isAsyncPlaceholder: boolean;
      ssrContext: Object | void;
      fnContext: Component | void; // real context vm for functional nodes
      fnOptions: ?ComponentOptions; // for SSR caching
      fnScopeId: ?string; // functional scope id support
    
      constructor (
        tag?: string,
        data?: VNodeData,
        children?: ?Array<VNode>,
        text?: string,
        elm?: Node,
        context?: Component,
        componentOptions?: VNodeComponentOptions,
        asyncFactory?: Function
      ) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.ns = undefined
        this.context = context
        this.fnContext = undefined
        this.fnOptions = undefined
        this.fnScopeId = undefined
        this.key = data && data.key
        this.componentOptions = componentOptions
        this.componentInstance = undefined
        this.parent = undefined
        this.raw = false
        this.isStatic = false
        this.isRootInsert = true
        this.isComment = false
        this.isCloned = false
        this.isOnce = false
        this.asyncFactory = asyncFactory
        this.asyncMeta = undefined
        this.isAsyncPlaceholder = false
      }
    
      // DEPRECATED: alias for componentInstance for backwards compat.
      /* istanbul ignore next */
      get child (): Component | void {
        return this.componentInstance
      }
    }
```

### VNode---create阶段
VNode通过createElement创建，定义在src/core/vdom/create-element.js创建

createElement封装_createElement使得传入的参数更灵活  

_createElement根据normalizationType（子节点规范类型）去调用normalizeChildren或者 simpleNormalizeChildren  

_createElement参数：   
context: Component类型，VNode的上下文环境<br /> data：VNodeData类型，VNode的数据<br />
children: VNode子节点，任意类型<br />
normalizationType: 子节点规范的类型， 判断render是编译生成还是用户手写的

##### children规范化
simpleNormalizeChildren 方法调用场景是 render 函数是编译生成的。理论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就是 functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 Array.prototype.concat 方法把整个 children 数组打平，让它的深度只有一层。

normalLizeChildren: typeof child是['string', 'boolean', 'number', 'symbol']之一的话，创建虚拟TextNode，是数组创建虚拟数组节点， 使用场景： 用户手写的内容（如components: {}），slot， v-for中的节点
```
    // 1. When the children contains components - because a functional component
    // may return an Array instead of a single root. In this case, just a simple
    // normalization is needed - if any child is an Array, we flatten the whole
    // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
    // because functional components already normalize their own children.
    // 包含components, components中的返回是一个数组
    export function simpleNormalizeChildren (children: any) {
      for (let i = 0; i < children.length; i++) {
        if (Array.isArray(children[i])) {
          return Array.prototype.concat.apply([], children)
        }
      }
      return children
    }

    // 2. When the children contains constructs that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    
    export function normalizeChildren (children: any): ?Array<VNode> {
      return isPrimitive(children)
        ? [createTextVNode(children)]
        : Array.isArray(children)
          ? normalizeArrayChildren(children)
          : undefined
    }
```

### 当数据更新的时候，执行_update然后根据是否sameNodej决定是否进行diff阶段和patch阶段
源码： core/instance/lifecycleMixin中的Vue.prototype.__update方法

- 通过vm.$el, vm._vnode获取已经存在的vnode, 有已经存在的vnode直接调用patch更新真实dom，否则创建新的真实dom，主要操作就是为了执行`vm.__patch__`

##### Diff + Patch阶段(虚拟DOM更新真实DOM)
源码：src/core/vdom/patch.js下的patch函数

- 只有`oldVnode`不为真实DOM（判断是否有nodeType） && `sameVNode(oldVNode, newVNode)`才会进行diff和patch的过程(patchVNode方法)，否则的话调用`emptyNodeAt`， `emptyNodeAt`把`oldVNode`转换成`VNode`对象(`return new VNode(options)`) => `createElm`通过虚拟DOM创建真实DOM插入到父节点, 有children的话对children递归`createElm`再插入 => 达到mount to a realDOM的效果<br />

##### sameVNode(a,b)
tag、key、isComment、a和b要么都定义data要么都没定义data、Input标签的话type也要相同

##### createElm(虚拟DOM映射到真实DOM的核心)


##### VDOM简单实例demo
```
class VNode {
    // createVNode
    constructor(tagName, attrs, children) {
        this.tagName = tagName
        this.attributes = attrs
        this.children = children
    }
    
    render() {
        // 对应createElm, createElm 的作用是通过虚拟节点创建真实的 DOM 并插入到它的父节点中
        let element = document.createElement(this.tagName)
        Object.keys(this.attributes).forEach(key => {
            element.setAttribute(key, this.attributes[key])
        })
        
        // 有children的话， createChildren()
        this.children.forEach(child => {
            element.appendChild(child.render())
        })
        
        return element
    }
}
```

##### diff算法
简介： 通过同层树节点比较而非对树逐层遍历搜索
源码： 在src/core/vdom/patch.js中的updateChildren函数



