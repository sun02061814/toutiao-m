/**
 * 封装axios请求模块
 */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// create方法返回一个带有基本信息的axios对象
// 开发环境接口基准地址
// console.log(axios);
const request = axios.create({
  //baseURL:'http://toutiao.itheima.net/' //接口的基准路径
  baseURL: 'http://geek.itheima.net/' //接口的基准路径
})
// console.log(request); request是一个函数
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // console.log(config); //config请求配置对象
  // 在发送请求之前做些什么
  const {user} = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, async function (error) {
  // console.log(error);
  // 对响应错误做点什么
  const user = store.state.user
  if (!user || !user.refresh_token) {
    return router.push('/login')
  }
  if (error.response && error.response.status == 401) {
    try {
      const res = await axios({
        method: 'PUT',
        url: 'http://geek.itheima.net/v1_0/authorizations',
        headers:{
          Authorization:`Bearer ${user.refresh_token}`
        } 
      })
      console.log('token刷新成功', res);
      store.commit('setUser',{
        token:res.data.data.token, //最新获取的可用token
        refresh_token:user.refresh_token //还是原来的refresh_token
      })
      // 把之前失败的用户请求继续发出去
      // config 是一个对象，其中包含本次失败请求相关的配置信息，例如url，method等
      // return 把request的请求结果继续返回给发送请求的具体位置
      return request(error.config)
    } catch (err) {
      console.log(err);
      router.push('/login')
    }
  }
  return Promise.reject(error);
});

// 生产环境的接口基准地址
// const Myrequest = axios.create({
//     baseURL:'http://toutiao.itest/itheima.net/' //接口的基准路径
// })

export default request
// export default Myrequest //生产环境导出这个axios对象