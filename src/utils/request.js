/**
 * 封装axios请求模块
 */
import axios from 'axios'
// create方法返回一个带有基本信息的axios对象
// 开发环境接口基准地址
const request = axios.create({
    baseURL:'http://toutiao.itheima.net/' //接口的基准路径
})

// 生产环境的接口基准地址
// const Myrequest = axios.create({
//     baseURL:'http://toutiao.itest/itheima.net/' //接口的基准路径
// })

export default request
// export default Myrequest //生产环境导出这个axios对象