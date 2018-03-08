import React from 'react';

/**
 * 1.认识React.Component重点：
 * (1)生命周期钩子(Lifecycle Hooks)
 * (2)setState在每个Hooks中是否会引发重渲染
 * 
 * 参考：
 * https://reactjs.org/docs/react-component.html
 */
class MyComponent extends React.Component {

	render() {	// (重)渲染函数
		// 返回JSX视图/模板
		// 逻辑尽量保持简单，最好纯展示，不要改变状态，因为会被多次回调
	}

	//--------------------------------Mount阶段-------------------------------------------------------//
	constructor(props) {
		super(props);	// 注意第一句要这样写，否则this.props无定义
		// 1.定义state对象的内容
		// 2.绑定事件的回调
	}
	componentWillMount() { // 插入DOM前触发
		// setState不会重渲染
		// 只能完成一些简单初始化工作，不过推荐写在constructor中。所以一般没啥用
		// 在SSR中是唯一触发的回调
	}
	componentDidMount() {	// 插入DOM树后触发
		// 1.操作DOM(因为此时DOM树结构完备)
		// 2.开始：Ajax、定时器、订阅事件
		// setState会重渲染，不过会在视觉刷新前
	}

	//---------------------------------Update阶段------------------------------------------------------//
	componentWillReceiveProps(nextProps) {	// props'再次'传入时触发(说'再次'是因为：Mount阶段虽然也传props但不会回调)
		// 传入的props可能没有改变，所以重写的话，需要比较this.props与nextProps才能确定下一步操作【官网称之为：(A=>B)!=>(B=>A) 】
		// 可以做让props同步到state的工作。但更推荐的做法是State Hoisting，即把state放在父组件中，这样就不用再维护一份state了(待实践体验)
	}
	shouldComponentUpdate(nextProps, nextState) { // 确认是否需要重渲染
		// Component：return true（目的是保证视图更新，但有时候没有必要浪费资源去更新。所以可以重写）
		// PureComponent：return this.props !== nextProps || this.state !== nextState（目的是减少重渲染以提升性能；而且shallow比较效率也很高）
		// 
		// return false会同时使得当前组件、子组件停止重渲染。参考：http://lucybain.com/blog/2017/react-js-when-to-rerender/
		// 
		// 重写时，为了保证性能，不能进行耗时操作
		// React在未来可能会把此方法作为不严格的判断，即return false也可能重渲染
	}
	componentWillUpdate(nextProps, nextState) {
		// 千万不能进行setState等引发重渲染的操作
		// 可以操作DOM
	}
	componentDidUpdate(prevProps, prevState) {
		// 这里可以取得prevProps/prevState，可以与现有的进行比较，然后做一些网络请求等操作
	}

	//----------------------------------Unmount阶段-----------------------------------------------------//
	componentWillUnmount() {	// 从DOM树中移除前触发
		// 取消：Ajax、定时器、订阅事件
	}

	//----------------------------------异常阶段-----------------------------------------------------//
	componentDidCatch(error, info) {	// 捕获到错误时触发
		// 捕捉的是子树(不包括自己)的错误
		// 一般用来从意外错误中恢复
	}
}


/**
 * 2.setState：通知React需要重渲染当前组件、以及子组件。如果shouldComponentUpdate返回true，就总是可以成功重渲染
 * 特点：
 * (1)批量(提升性能)
 * (2)异步(不会马上重渲染)：可以看作发起一个"重渲染"的网络请求
 */
// 一般用法
setState(newState, callback); // callback表示重渲染之后的回调；等价做法是写在componentDidMount中
// 需要依赖旧状态时
setState(
	(prevState, props) => {
		return {
			counter: prevState.counter + 1,
		}
	}, 
	callback,
);


/**
 * 3.forceUpdate
 * (1)forceUpdate属于强制render，尽量少使用
 * (2)当前组件调用的hooks：componentWillUpdate -> render -> componentDidUpdate
 * (3)子组件调用的hooks：shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
 */
forceUpdate();


