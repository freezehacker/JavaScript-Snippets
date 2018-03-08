/**
 * 在某个作用域下，进行赋值(set)
 * 
 * 具体来说是探讨关于在某个scope进行：
 *  1、var a = ''; 
 *  2、a = '';
 *  3、this.a = '';
 * 这几种赋值操作的区别
 */

/* Demo 1：window scope */

// 定义：下面几种定义方式的效果一样，随便写一句，都可以有下面的输出
var _a = '123';
_a = '123';
this._a = '123';
// 使用
console.log(_a); // '123'
console.log(this._a); // '123'


/* Demo 2：function scope */

// 2.1 作为普通函数来调用：this === window
function whatever() {
  var a = 'local'; // 局部变量
  b = 'global'; // 给全局对象挂载`b`。所以在浏览器中执行时就是赋值给`window.b`
  this.c = '[this]'; // 本质上是赋值给`window.c`
}
whatever(); // 直接调用方法相当于`window.whatever()`，所以函数内部this===window
// 输出看看
console.log(a); // undefined
console.log(b); // 'global'
console.log(c); // '[this]'

// 2.2 作为构造器来调用：this === 新创建对象
function whatever() {
  var a = 'local'; // 局部变量
  b = 'global'; // 给全局对象挂载`b`。所以在浏览器中执行时就是赋值给`window.b`
  this.c = '[this]'; // 在新对象上挂载变量`c`
}
new whatever(); // 实例化时，函数(称为'构造器'更好)内部this指向新对象
// 输出看看
console.log(a); // undefined
console.log(b); // 'global'
console.log(c); // undefined


/* 总结 */

// 1.（不带var或者this的）直接赋值（属性、方法都适用）
variable = ''; // 无论出现在全局scope（根节点）还是某层函数scope（非根节点）中，都表示直接作用在全局对象上
method = function () {} // 这里只能使用函数表达式，不能用函数声明（局部方法）
// 相当于：
window.variable = '';
window.method = function () {}

// 另外，如果是普通函数声明，就不行了，因为：
function method() {}
// 相当于
var method = function () {}
// 即是局部变量


// 2.（不带this的）直接调用方法
method(); // 无论出现在全局scope（根节点）还是某层函数scope（非根节点）中，都表示直接作用在全局对象上
// 相当于
window.method();
// 本质上是
method.call(window);