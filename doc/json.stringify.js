let obj = {name:'xzp',age:'24'}

// obj 对象
// replacer 替换器  改变字符  不会影响原对象
// 2 空格
console.log(JSON.stringify(obj,replacer,2));


function replacer(key,value) {
    if (key === 'name') {
        return value + 'jy'
    }else{
        return value
    }
}