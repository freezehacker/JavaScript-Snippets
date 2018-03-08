/**
 * throttle：节流
 * debounce：防抖动
 * 在onresize、onscroll这类频繁的回调中实现节流／防抖动
 * 
 * 更好的实现可以参考：Underscore/Lodash
 */

// 目标函数：假设是个非常耗时的加法器
function timeConsumingAdder(a, b) {
  var ret = 0;
  for (let i = 0; i < 10000000; ++i) { // 模拟耗时操作
    ret = ret * 10;
  }
  return ret + a + b;
}

// 没有完善的方式，可能造成浏览器卡顿
window.onresize = function () {
  console.log( timeConsumingAdder(1, 2) );
}


/**
 * 实现高阶函数(装饰器)：节流
 * @param {Function} fn 要节流的函数
 * @param {Number} leastInterval 函数前后两次被调用的最小间隔，单位为ms
 */
function throttle(fn, leastInterval) {
  var lastTime = new Date().getTime();
  return function () {
    var curTime = new Date().getTime();
    if (curTime - lastTime > leastInterval) {
      // 如果大于最小时间间隔，就调用目标函数
      // 需要注意：
      // 1.使用用户调用时的context、实参
      // 2.目标函数可能有返回值，最后需要原样返回
      var ret = fn.apply(this, arguments);
      lastTime = curTime;
      return ret;
    } else {
      // 暂时什么都不做
    }
  }
}

// 使用
var betterAdder = throttle(timeConsumingAdder, 500); // 前后相隔500ms
window.onresize = function () {
  var result = betterAdder(1, 2);
  result !== undefined && console.log(result);
}