/**
 * ES5实现继承(这里的继承是实现继承，不是接口继承)的方式
 * 参考《JavaScript高级程序设计》Chapter:6.3
 * 
 * 例子说明：Person为父类，每种方法会建立Student类
 * 为了方便，约定一些个性化术语：
 * (1)"实例属性"指只在构造函数中定义的/实例中存在的属性，"原型属性"指只在原型中存在的属性。
 *    这里的"属性"是广义的，同时指代属性、方法。
 * 
 */
function Person(id) {
  this.id = id;
  this.moods = ['happy', 'angry', 'sad']; // 注：此成员为引用类型
}
Person.prototype.getId = function () {
  return this.id;
}
Person.prototype.getMoods = function () {
  return this.moods;
}

/**
 * 1.原型链：通过改变默认原型(指向Object匿名实例)来实现
 * 缺点：
 * (1)父类的实例属性和原型属性，统一放在了子类的原型中，那么引用类型的属性就会有共同指向的问题(moods)
 * (2)如果父类的构造函数是带参数的(id)，子类的构造函数也要带上它(id, ...)，但是如此一来子类的属性就会覆盖父类的同名属性，该属性就达不到继承的目的
 * (3)子类原型constructor需要显式指定
 *    因为子类原型是父类的实例，所以如果不指定，则会沿着原型链寻找constructor属性，最终在父类找到，这时候指向的是父类，即：
 *    Student.prototype -> Person.prototype (constructor属性为Person)
 */
function Student(id, seatNo) { // 定义子类构造器，这里可以(根据需要)传入父类构造函数的参数(id)
  this.seatNo = seatNo;
  this.id = id;
}
// 关键！将Student的原型(由指向Object类的匿名实例)改为指向Person的匿名实例
// 本质：Person的实例属性、原型属性全部都赋予了Student的原型中
Student.prototype = new Person();
Student.prototype.getSeatNo = function () { // 子类在原型中定义新方法(需要在确定了原型之后；并且不能用对象字面量的方式定义，否则会覆盖)
  return this.seatNo;
}
/**
 * 使用原型链后，类的关系：
 * 
 * 对象：【注意，根据原型链，这里的对象满足：left.__proto__ === right】
 *          new Student()           Student.prototype          Person.prototype        Object.prototype
 * 属性与方法：         
 *          id                      id                         getId
 *          seatNo                  moods                      getMoods
 *                                  getSeatNo
 * 本质：
 *          Student实例              Student原型；Person实例     Person原型；Object实例
 * 问题：
 * 由图可知，属性moods存在于Student.prototype中且没有被重写，会有"共同修改"(即一个实例改变了属性会影响另一个实例)的问题.
 * PS.
 * 基本类型的属性：不存在这个问题，因为虽然getter取的是prototype中的，但setter(对属性赋新值)会在实例上建立新的同名属性，之后就覆盖了prototype的该属性了。
 * 引用类型的属性：
 *  (1)setter也会在实例上作用，指向新的内存，覆盖了prototype的同名属性。如：s = ["unhappy"];
 *  (2)但是dereference的一些操作会引发该问题。如：s.moods.push("unhappy");
 * 所以一般来说，为了避免该问题，引用类型的属性一般都需要后移到实例中，而不能放在原型中。
 */




/**
 * 2.Constructor stealing(借用构造函数)：在子类构造函数内部，通过call/apply方法，对新的作用域调用父类构造函数
 * 本质：执行了父类的构造器故获取了父类的实例属性。然而，父类的原型属性没有得到继承。
 * 缺点：没有继承父类的原型属性(类定义中，方法一般定义在原型上，所以此方法无法达到函数复用)
 * 解决方式：既然继承的关键在于父类的构造函数的借用，而且缺少方法定义，那么可以将方法定义在构造函数中
 *         具体来说，父类定义时使用动态原型的方式(方法仅定义一次)，并且取原型是通过Object.getPrototype(this)的方式
 */
function Student(id, seatNo) {
  // this是刚创建的作用域，对其调用父类构造器
  // 该例子中，下面这一句相当于：
  // this.id = id;
  // this.moods = ['happy','angry','sad'];
  // 即赋予了id、moods两个属性
  Person.call(this, id);
  this.seatNo = seatNo;
}
/**
 * 使用借用构造函数后，类的关系：
 * 
 * 对象：
 *          new Student()           Student.prototype           Object.prototype
 * 属性与方法：         
 *          id(偷)                                            
 *          moods(偷)                                      
 *          seatNo                 
 * 本质：
 *          Student实例              Student原型；Object实例    
 * 问题：
 * 由图可知，Student实例中并没有继承到getId、getMoods等方法
 */

/**
 * 解决方式
 */
// 父类定义
function Person(id) {
  this.id = id;
  this.moods = ["happy", "angry"];

  // 动态原型
  // 使用Object.getPrototypeOf(this)，而不能写死成'Person.prototype'
  let proto = Object.getPrototypeOf(this);
  if (proto) {
    if (typeof proto.getId !== 'function') {
      proto.getId = function () {
        // PS.
        // 因为是在实例上调用getId，故此处的this指向实例对象
        // 首先从实例对象开始，沿着原型链寻找getId这个方法
        // 执行到this.id，又从实例对象开始，沿着原型链寻找id这个属性，并返回
        return this.id;
      }
    }
    if (typeof proto.getMoods !== 'function') {
      proto.getMoods = function () {
        return this.moods;
      }
    }
  }
}
// 子类定义，照旧
function Student(id, seatNo) {
  Person.call(this, id);
  this.seatNo = seatNo;
}
/**
 * 使用借用构造函数的改进方案后，类的关系：
 * 
 * 对象：
 *          new Student()           Student.prototype           Object.prototype
 * 属性与方法：         
 *          id(偷)                  getId                         
 *          moods(偷)               getMoods                       
 *          seatNo                 
 * 本质：
 *          Student实例              Student原型；Object实例
 */





/**
 * 3.组合：原型链 + Constructor stealing
 * 本质：优势互补，利用借用构造函数去继承实例属性，利用原型链去继承原型属性
 * 
 * Object.create：
 * 作用：根据指定的原型对象，创建新对象
 * 意义：借助原型链，基于已有的对象去创建新对象，而不必创建新类型
 * 更详细可以参考MDN：
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */
function Student(id, seatNo) {
  Person.call(this, id); // (2)
  this.seatNo = seatNo;
}
// Student.prototype = new Person(); // (1)直接使用原型链方法，会使子类同时拥有父类的实例、原型属性
Student.prototype = Object.create(Person.prototype); // (1)这样更好，只获取父类的原型属性(因为实例属性在之前获取过了)
Student.prototype.constructor = Student; // 记得重写子类constructor属性
Student.prototype.getSeatNo = function () {
  return this.seatNo;
}
/**
 * 使用原型链后，类的关系：
 * 
 * 对象：【注意，根据原型链，这里的对象满足：left.__proto__ === right】
 *          new Student()           Student.prototype          Person.prototype        Object.prototype
 * 属性与方法：         
 *          id                      id(1)                      getId
 *          moods                   moods(1)                   getMoods
 *          seatNo                  getSeatNo
 *                                  constructor => Student
 * 本质：
 *          Student实例              Student原型；Person实例     Person原型；Object实例           
 * 注释：
 * (1)不必存在的属性。如果使用Object.create方式就不会产生(推荐)，如果直接使用实例的方式就会产生。
 * 特点：
 * (1)普通属性统一后移到实例中，不会有"共同修改"的问题
 * (2)方法存在于多个不同层级的prototype中，正确而直观
 */
