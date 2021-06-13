class Component{

    static isReactComponent = true
    constructor(props){
        this.props = props
    }
    render(){
        throw new Error('此方法为抽象方法')
    }
}



export default Component