/**
 * 4.props："read-only"
 * (1)props相当于纯函数中的参数，调用前后并不会发生任何改变(就内存而言，即引用的对象的属性不变)
 * 	所以在当前组件内对this.props.a=1这种操作是无效的
 * (2)props即当前组件的标签的属性
 * 	一般是父组件赋予的，这种update才会改变(相当于在纯函数中传入了新的参数)，导致rerender
 * (3)默认props使用defaultProps，如下：
 */
class MyComponent extends React.Component {
	//...
}
MyComponent.defaultProps = {
	name: "red"	// 当<MyComponent />没有写name属性，或者强行设为null时，在内部生成一个默认属性(值)
}


/**
 * 5.Pure Component
 * (1)纯组件相比一般组件，实现了shouldComponentUpdate：
 * 	对state/props进行"浅比较"(即直接比较引用)，以提高性能
 * 	所以适合KV对不含有引用类型的state/props的组件
 * (2)代替方案：使用forceUpdate(TODO)；Immutable.js
 * (3)shouldComponentUpdate跳过了子树的props update，所以要保证所有子组件也是pure的(TODO)
 */
class MyPureComponent extends React.PureComponent {
	
}


/**
 * 6."受控组件"(Control Component)：指input/textarea/select等等的控件：
 * (1)如果没有写类似：value={this.state.value}，只是赋予初始(字面)值甚至不指定value，就是非受控组件，
 * 	  意味着它的值是由DOM管理的，我们不用写什么就可以天然回显、随时改变。
 * (2)如果写了类似：value={this.state.value}，就是React中所谓受控组件，
 *    意味着它的值是React中所说的状态，是需要我们去手动管理的(在类onChange回调中setState)，
 * 	  否则会因为不能重渲染而一直显示同样的值，无法改变(回显)。
 * 
 * 参考：
 * - http://www.cnblogs.com/wonyun/p/6023363.html
 * - https://tylermcginnis.com/react-interview-questions/
 * （What is the difference between a controlled component and an uncontrolled component?）
 */
class PizzaTranslator extends React.Component {
	constructor(props) {
		this.state = {
			val: '',	// 定义state(Model)；同时也是<input>的初始值
		};
	}

	handleChange(event) {
		const newVal = event.target.value;
		// 普通的<input>元素天生就是实时回显的
		// 然而在React中，这种实时回显就是一种rerender，需要交由setState来间接控制
		// 所以，假如没有setState这一句，那么<input>就不能够回显了，值是固定的
		// 通过setState => 改变state(Model) => (由于数据单向流动)val属性监听了state对象的所有<input>(View)都会有所改变
		this.setState({ 
			val: newVal, // 控制要回显的值，这里就是没有任何改变地显示用户输入的值
		});
	}

	render() {
		return (
			<input
				type="text"
				// 可以理解为Model -> View的单向流动
				value={this.state.val}
				// 用户每次输入都会触发change事件进而回调onChange方法
				// React.input：onChange(event)
				// RN.TextInput：onChangeText(newVal)
				onChange={this.handleChange.bind(this)}
			/>
		)
	}
}


/**
 * 7.新建Component的几种方式(熟知JS OOP知识点)
 * 更详细的分析可参考：https://www.cnblogs.com/wonyun/p/5930333.html
 */
// (1)ES6 class(基于类)。属于Class Component
class MyComponent extends React.Component {
	constructor(props) {
		super(props); // 构造器中的第一句只能这样写
		this.state = { // 初始化state对象
			name: ''
		};
	}
	render() {
		return (
			<div>{ this.props.text }</div>
		)
	}
}
// (2)函数式(入参不被改变)的组件(基于函数)。属于Functional Component。
// 更甚之，如果只有return方法，就属于无状态(不用维护state)组件
// 注意：这里不要用this!
function MyComponent(props) {
	let text = null;
	function handleClick(event) {
		//...
	}

	return (
		<div>
			{props.text}
		</div>
	)
}
// (3)ES5(基于对象)。属于Class Component
const MyComponent = React.createClass({
	// 该方法用来初始化state对象
	getInitialState: function () {
		return {
			name : ''
		}
	},
	render: function () {
		return (
			<div>{this.props.text}</div>
		)
	}
});

