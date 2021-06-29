import React from 'react';
import ReactDOM from 'react-dom';
/* 
useEffect里面的代码可以写副作用代码
默认情况下 每次渲染完成都会执行
如果依赖数组是空的话 函数只会执行一次

依赖项发生变化了才会重新执行 如果依赖项不变化，不执行   空数组不会变
*/
function Counter(){
  const [number,setNumber]=React.useState(0);
  React.useEffect(()=>{
     console.log('开启一个定时器');
     const $timer = setInterval(()=>{
      setNumber(number=>number+1);
     },1000);
    //  useEffect执行完成后可以返回一个销毁函数
     return () => {
       clearInterval($timer)
     }
  },[]);
  return (
    <div>
      <p>Counter:{number}</p>
    </div>
  )
}
ReactDOM.render(<Counter/>,document.getElementById('root'));
 