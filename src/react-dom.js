
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

function createDOM(vdom) {
    //TODO  处理vdom是数字或者字符串的情况
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom)
    }
    // react 元素
    let {type, props} = vdom;
    let dom = document.createElement(type)
    return dom
}


const ReactDom = {
    render
}

export default ReactDom