/**
 * 8.(至少)3种正确绑定事件的方式
 * 理由：
 * React事件处理涉及到函数传递，而在JS中函数传递不会捎上作用域
 * 所以当事件处理函数被回调时，this并不是指向当前component实例
 * 所以，要在正确的作用域中手动绑定/调用方法
 * 
 */
class MyComponent extends Component {
	constructor(props) {
		super(props);
		this.name = "MyComponent";
		// 方法1：
		// 提前在构造器中，给事件处理函数显式绑定
		// 或者，在传递给button的时候绑定
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		this.name = "click MyComponent";
	}

	// 方法4：
	// 定义方法时就使用箭头函数(就类中的方法定义而言，该语法有点奇怪)
	// 然后直接传入：onClick={this.handleClick2}
	handleClick2 = (event) => {
		this.name = "click MyComponent";
	}

	render() {
		return (
			<button 
				// 方法2：
				// 使用(ES6)箭头函数，如无意外，这时候this指向当前组件实例
				onClick={ event => this.handleClick(event) }
				// 方法3：
				// 在<button>的事件处理方法内部，使用正确的作用域再次"隐式"调用自己写的事件处理函数(即常见的that=this大法)
				onClick={ function (event) {
					that.handleClick(event);
				} }>
				Click me
			</button>
		)
	}
}


/**
 * 9.对属性即props的一些限制
 * (1)propTypes：检测属性是否传入、以及类型是否满足要求
 * (2)defaultProps：给予默认值
 * 方式：（以下几种本质都是定义在类上）
 * (1)写在A{}中作为static对象
 * (2)写在A{}外，作为A这个类的属性
 */
import PropTypes from 'prop-types';
class MyComponent extends Component {

	// 默认值：定义在类上
	static defaultProps = {
		age: 10,
	}

	render() {
		const name = this.props.name;
		const age = this.props.age;
		return (
			<div>
				{ 'Hello, I am ${name} and ${age} years old!' }
			</div>
		)
	}
}
// 类型检测：定义在类上
MyComponent.propTypes = {
	name: PropTypes.string.isRequired, // name要为string类型，必须传入
	age: PropTypes.number, // age要为number类型，可以不传入
};


/**
 * 10.ref属性：暴露当前DOM元素/组件
 * 参考：https://reactjs.org/docs/refs-and-the-dom.html
 */
// (1)暴露子DOM元素/子组件(class component/functional component)给当前组件实例
// (2)暴露子DOM元素/子组件给父/祖先组件：涉及到"上"传，当然是通过props属性


/**
 * 11.context：自动往下传递属性，使该节点的所有子节点都可以访问
 */
class SomeAncestor extends React.Component {
	getChildContext() { // (1)祖先重写该方法
		return {
			color: 'red', // 可以被子节点访问的属性
		};
	}
}
SomeAncestor.childContextTypes = { // (2)祖先定义childContextTypes，指定context中属性的类型
	color: PropTypes.string,
};

class SomeOffspring extends React.Component {}
SomeOffspring.contextTypes = { // (3)后代定义contextTypes
	color: PropTypes.string,
};


/**
 * 12.组件间通信总结：
 * (1)父子：父到子用props属性传递，子到父用props回调
 * (2)祖先与后代：后代通过context对象，直接沿用祖先中的state
 * (3)跨层级太多、交互太复杂时：redux
 * (4)任意关系：RN对原生模块的封装、基于订阅发布模式的DeviceEventEmitter类，提供类似事件总线(全局)的功能
 */


/**
 * 13.更新复杂嵌套结构的state
 * 参考：https://stackoverflow.com/questions/27105257/storing-an-object-in-state-of-a-react-component
 * (首先，this.setState这个方法本来就改变了state的引用，所以state这一层不用担心)
 * 比如使得：this.state.data[index].checked = true;
 * 一、问题：
 * (1)必须用setState方法，不能直接修改this.state
 * 二、方法：
 * (1)使用ES6的对象/数组展开，一层层展开重赋值，属于浅复制
 * (2)ES6的Object.assign，一层层展开重赋值，属于浅复制
 * (3)Normalizr：TODO
 * (4)Immutable.js：TODO
 * (5)简单方法，比如：
 	const newData = this.state.data;
	newData[index].cellContent.index = newIndex;
	this.setState({
		data: newData,
	});
 */