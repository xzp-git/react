import { addEvent } from "./event";
import { REACT_TEXT } from "./constants";

// 这是一个数组里面存放了我么所有的状态
let hookStates = []
// hook索引表示当前的hook
let hookIndex = 0
let scheduleUpdate


export function useEffect(callback, dependencies) {
     if (hookStates[hookIndex]) {
         let [destroyFunction,lastDependencies] = hookStates[hookIndex]
         let allTheSame = dependencies && dependencies.every((item,index) => item === lastDependencies[index])
        if (allTheSame) {
            hookIndex++
        }else{
            destroyFunction && destroyFunction()
            setTimeout(()=>{
                let destroyFunction = callback()
    
                hookStates[hookIndex++] = [destroyFunction,dependencies]
            })
        }
        }else{//说明是第一次执行
        //为了保证次回调函数不是同步执行，而是在页面渲染后执行
        setTimeout(()=>{
            let destroyFunction = callback()

            hookStates[hookIndex++] = [destroyFunction,dependencies]
        })
     }
}
export function useLayoutEffect(callback, dependencies) {
    if (hookStates[hookIndex]) {
        let [destroyFunction,lastDependencies] = hookStates[hookIndex]
        let allTheSame = dependencies && dependencies.every((item,index) => item === lastDependencies[index])
       if (allTheSame) {
           hookIndex++
       }else{
           destroyFunction && destroyFunction()
           queueMicrotask(()=>{
               let destroyFunction = callback()
   
               hookStates[hookIndex++] = [destroyFunction,dependencies]
           })
       }
       }else{//说明是第一次执行
       //为了保证次回调函数不是同步执行，而是在页面渲染后执行
       queueMicrotask(()=>{
           let destroyFunction = callback()

           hookStates[hookIndex++] = [destroyFunction,dependencies]
       })
    }
}

export function useRef(initialState) {
    hookStates[hookIndex] = hookStates[hookIndex] || {current:initialState}
    return hookStates[hookIndex++]
}
/* 
1.把vdom 变成真实的Dom
2.把虚拟dom的属性更新到Dom上
3.把此Dom的儿子们也都变成真实Dom挂载到自己的dom上 dom.appendChild
4.把自己挂载到容器上  


vdom 要渲染的虚拟dom
container 要把虚拟DOM转换真实DOM并插入到那个容器中

*/



function render(newVdom,parentDom,nextDOM) {
    // if (newVdom) {
    //    // debugger
    //     // console.log(Deep(vdom));
    //     let newDOM = createDOM(newVdom)
    //     if (nextDOM) {
    //         parentDom.insertBefore(newDOM,nextDOM)
    //     }else{
    //         parentDom.appendChild(newDOM)
    //     }
    
    // }

    mount(newVdom,parentDom,nextDOM)
    scheduleUpdate = () => {
        hookIndex = 0;//在状态修改后 调试更新的时候 索引重置为0
        compareTwoVdom(parentDom,newVdom,newVdom)
    }
    
    // dom.componentDidMount && dom.componentDidMount()
}  

function mount(newVdom,parentDom,nextDOM) {
    if (newVdom) {
       // debugger
        // console.log(Deep(vdom));
        let newDOM = createDOM(newVdom)
        if (nextDOM) {
            parentDom.insertBefore(newDOM,nextDOM)
        }else{
            parentDom.appendChild(newDOM)
        }
    
    }
    
    // dom.componentDidMount && dom.componentDidMount()
}  

export function createDOM(vdom) {
    let {type, props, ref} = vdom;

    let dom;

    if (type === REACT_TEXT) {
        dom = document.createTextNode(props.content)
    }else if (typeof type === 'function') { //函数组件
        if (type.isReactComponent) {
            return mountClassComponent(vdom)
        }else{
            return mountFunctionComponent(vdom)
        }
    }else{ //原生组件
        dom = document.createElement(type)
        
    }
    
    // 使用虚拟dom的属性更新刚创建出来的真实dom的属性
    if (props) {
        updateProps(dom,{},props)
        if(typeof props.children === 'object' && props.children.type) {
            mount(props.children, dom) 
    
            // 如果儿子是一个数组的话，说明儿子不止一个
        }else if (Array.isArray(props.children)) {
            reconcileChildren(props.children, dom)
        }
    }
    

    // 把真实dom 作为一个dom属性放在虚拟dom上 为以后的更新做准备
    // debugger
    // vdom = {
    //     ...vdom,
    //     dom
    // }
    vdom.dom =dom
    if (ref) {
        ref.current = dom
    }
    return dom
}

