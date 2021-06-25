import React from "./react";
import ReactDom from "./react-dom";

function withTracker(OldComponent) {
  
  return class extends React.Component{
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
          <OldComponent {...this.state}></OldComponent>
        </div>
      )
    }
  }
}

function Show(props) {
  return(
    <div>
      <h1>移动鼠标</h1>
      <p>当前鼠标的位置x:{props.x}y:{props.y}</p>
    </div>
  )
}

const MouseTracker = withTracker(Show)

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
  <MouseTracker>
  
  </MouseTracker>
  , 
   document.getElementById('root')) 




