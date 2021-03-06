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

            shouldUpdate(classInstance,newProps ,this.getState())
            cbs.forEach(cb => cb && cb());
            cbs.length = 0 
        }
    }
    getState(){
        let {classInstance, pendingStates} = this
        let {state} = classInstance
        pendingStates.forEach((nextState) => {
            if (typeof nextState === 'function') {
                nextState = nextState.call(classInstance,state)
            }
            state = {...state, ...nextState}
        })
        pendingStates.length = 0
        
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
 
    if (willUpdate) {
        classInstance.forceUpdate()
    }
    

}
class Component{

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
        
    forceUpdate(){
        
        let newRenderVdom = this.render() //重新调用render方法 
        let oldRenderVdom=this.oldRenderVdom;//div#counter
        let oldDOM = findDOM(oldRenderVdom);//div#counter
        // 深度比较新旧两个虚拟Dom
         compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
        
        this.oldRenderVdom = newRenderVdom
        
        // updateClassComponent(this,newVdom)
        if (this.componentDidUpdate) {
            this.componentDidUpdate()
        }
    }
}

// function updateClassComponent(classInstance,newVdom) {
//     let oldDom = classInstance.dom   //取出类组件上次渲染的真实dom
//     let newDom = createDOM(newVdom)
//     oldDom.parentNode.replaceChild(newDom, oldDom) 
//     classInstance.dom = newDom
// }


export default Component