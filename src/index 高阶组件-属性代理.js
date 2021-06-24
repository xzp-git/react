import React from "react";
import ReactDom from "react-dom";
/* 
高阶组件 有三大应用场景

1.属性代理


*/
let withLoading = loadingMessage => OldComponent => {
  return class NewComponent extends React.Component{
    show = () => {
      let div = document.createElement('div')
      div.innerHTML = `<p id='loading' style="position:absolute;top:50%;left:50%;z-index:10;background-color:gray">${loadingMessage}</p>`
      document.body.appendChild(div)
    }
    hide = () => {
      document.getElementById('loading').remove()
    }
    render(){
      let extraProps = {show:this.show,hide:this.hide}
      return <OldComponent {...this.props} {...extraProps} />
    }
  }
}
@withLoading('加载中...')
class Hello extends React.Component{
 
  render(){
    return(
      <div>
        <p>hello</p>
        <button onClick={this.props.show} >显示</button>
        <button onClick={this.props.hide} >隐藏</button>
      </div>
    )
  }
}
ReactDom.render(
<Hello />
, 
 document.getElementById('root')) 




