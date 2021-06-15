import React from "./react";
import ReactDom from "./react-dom";

 /* 
类组件和类组件的更新

可以在构造函数里，并且只能在构造函数中给this.state复制
定义状态对象
属性对象 父组件给的 不能改变 是只读的
*/


/* 
合成事件和批量更新
1. 在react 里 事件的更新可能是异步的，是批量的 不是同步的
调用state之后状态并没有立刻更新 而是先缓存起来了
等事件函数处理完成后，再进行批量更新，一次更新并重新渲染

结论  因为 jsx事件处理函数是react控制的 只要归react控制（事件处理函数，生命周期函数）就是批量,只要不归react管了就是非批量

this.setState((lastState) => {number:lastState.number+1},(state) => {
  console.log('callback1',state)
})

*/
class Counter extends React.Component{
  constructor(props){
    super(props)
    this.state = {number:0,name:'xzp'}
  }
  handleClick = () => {

    // this.setState({number:this.state.number+1},() => {
    //   console.log('callback1',this.state.number)
    // })
    // this.setState({number:this.state.number+1},() => {
    //   console.log('callback2',this.state.number)
    // })
    // 肯定是批量更新，而且这个回调函数石凳全部更新完毕后才执行的
    this.setState((lastState) => ({number:lastState.number+1}),() => {
      console.log('callback1',this.state.number)
    })
    console.log(this.state.number);
    this.setState((lastState) => ({number:lastState.number+1}),() => {
      console.log('callback2',this.state.number)
    })
    console.log(this.state.number);
    setTimeout(() => {
      console.log(this.state.number);
      this.setState((lastState) => ({number:lastState.number+1}),() => {
        console.log('callback3',this.state.number)
      })
      console.log(this.state.number);
      this.setState((lastState) => ({number:lastState.number+1}),() => {
        console.log('callback4',this.state.number)
      })
      console.log(this.state.number);
    },0)
  }
  render(){
    return(
      <div>
        <h1>{this.state.name}</h1>
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

 /*  期望结果
 0
 0
 callback1 2
 callback2 2
 2
 callback3 3
 3
 callback4 4
 4
 
 */

