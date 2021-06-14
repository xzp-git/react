import { createDOM } from "./react-dom";

class Updater{
    constructor(classInstance){
        this.classInstance = classInstance //类组件的实例
        this.pendingStates = [] //等待生效的状态，可能是一个对象，也可能是一个函数
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
    setState(partialState){
        let state = this.state;
        //合并状态
        this.state = {...state,...partialState}
        //重新调用render方法
        let newVdom = this.render()
        //更新类组件
        updateClassComponent(this,newVdom)
    }
    render(){
        throw new Error('此方法为抽象方法')
    }
}

function updateClassComponent(classInstance,newVdom) {
    let oldDom = classInstance.dom   //取出类组件上次渲染的真实dom
    let newDom = createDOM(newVdom)
    oldDom.parentNode.replaceChild(newDom, oldDom)
    classInstance.dom = newDom
}


export default Component