// 把一个类型为自定义函数组件的虚拟Dom转换为真实Dom并返回
function mountFunctionComponent(vdom) {
    let {type:FunctionComponent, props} = vdom
    let oldRenderVdom = FunctionComponent(props)
    vdom.oldRenderVdom = oldRenderVdom
    return createDOM(oldRenderVdom)
}


function reconcileChildren(childrenVdom, parentDom) {
    for (let i = 0; i < childrenVdom.length; i++) {
        let childVdom = childrenVdom[i];
        mount(childVdom,parentDom)
    }
}



function updateProps(dom,oldProps,newProps) {
    for (const key in newProps) {
        if (key === 'children') continue; //单独处理 不在此处处理 
        if (key === 'style') {
            let styleObj = newProps.style
            for (const attr in styleObj) {
               dom.style[attr] = styleObj[attr]
            }

        }else if(key.startsWith('on')){
            // dom[key.toLocaleLowerCase()] = newProps[key]
            addEvent(dom,key.toLocaleLowerCase(),newProps[key])
        }else{
            dom[key] = newProps[key]
        }
    }
}

/* 
1.创建类组件的实例
2.调用类组件实例的render方法获得返回的虚拟Dom(React元素)
3.把返回的虚拟DOM转成真实DOM进行挂载
*/
function mountClassComponent(vdom) {
    // 解构类的定义和类的属性对象
    let {type, props, ref} = vdom
    // 创建类的实例
    let classInstance = new type(props)
    if (ref) {
        classInstance.ref = ref
    }
    if (type.contextType) {
        classInstance.context = type.contextType.Provider._value
    }
    // classInstance.ownVdom = vdom
    //让这个类组件的虚拟DOM的classInstance属性指向这个类组件的实例
    vdom.classInstance=classInstance
    if (classInstance.componentWillMount) {
        classInstance.componentWillMount()
    }
    if (type.getDerivedStateFromProps) {
        let partialState = type.getDerivedStateFromProps(classInstance.props, classInstance.state)
        if (partialState) {
            classInstance.state = {...classInstance.state, ...partialState}
        }
    }
    // 调用实例的render方法返回要渲染的虚拟dom对象
    let oldRenderVdom = classInstance.render()
    
   
    vdom.oldRenderVdom = oldRenderVdom
    // 根据虚拟dom对象创建真实dom对象
    let dom = createDOM(oldRenderVdom)

    classInstance.oldRenderVdom = oldRenderVdom 
    if (classInstance.componentDidMount) {
        classInstance.componentDidMount()
    //    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
    }
    // 为以后类组件的更新，把真实dom挂载到了类的实例上
    // classInstance.dom = dom
    return dom
}

export function compareTwoVdom(parentDom,oldVdom,newVdom,nextDOM) {
    // 老的虚拟DOM和新的虚拟DOM都是null
    if (!oldVdom && !newVdom) {

    // 如果老的虚拟DOM有，新的虚拟DOM没有
    }else if ( oldVdom && !newVdom ) {
        let currentDOM = findDOM(oldVdom);//先找到此虚拟DOM对应的真实DOM
        if (currentDOM) {
            parentDom.removeChild(currentDOM )
        }
        if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
            oldVdom.classInstance.componentWillUnmount()
        }
        

    // 如果老的是个null 新的有值 新建dom节点并且插入
    }else if (!oldVdom && newVdom) {
        mount(newVdom,parentDom,nextDOM)
        

    // 老的有新的也有 但是类型不同
    }else if(oldVdom && newVdom && (oldVdom.type !== newVdom.type)){
        // render(newVdom,parentDom,nextDOM)
        let oldDOM = findDOM(oldVdom)
        let newDOM = createDOM(newVdom)
        parentDom.replaceChild(newDOM,oldDOM)
        if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
            oldVdom.classInstance.componentWillUnmount()
        }
    //如果新的有 老的也有 并且类型也一样 ， 进行深度的DOM-diff
    // 更新自己的属性 另一方面要深度比较儿子们
    }else{
        updateElment(oldVdom,newVdom)

    }
}


