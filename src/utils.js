import {REACT_TEXT} from './constants'

// 为了后面的DOM-DIFF 我把文本节点进行单独的封装或者说标识
export function wrapToVdom(element) {
    return (typeof element ==='string' || typeof element ==='number')?{type:REACT_TEXT,props:{content:element}}:element
}