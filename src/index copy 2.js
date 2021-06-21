import React from "./react";
import ReactDom from "./react-dom";

class Counter extends React.Component{
  static defaultProps = {
    name:'计数器'
  }
  constructor(props){
    super(props)
    this.state = {number:0,name:'xzp'}
    console.log('Counter 1.constructor 初始化属性和状态');
  }
  componentWillMount(){
    console.log('Counter 2.componentWillMount 组件将要挂载');
  }
  componentDidMount(){
    console.log('Counter 3.componentDidMount 组件挂载完成');
  }
  handleClick = () => {
   // 肯定是批量更新，而且这个回调函数石凳全部更新完毕后才执行的
    this.setState({number:this.state.number+1},() => {
      console.log("状态的回调函数")
    })

  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('Counter 5.shouldComponentUpdate 询问组件是否要更新', this.state ,nextState);
    // return nextState.number%2 === 0
    return true
  }
  componentWillUpdate(){
    console.log('Counter 6.componentWillUpdate 组件将要更新', this.state);
  }
  componentDidUpdate(){
    console.log('Counter 7.componentDidUpdate 组件更新完成', this.state);
  }
  render(){
    console.log('Counter  render 渲染完成');
    return(
      <div id={`counter-${this.state.number}`}>
        <ChildCounter count={this.state.number}/>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
       
      </div>
    )
  }
}
//  <FunctionCounter count={this.state.number}></FunctionCounter>
class ChildCounter extends React.Component{
  

  constructor(props){
    super(props)
    this.state = {number:0}
    this.client = 0
  }
  // 从组件的新属性中映射出一个状态    componentWillReceiveProps
  static getDerivedStateFromProps(nextProps,prevState){
    const {count} = nextProps
     if (count === 0) {
      return {number:10}
    }else if (count %2 === 0) {
      return {number:count*2}
    }else if (count %3 === 0) {
      return {number:count*3}
    }
    return null
  }
  // componentDidMount(){
  //   window.addEventListener('mousemove',(e) => {
  //     this.client = e.clientX
  //     this.forceUpdate()
  //   })
  // }
  render(){
    return (<div id="child-counter">
            <p>clientX:{this.client}</p>
            {this.state.number}
            </div>)
  }
}

// let FunctionCounter = (props) => <div id="counter-function">{props.count}</div>
ReactDom.render(
<Counter />
, 
 document.getElementById('root')) 

 /* 
 
 Counter 1.constructor 初始化属性和状态
 Counter 2.componentWillMount 组件将要挂载
 Counter  render 渲染完成

 Counter 3.componentDidMount 组件挂载完成
 Counter 5.shouldComponentUpdate 询问组件是否要更新
 Counter 5.shouldComponentUpdate 询问组件是否要更新

 Counter 6.componentWillMount 组件将要更新
 Counter  render 渲染完成
 Counter 7.componentDidMount 组件更新完成
 
 
 */


