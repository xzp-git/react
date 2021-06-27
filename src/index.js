import React from "./react";
import ReactDom from "./react-dom";

/* 
hooks 不能用在if或者for中

同步才是hook思维方式
每次渲染都是一个独立的闭包

这个地方的number是当前渲染出来这个函数时候的那个number变量，并不是最新的number
*/
function App(params) {
  let [number,setNumber] = React.useState(100)
  return (
    <div>
      <p>{number}</p>
      <button onClick={() => setNumber(number+1)} >+</button>
    </div>
  )
}



ReactDom.render(
  <App />
  , 
   document.getElementById('root')) 




