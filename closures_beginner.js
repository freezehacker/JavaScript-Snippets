/**
 * 闭包(closure)入门
 * 2018-03-07
 */

/* 一、最流行的例子：for循环遇上闭包 */

// 错误的写法
var funcList = [];
for (var i = 0; i < 5; ++i) { // 因为JS并没有块级作用域，故这里声明的`i`其实是全局变量
  funcList[i] = function () {
    console.log(i); // 函数中的这个`i`使用了全局变量，即该函数是一个（引用了window上下文的）闭包
  };
}
funcList[0](); // 输出的是5而不是0：这里被调用时，全局变量i为5，所以输出5

// 一种解决方案：把函数改为引用新的上下文的闭包，不要引用window变量（防止被别人修改）
var funcList = [];
var i; // 一样的效果
for (i = 0; i < 5; ++i) {
  funcList[i] = (function (content) { // 这里多设置了一个闭包A，“隔断”全局环境与目标环境
    return function () {
      console.log(content); // 该闭包B使用的`content`不是最外层window的变量，而是闭包A的变量，所以不会被修改
    }
  })(i); // 这里将外部变量传进来
}
funcList[0](); // 这里输出的是期望值0


/* 二、计数器 */

// 最简单的实现：使用全局变量
var counter = 0; // 缺点：使用全局变量，污染，且可能会被别人误修改
function getNext() {
  return counter++;
}

// 解决方案1：使用对象/构造器

// 1.1 对象字面量（要重复写代码，比较啰嗦）
var counter1 = {
  _c: 0,
  getNext: function () {
    return _c++;
  }
};
var counter2 = {
  _c: 0,
  getNext: function () {
    return _c++;
  }
};
counter1.getNext(); // 0
counter2.getNext(); // 0

// 1.2 模拟构造器
function Counter() {
  return {
    _c: 0,
    getNext: function () {
      return _c++;
    }
  };
}
var counter1 = Counter();
var counter2 = Counter();
counter1.getNext(); // 0
counter2.getNext(); // 0

// 1.2 真·构造器
// (1)
function Counter() {
  if (this === window) { // 支持不带new的实例化
    return new Counter();
  }
  var _c = 0; // 相当于private变量
  this.getNext = function () {
    return _c++; // 使用外部`_c`，所以该方法是闭包（要注意返回的不是该方法，而是挂载了该方法的一个对象）
  }
}
// (2)
function Counter() {
  if (this === window) { // 支持不带new的实例化
    return new Counter();
  }
  this._c = 0; // 相当于public变量
  this.getNext = function () {
    return this._c++; // （使用外部`this._c`，是同一个scope，所以可能不算严格意义上的闭包）
  }
}

var counter1 = new Counter();
var counter2 = Counter();
counter1.getNext(); // 0
counter2.getNext(); // 0


// 解决方案2：一般闭包【方案2是'函数型闭包'；本质上，方案1也是闭包，但是是'对象型闭包'】
function newCounter(start) {
  var _c = 0;
  return function getNext() { // 返回的是函数。使用了外部的`_c`，所以是闭包
    return _c++;
  }
}
var counter1 = newCounter();
var counter2 = newCounter();
counter1(); // 0
counter1(); // 1
counter2(); // 0