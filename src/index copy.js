import React from "./react";
import ReactDom,{render} from "./react-dom";

// ReactDom.render( <h1>hello</h1>, document.getElementById('root') )

/* 
3.jsx其实也可以是对象，可以在if和for 语句中使用jsx
可以把jsx赋值给变量 还可以作为方法的参数，作为方法的返回值

*/

// let names = ['张三','里四0','外务']

// let elements = names.map((name,index) => (<li key={index}>{name}</li>))

// ReactDom.render( <ul>{elements}</ul>, document.getElementById('root') )

/* 
4.6更新元素渲染
React元素不可变

4.7 React 只会更新必要的部分
*/

// function tick(){
//     const element = (
//         <div>
//             <div>当前时间</div>
//             <span>{new Date().toLocaleTimeString()}</span>
//             <span>中国</span>
//         </div>
//     )

//     ReactDom.render(element,document.getElementById('root'))
    
// }

// setInterval(tick,1000)

let element1 = (
    <div className='title' style={{color:'red',backgroundColor:'blue'}}>
        <span>hello</span> world
    </div>
)
console.log(element1);
// 在react17以前是这样的 在react17后变了 不再转成React.createElement

// let element2 = React.createElement()
// let element2 = _jsx()
console.log(JSON.stringify(element1,null,2))

ReactDom.render(element1,document.getElementById('root'))
/* 
{
  "type": "div",
  "key": null,
  "ref": null,
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": "span",
        "key": null,
        "ref": null,
        "props": {
          "children": "hello"
        },
        "_owner": null,
        "_store": {}
      },
      " world"
    ]
  },
  "_owner": null,
  "_store": {}
}

*/