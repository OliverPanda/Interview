### 为什么 overflow: hidden 可以用来清除浮动影响? 
原因是计算 BFC 的高度时，根据规则浮动元素也要参与计算，所以即使子元素是浮动的脱离了文档流，父元素隐藏溢出空间时仍然将其宽高计算在其内了；

BFC（Block Formatting Content）称为 块级格式化上下文，它就是块级元素之间的布局规则，常见的还有 IFC（Inline Formatting Content）行级格式化上下文，它们共同定义了块级与行级元素之间的折叠与布局规则；