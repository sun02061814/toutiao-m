/**
 * 用户模块请求
 */
import request from '@/utils/request'
// import store from '@/store'
// 获取用户资料
export const getUserInfo = ()=>request({
    url:'/v1_0/user',
    // headers:{
    //     Authorization:'Bearer '+ store.state.user.token
    // }
})

// 获取用户频道列表
export const getPinDao = ()=> request({
    url:'/v1_0/user/channels'
})

// 关注用户
export const followingAPI = target=>request({
    method:'POST',
    url:'/v1_0/user/followings',
    data:{
        target
    }
})

// 取消关注用户
export const refollowingAPI = target=>request({
    method:'DELETE',
    url:`/v1_0/user/followings/${target}`
})