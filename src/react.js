import Component from "./Component";


import {wrapToVdom} from "./utils"
/* 

type 元素的类型
config 配置对象
children 儿子或儿子们

*/


function createElement(type, config, children) {
    let ref;
    let key
    if (config) {
        delete config._source
        delete config._self
        ref = config.ref
        delete config.ref
        key = config.key
        delete config.key
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
        props,
        ref,
        key
    }
}

function createRef() {
    return {current:null}
} 

function createContext() {
    function Provider(props) {
        
        if (Provider._value) {
            Object.assign( Provider._value, props.value)
        }else{
            Provider._value = props.value
        }

        return props.children
    }

    // function Consumer(params) {
        
    // }

    return {
        Provider,
        // Consumer
    }
}

const React = {
    createElement,
    Component,
    createRef,
    createContext
}

export default React