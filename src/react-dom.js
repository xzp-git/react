import { addEvent } from "./event";
/* 
1.把vdom 变成真实的Dom
2.把虚拟dom的属性更新到Dom上
3.把此Dom的儿子们也都变成真实Dom挂载到自己的dom上 dom.appendChild
4.把自己挂载到容器上  


vdom 要渲染的虚拟dom
container 要把虚拟DOM转换真实DOM并插入到那个容器中

*/


function render(vdom, container) {
    const dom = createDOM(vdom)

    container.appendChild(dom)
}  

export function createDOM(vdom) {
    //TODO  处理vdom是数字或者字符串的情况
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }
    // react 元素
    
    let {type, props} = vdom;

    let dom;

    if (typeof type === 'function') { //函数组件
        if (type.isReactComponent) {
            return mountClassComponent(vdom)
        }else{
            return mountFunctionComponent(vdom)
        }
    }else{ //原生组件
        dom = document.createElement(type)
    }

    // 使用虚拟dom的属性更新刚创建出来的真实dom的属性
    updateProps(dom,props)
    // 在这处理props.children属性
    if (typeof props.children ==='string' || typeof props.children ==='number') {
        dom.textContent = props.children
    } else if(typeof props.children === 'object' && props.children.type) {
        render(props.children, dom) 
 
        // 如果儿子是一个数组的话，说明儿子不止一个
    }else if (Array.isArray(props.children)) {
        reconcileChildren(props.children, dom)
    }else{
        document.textContent = props.children? props.children.toString():''
    }

    // 把真实dom 作为一个dom属性放在虚拟dom上 为以后的更新做准备
    
    // vdom.dom = dom
    
    return dom
}

// 把一个类型为自定义函数组件的虚拟Dom转换为真实Dom并返回
function mountFunctionComponent(vdom) {
    let {type:FunctionComponent, props} = vdom
    let renderVdom = FunctionComponent(props)
    return createDOM(renderVdom)
}


function reconcileChildren(childrenVdom, parentDom) {
    for (let i = 0; i < childrenVdom.length; i++) {
        let childVdom = childrenVdom[i];
        render(childVdom,parentDom)
    }
}



function updateProps(dom,newProps) {
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
    let {type, props} = vdom
    // 创建类的实例
    let classInstance = new type(props)
    // 调用实例的render方法返回要渲染的虚拟dom对象
    let renderVdom = classInstance.render()
    // 根据虚拟dom对象创建真实dom对象
    let dom = createDOM(renderVdom)
    // 为以后类组件的更新，把真实dom挂载到了类的实例上
    classInstance.dom = dom
    return dom
}

const ReactDom = {
    render
}

export default ReactDom