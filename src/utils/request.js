/**
 * 封装axios请求模块
 */
import axios from 'axios'
import store from '@/store'
// create方法返回一个带有基本信息的axios对象
// 开发环境接口基准地址
// console.log(axios);
const request = axios.create({
    baseURL:'http://toutiao.itheima.net/' //接口的基准路径
})
// console.log(request); request是一个函数
// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // console.log(config); //config请求配置对象
    // 在发送请求之前做些什么
    const {user} = store.state
    if(user&&user.token){
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 生产环境的接口基准地址
// const Myrequest = axios.create({
//     baseURL:'http://toutiao.itest/itheima.net/' //接口的基准路径
// })

export default request
// export default Myrequest //生产环境导出这个axios对象