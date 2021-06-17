import { updateQueue } from "./Component";

// 为什么要做合成事件 要做事件委托
// 1.做兼容处理 兼容不同的浏览器 不同的浏览器event是不一样的 处理浏览器的兼容性
// 2.可以在你写的事件处理函数之前和之后 比如修改
// 之前 updateQueue.isBatchingUpdate = true
// 之后 updateQueue.batchUpdate()
export function addEvent(dom, eventType, listener) {
    let store = dom.store || (dom.store = {})
    store[eventType] = listener //store.onclick = handleClick
    if (!document[eventType]) {
        // 事件委托，不管给那个元素绑定事件 最后都统一 委托在document上去了
        document[eventType] = dispatchEvent //document.onclick = dispatchEvent
    }
}


let syntheticEvent = {
   stopping:false,
   stop(){
       this.stopping = true
       console.log('阻止冒泡');
   } 
}


function dispatchEvent(event) {
    let {target, type} = event //事件源 = button 那个DOM元素  类型 type = click
    let eventType = `on${type}`
    updateQueue.isBatchingUpdate = true// 把队列设置为批量更新的模式
    syntheticEvent = createSyntheticEvent(event)
    while (target) {
        let {store} = target
        let listener = store && store[eventType]
        listener && listener.call(target,syntheticEvent);
        if (syntheticEvent.stopping) break
        target = target.parentNode
    }
    
    for (const key in syntheticEvent) {
        syntheticEvent[key] = null
    }
    updateQueue.isBatchingUpdate = false
    updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
    for (const key in nativeEvent) {
        syntheticEvent[key] = nativeEvent[key]
    }
    return syntheticEvent
}