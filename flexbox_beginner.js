/**
 * Flexbox学习笔记(by JK on 2018-01-18)
 * 知识点来源：https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
 */


/**
 * 1.出现的原因
 * (1)以往兼容性布局只有float/position
 * (2)解决垂直居中的布局需求
 * (3)使子组件均分宽/高
 * (4)使子组件的高/宽相等，即使子组件含有的内容不等
 */


/**
 * 2.基础概念：
 * (1)容器组件：flex container
 *    子组件：flex item
 * (2)main axis：主轴，即item排列的方向
 *    main size：item在main axis方向的长度
 *    main start/end：main axis的起始与结束位置
 * (3)cross axis：与主轴垂直
 *    cross size：item在cross axis方向的长度
 *    cross start/end：cross axis的起始与结束位置
 */


/**
 * 3.常用属性：
 * 
 * 一、container：
 * 基本排列属性：
 * (1)display: flex
 * (2)flex-direction: 表示每一个item排列的顺序 
 *      | row 
 *      | column 
 *      | row-reverse(水平逆向即item从右往左排列) 
 *      | column-reverse(竖直逆向即item从下往上排列)
 * (3)flex-wrap: (TODO: 对column/column-reverse适用吗？)
 *      | nowrap 
 *      | wrap(flex-direction为row/row-reverse时，从上往下)
 *      | wrap-reverse(flex-direction为row/row-reverse时，从下往上)
 * 另：flex-flow：flex-direction + flex-wrap，比如flex-flow: row wrap
 * 
 * 居中属性：
 * (4)align-items：表示items(整体)在垂直方向的位置。可以用来实现垂直居中。
 *      | stretch(撑满)
 *      | flex-start | flex-end (垂直方向的start/end位置)
 *      | center(垂直方向居中！BTW，这里是"垂直"不是"竖直")
 * (5)justify-content：表示items(整体)在主方向的对齐方式。可以用来实现主方向居中。
 *      | flex-start | flex-end
 *      | center(主方向居中！)
 *      | space-around(每个item左右有均等间隔)
 *      | space-between(除了头尾，每个item左右有均等间隔)
 * 
 * 
 * 二、item：
 * 基本排列属性：
 * flex: flex-grow(剩余空间的占据分数) + flex-shrink + flex-basis(初始分配的长度)
 *    不过flex-shrink一般不会用到，比如flex: 1 200px
 * align-self：与align-items一样，可以覆盖父控件的align-items属性
 * 
 * 顺序属性：
 * order: 可以改变顺序
 * (1)默认order为0
 * (2)只能是整数：比如-1.5就是-1
 * (3)越大越靠后
 * (4)相等的话就看原来的排列顺序
 * 
 */