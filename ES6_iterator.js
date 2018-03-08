/**
 * ES6中的Iterator接口
 * 连接着较多知识点：
 * (1)for of...与Symbol.iterator
 * (2)generator与yield
 * 所以需要做个总结
 */

/**
 * 几个概念的接口定义(TypeScript描述)
 * 1.IteratorResult:迭代结果。done表示迭代是否结束，value表示当前迭代的值的对象
 * 2.Iterator:迭代器。可以调用next方法以返回一个迭代结果的对象
 * 3.Iterable:可迭代(即可以用for of...遍历的)，下面两种情况either:
 * (1)属性[Symbol.iterator]是一个迭代器的对象
 * (2)(使用yield的)generator返回的
 */
`
interface IteratorResult { // 迭代结果：done表示迭代是否结束，value表示当前迭代的值的对象
    done: boolean;
    value: any;
}

interface Iterator { // 迭代器：可以调用next方法以返回一个迭代结果的对象
    next(): IteratorResult
}

interface Iterable { // 可迭代(即可以for of...)：属性[Symbol.iterator]是一个迭代器的对象
    [Symbol.iterator](): Iterator
}
`