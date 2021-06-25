import React from "./react";
import ReactDom from "./react-dom";
/* 
高阶组件 有三大应用场景

1.反向继承


*/

class Button extends React.Component{
 state = {name:'张三'}
 componentWilMount(){
  console.log('Button componentWilMount');
}
 componentDidMount(){
   console.log('Button componentDidMount');
 }
  render(){
    console.log('Button render');
    return(
      <button name={this.state.name} title={this.props.title}></button>
    )
  }
}
const wrap = Button => {
  return class wrapButto extends Button{
    state = {number:0}
    componentWilMount(){
      console.log('Button componentWilMount');
      super.componentWilMount()
    }
     componentDidMount(){
       console.log('Button componentDidMount');
       super.componentDidMount()
     }
     add = () => {
       this.setState({number:this.state.number+1})
     }
    render(){
      console.log('wrapButto render')
      let superRenderElement = super.render()
      let renderElement = React.cloneElement(superRenderElement,{onClick:this.add},this.state.number)
      return renderElement
    }
  }
}
let WrapButton = wrap(Button)
ReactDom.render(
<WrapButton title="标题" />
, 
 document.getElementById('root')) 




