import React from "./react";
import ReactDom from "./react-dom";
/* 
默认情况下，只要改变了状态，那么所有的组件，不管他的属性变没有，都要更新


*/
class Parent extends React.Component{
  state = {number1:0,number2:0}

  addnumber1 = () =>{
    this.setState({number1:this.state.number1+1})
  }
  addnumber2 = () =>{
    this.setState({number2:this.state.number2+1})
  }
  render(){
    console.log("Parent render");
    return(
      <div>
        <ChildCounter1 number={this.state.number1} />
        <ChildCounter2  number={this.state.number2} />
        <button onClick={this.addnumber1}>ChildCounter1+</button>
        <button onClick={this.addnumber2}>ChildCounter2+</button>
      </div>
    )
  }
}
class ChildCounter1 extends React.PureComponent{
  render(){
    console.log("ChildCounter1 render");
    return(
      <div>ChildCounter1:{this.props.number}
       </div>
    )
  }
}
class ChildCounter2 extends React.PureComponent{
  render(){
    console.log("ChildCounter2 render");
    return(
      <div>ChildCounter2:{this.props.number}
       </div>
    )
  }
}

ReactDom.render(
  <Parent>
  
  </Parent>
  , 
   document.getElementById('root')) 




