// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';
const ForwardedChild = React.forwardRef(Child)
function Parent(props) {
  let [count,setCount] = React.useState(0)
  let childRef = React.createRef()
  let getFocus = () => {
    childRef.current.focus()
  }
  return(
    <div>
      <ForwardedChild ref={childRef}  />
      <button onClick={getFocus}>获取焦点</button>
      <p>{count}</p>
      <button onClick={() => setCount(count+1)}>+</button>
    </div>
  )
}

function Child(props,childRef) {
  let inputRef = React.createRef()
  React.useImperativeHandle(childRef,() => {
    return {
      focus(){
        inputRef.current.focus()
      }
    }
  })
  return <input ref={inputRef}  />
}

ReactDOM.render(<Parent/>,document.getElementById('root'));
 