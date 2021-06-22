import React from "./react";
import ReactDom from "./react-dom";
let number = 0
class Counter extends React.Component{
  ulRef = React.createRef()
  state = {list:[]} 
  // 他会在DOM更新前执行，可以用来获取更新前的一些DOM信息
 getSnapshotBeforeUpdate(){
   

  return this.ulRef.current.scrollHeight
 }
 componentDidUpdate(prevProps,prevState, scrollHeight){
  console.log('本次的高度',this.ulRef.current.scrollHeight - scrollHeight);
 }
 handleClick = () => {
   let list = this.state.list
   list.push(list.length)
   this.setState({
    list
   })
 }
 render(){
   return(
     <div>
      
       <button onClick={this.handleClick} >+</button>
       <ul ref={this.ulRef}>
         {
           this.state.list.map((item,index) => <li key={index}>{index}</li>)
         }
       </ul>
     </div>
   )
 }
}

ReactDom.render(
<Counter />
, 
 document.getElementById('root')) 




