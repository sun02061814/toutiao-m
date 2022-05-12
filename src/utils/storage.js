/**
 * 封装本地存储操作模块
 */
// 存储数据
export const setItem = (key,value)=>{
    if(typeof value=='object'){
        value = JSON.stringify(value)
    }
    localStorage.setItem(key,value)
}
// 获取数据
export const getItem = (key)=>{
    const res = localStorage.getItem(key)
    // 如果取出的数据是数组或者对象，try正常执行，转化为数组或对象后返回。如果取出的数据是字符串，
    // 则JSON.parse报错，catch会捕获错误，不做任何处理，直接返回
    try{
       return JSON.parse(res)
    }catch(err){
        return localStorage.getItem(key)
    }
}
// 删除本地数据
export const removeItem = key=>{
    localStorage.removeItem(key)
}