import React from "./react";
import ReactDom from "./react-dom";
let ColorContext = React.createContext() //{Provider,Consumer}
class Person extends React.Component{
 state = {color:'red'}
 changeColor =(color) => this.setState({color})

 render(){
   let contextValue = {color:this.state.color, changeColor:this.changeColor}
   return(
    <ColorContext.Provider value={contextValue}>
     <div style={{width:'200px',color:this.state.color,border:`5px solid ${this.state.color}`,padding:'5px'}}>
      Person
       <Head />
       <Body />
     </div>
    </ColorContext.Provider>
   )
 }
}



class Head extends React.Component{

  static contextType = ColorContext

  render(){
    return(
      <div style={{color:this.context.color,border:`5px solid ${this.context.color}`,padding:'5px'}}>
       Head
        <Eye />
      </div>
    )
  }
 }

 class Body extends React.Component{

  static contextType = ColorContext

  render(){
    return(
      <div style={{color:this.context.color,border:`5px solid ${this.context.color}`,padding:'5px'}}>
       Body
        <Arm />
      </div>
    )
  }
 }
 class Eye extends React.Component{


  static contextType = ColorContext
  render(){
    return(
      <div style={{color:this.context.color,border:`5px solid ${this.context.color}`,padding:'5px'}}>
       Eye
       
      </div>
    )
  }
 }
 function Arm(props) {
  
  return (
    <ColorContext.Consumer>
      {
        contextValue => (
          <div style={{color:contextValue.color,border:`5px solid ${contextValue.color}`,padding:'5px'}}>
            Arm
            <button onClick={() => contextValue.changeColor('red')} >变红</button>
            <button onClick={() => contextValue.changeColor('green')} >变绿</button>
          </div>
        )
      }
    </ColorContext.Consumer>
  )
}
//  class Arm extends React.Component{


//   static contextType = ColorContext
//   render(){
//     return(
//       <div style={{color:this.context.color,border:`5px solid ${this.context.color}`,padding:'5px'}}>
//        Arm
//        <button onClick={() => this.context.changeColor('red')} >变红</button>
//        <button onClick={() => this.context.changeColor('green')} >变绿</button>
//       </div>
//     )
//   }
//  }

ReactDom.render(
<Person />
, 
 document.getElementById('root')) 




