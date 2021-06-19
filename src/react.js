import Component from "./Component";


import {wrapToVdom} from "./utils"
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
        props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
        
    }else{
        if (children !== null) {
            props.children =wrapToVdom(children)
        }
            

    }
   
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