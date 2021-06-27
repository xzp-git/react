import {Component,PureComponent} from "./Component";
import { useState, useMemo, useCallback, useReducer } from "./react-dom";

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
        delete config.__source
        delete config.__self
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

    function Consumer(props) {
        return props.children( Provider._value)
    }

    return {
        Provider,
        Consumer
    }
}
function cloneElement(oldElement, newProps, ...newChildren) {
    let children = oldElement.props.children
    if (children) {
        if (!Array.isArray(children)) {
            children = [children]
        }
    }else{
        children = []
    }
    children.push(...newChildren)
    children = children.map(wrapToVdom)
    if (children.length === 0) {
        children = undefined
    }else if (children.length === 1) {
        children = children[0]
    }
    newProps.children = children
    let props = {...oldElement.props,...newProps}
    return {...oldElement,props}
}
// 返回的组件要有一个功能,属性变了重新渲染,不变,不更新
function memo(FunctionComponent) {
    

    return class extends PureComponent{
        render(){
            return FunctionComponent(this.props)
        }
    }
}
const React = {
    createElement,
    Component,
    PureComponent,
    createRef,
    createContext,
    cloneElement,
    useState,
    memo,
    useCallback,
    useMemo,
    useReducer
}

export default React