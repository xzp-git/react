import React from "./react";
import ReactDom from "./react-dom";



class MouseTracker extends React.Component{
  constructor(props){
    super(props)
    this.state = {x:0,y:0}
  }
  handlerMouseMove = (e) => {
    this.setState({
      x:e.clientX,
      y:e.clientY
    })
  } 


  render(){
    return(
      <div onMouseMove={this.handlerMouseMove}> 
        {this.props.render(this.state)}
      </div>
    )
  }
}



// ReactDom.render(
// <MouseTracker>
// {
//   props => (
//     <div>
//       <h1>移出鼠标</h1>
//         <p>当前的鼠标位置x:{props.x}y:{props.y}</p>
//     </div>
//   )
// }
// </MouseTracker>
// , 
//  document.getElementById('root')) 

ReactDom.render(
  <MouseTracker render={
    props => (
      <div>
        <h1>移出鼠标</h1>
          <p>当前的鼠标位置x:{props.x}y:{props.y}</p>
      </div>
    )
  }>
  
  </MouseTracker>
  , 
   document.getElementById('root')) 




