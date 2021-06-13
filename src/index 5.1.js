import React from "./react";
import ReactDom from "./react-dom";

 /* 
5.1 函数式组件
React 元素不仅可以是DOM标签，还可以是用户自定义的组件
1.自定义组件的名称首字母必须是大写的
2.组件必须使用前定义
3.组件需要返回并且只能返回一个根元素
*/

function FunctionComponent(props) {
  return (
    <div className='title' style={{backgroundColor:'black',color:'red'}}>
      <span>{props.name}</span>
      {props.children}
    </div>
  )
}

ReactDom.render(
<FunctionComponent name='Hello'>
  <span>World</span>
</FunctionComponent>, 
 document.getElementById('root')) 