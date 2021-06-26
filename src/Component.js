import { createDOM, compareTwoVdom, findDOM } from "./react-dom";

export let updateQueue = {
    isBatchingUpdate:false, //当前是否处于批量更新模式，默认值是false
    updaters:[],
    batchUpdate(){
        for (const updater of this.updaters) {
            updater.updateComponent()  
        }
        
        this.isBatchingUpdate = false
        this.updaters.length = 0
    }
}

class Updater{
    constructor(classInstance){
        this.classInstance = classInstance //类组件的实例
        this.pendingStates = [] //等待生效的状态，可能是一个对象，也可能是一个函数
        this.cbs = []
    }
    addState(partialState,cb){
        partialState && this.pendingStates.push(partialState)  //等待生效的状态
        if ( typeof cb === 'function')  this.cbs.push(cb)//状态更新后的回调
        
        this.emitUpdate()
        
        
    }
    //一个组件不管是属性变了 还是状态变了都会更新
    emitUpdate(nextProps){
        this.newProps = nextProps
        if (updateQueue.isBatchingUpdate) { //如果当前是批量更新模式，先缓存
            updateQueue.updaters.push(this) //本次setState调用结束

        }else{
            this.updateComponent() //直接更新组件
        }
    }
    updateComponent(){
        let {classInstance, pendingStates, cbs, newProps} = this
        //如果有等待更新的状态
        if ( newProps  || pendingStates.length > 0) {
            /* classInstance.state = this.getState() //计算新状态
            classInstance.forceUpdate()
            cbs.forEach(cb => cb && cb());
            cbs.length = 0 */

            shouldUpdate(classInstance,newProps ,this.getState(newProps))
            cbs.forEach(cb => cb && cb());
            cbs.length = 0 
        }
    }
    getState(nextProps){
        let {classInstance, pendingStates} = this
        let {state} = classInstance
        pendingStates.forEach((nextState) => {
            if (typeof nextState === 'function') {
                nextState = nextState.call(classInstance,state)
            }
            state = {...state, ...nextState}
        })
        pendingStates.length = 0
        if (classInstance.constructor.getDerivedStateFromProps) {
            let partialState = classInstance.constructor.getDerivedStateFromProps(nextProps,classInstance.state)
            if (partialState) {
                state = {...state,...partialState}
            }
        }
        
        return state
    }
}
function shouldUpdate(classInstance, nextProps, nextState) {
   
    let willUpdate = true
    
    if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
        willUpdate = false
    }
    if (willUpdate && classInstance.componentWillUpdate) {
        classInstance.componentWillUpdate()
    }
    if (nextProps) {
        classInstance.props = nextProps
    }
    
    classInstance.state = nextState  //不管组件要不要更新，其实组件的state一定会更新
    // if (classInstance.constructor.contextType) {
    //     classInstance.context = classInstance.constructor.contextType.Provider._value
    // }
    if (willUpdate) {
        classInstance.updateComponent()
    }
    

}
export class Component{

    static isReactComponent = true

    constructor(props){
        this.props = props
        this.state = {}
        this.updater = new Updater(this)
    }
       
    //部分状态
    setState(partialState, cb){
        this.updater.addState(partialState, cb)
    }

    render(){
        throw new Error('此方法为抽象方法')
    }
        //一般来说组件的属性和状态变化了才会更新组件
        // 如果属性和状态没变,我们也想更新怎么办呢 就可以调用forceUpdate 强行更新
    forceUpdate(){
        let nextState = this.state
        let nextProps = this.props
        if (this.constructor.getDerivedStateFromProps) {
            let partialState = this.constructor.getDerivedStateFromProps(nextProps,nextState)
            if (partialState) {
                nextState = {...nextState,...partialState}
            }
        }
        this.state = nextState
        // if (this.constructor.contextType) {
        //     this.context = this.constructor.contextType.Provider._value
        // }
        this.updateComponent()
    }
    updateComponent (){
        
        let newRenderVdom = this.render() //重新调用render方法 
        let oldRenderVdom=this.oldRenderVdom;//div#counter
        let oldDOM = findDOM(oldRenderVdom);//div#counter

        let extraArgs = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate()
        // 深度比较新旧两个虚拟Dom
         compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
        
        this.oldRenderVdom = newRenderVdom
        
        // updateClassComponent(this,newVdom)
        if (this.componentDidUpdate) {
            this.componentDidUpdate(this.props, this.state, extraArgs)
        }
    }
}

// function updateClassComponent(classInstance,newVdom) {
//     let oldDom = classInstance.dom   //取出类组件上次渲染的真实dom
//     let newDom = createDOM(newVdom)
//     oldDom.parentNode.replaceChild(newDom, oldDom) 
//     classInstance.dom = newDom
// }

export class PureComponent extends Component{
    // 重写了此方法 只有状态 属性变化了才会进行更新 佛则 不更新
    shouldComponentUpdate(nextProps,nextState){
        return !shallowEqual(this.props,nextProps) || !shallowEqual(this.state,nextState)
    }
}
function shallowEqual(obj1,obj2) {
    if (obj1 === obj2) {//如果引用地址一样，就相等 不关心属性变没变
        return true
    }
    // 任何一方是对象或者 不是null也不相等 null  null
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false   
    }

    let keys1 = Object.keys(obj1)
    let keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
        return false
    }

    for (const key of keys1) {
        if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
            return false
        }
    }
    return true
}


