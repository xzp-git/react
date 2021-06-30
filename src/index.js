import React from './react';
import ReactDOM from './react-dom';

/* 
useLayoutEffect 在浏览器绘制之前执行

useEffect  是在浏览器绘制之后执行的

useRef

*/
function Animation() {
  const divRef = React.useRef()
  React.useLayoutEffect(() => {
    divRef.current.style.WebkitTransform='translate(500px)'
    divRef.current.style.transition='all 1000ms'
  })
  let style = {
    width:'100px',
    height:'100px',
    backgroundColor:'red'
  }

  return <div ref={divRef} style={style} >内容</div>
}


ReactDOM.render(<Animation/>,document.getElementById('root'));
 