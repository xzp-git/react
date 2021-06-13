import React from "./react";
import ReactDom from "./react-dom";

 /* 
类组件和类组件的更新

可以在构造函数里，并且只能在构造函数中给this.state复制
定义状态对象
属性对象 父组件给的 不能改变 是只读的
*/
class Counter extends React.Component{
  constructor(props){
    super(props)
    this.state = {number:0}
  }
  handleClick = () => {
    this.setState({number:this.state.number+1})
  }
  render(){
    return(
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}


ReactDom.render(
<Counter />
, 
 document.getElementById('root')) 