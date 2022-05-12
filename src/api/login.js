/**
 * 登录请求模块
 */
import request from '../utils/request'
// 登录
export const loginAPI = data => {
    return request({
        method: 'post',
        url: '/v1_0/authorizations',
        data
    })
}
// 获取验证码
export const sendSms = mobile=>request({
    // url:'/v1_0/sms/codes/'+ mobile
    url:`/v1_0/sms/codes/${mobile}`
})