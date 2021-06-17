import Component from "./Component";
/* 

type 元素的类型
config 配置对象
children 儿子或儿子们

*/


function createElement(type, config, children) {
    if (config) {
        delete config._source;
        delete config._self
    }
    let props = {...config}

    if (arguments.length > 3) {
        children = Array.prototype.slice.call(arguments,2)
    }
    props.children = children
    return {
        type,
        props
    }
}


const React = {
    createElement,
    Component
}

export default React