function updateElment(oldVdom,newVdom) {
     if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
        let currentDOM = newVdom.dom = oldVdom.dom //复用老的真实DOM
        currentDOM.textContent = newVdom.props.content
     }else if (typeof oldVdom.type === 'string') {
        let currentDOM = newVdom.dom = oldVdom.dom
        updateProps(currentDOM,oldVdom.props,newVdom.props)
        updateChildren(currentDOM,oldVdom.props.children,newVdom.props.children)
    }else if( typeof oldVdom.type === 'function' ){
        if (oldVdom.type.isReactComponent) {
            updateClassComponent(oldVdom,newVdom)
        }else{
            updateFunctionComponent(oldVdom,newVdom)
        }
    }
}
// 老的虚拟DOM节点 和 新的虚拟节点都是类组件
function updateClassComponent(oldVdom,newVdom) {
    let classInstance = newVdom.classInstance = oldVdom.classInstance //类的实例要复用  不管更新多少次 只有一个实例
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom// 上一次类组件渲染出来的虚拟DOM

    if (classInstance.componentWillReceiveProps) {//组件将要接收到新的属性
        classInstance.componentWillReceiveProps()
    }
    // 触发组件更新，要把新的属性传过来
    classInstance.updater.emitUpdate(newVdom.props)
}
function updateFunctionComponent(oldVdom,newVdom) {
    let parentDom = findDOM(oldVdom).parentNode
    let {type, props} = newVdom
    let oldRenderVdom = oldVdom.oldRenderVdom
    let newRenderVdom = type(props)
    
    compareTwoVdom(parentDom,oldRenderVdom,newRenderVdom)
    newVdom.oldRenderVdom = newRenderVdom
}

function updateChildren(parentDom,oldVchildren,newVchildren) {

    // 因为children可能是对象，也可能是数组为了方便按索引比较，全部格式化为数组
    oldVchildren = Array.isArray(oldVchildren)?oldVchildren:[oldVchildren]
    newVchildren = Array.isArray(newVchildren)?newVchildren:[newVchildren]
    let maxLength = Math.max(newVchildren.length,oldVchildren.length)
    for (let i = 0; i < maxLength; i++) {
        // 在儿子里面 找索引大于当前索引的
        let nextDOM = oldVchildren.find((item,index) => index>i&& item && item.dom)
        compareTwoVdom(parentDom,oldVchildren[i],newVchildren[i],nextDOM && nextDOM.dom)
        
    }

}
export function findDOM(vdom) {
    let { type } = vdom
    let dom;
    if (typeof type === 'function') {

            dom = findDOM(vdom.oldRenderVdom)
    }else{
        dom = vdom.dom
    }
    return dom
}



// 让函数组件可以使用状态
export function useState(initialState) {
    

    return useReducer(null,initialState)
}

export function useMemo(factory,deps) {
    if (hookStates[hookIndex]) {
        let [lastMemo,lastDeps] = hookStates[hookIndex]
        let same = deps.every((item,index) => item===lastDeps[index])
        if (same) {
            hookIndex++;
            return lastMemo
        }else{
            let newMemo = factory()
            hookStates[hookIndex++] = [newMemo,deps]
            return newMemo
        }
    }else{
        let newMemo = factory()
        hookStates[hookIndex++] = [newMemo,deps]
        return newMemo
    }
}

export function useCallback(callback,deps) {
    if (hookStates[hookIndex]) {
        let [lastCallback,lastDeps] = hookStates[hookIndex]
        let same = deps.every((item,index) => item===lastDeps[index])
        if (same) {
            hookIndex++;
            return lastCallback
        }else{
            hookStates[hookIndex++] = [callback,deps]
            return callback
        }
    }else{
        hookStates[hookIndex++] = [callback,deps]
        return callback
    }
}
 
export function useReducer(reducer, initialState) {
    // 把老的值取出来 如果没有 就用默认值
    hookStates[hookIndex] =  hookStates[hookIndex] || (typeof initialState === 'function'?initialState() : initialState)

    let currentIndex = hookIndex
    function dispatch(action) {
        
        let lastState = hookStates[currentIndex]
        let nextState
        if (typeof action === 'function') {
            nextState = action(lastState)
        }
        if (reducer) {
            nextState = reducer(nextState,action)
        }

        
        hookStates[currentIndex] = nextState
        scheduleUpdate() //当状态变化要重新更新应用
    }

    return [hookStates[hookIndex++],dispatch]
}

const ReactDom = {
    render
}

export default ReactDom