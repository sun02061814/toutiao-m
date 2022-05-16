/**
 * 频道请求模块
 */
import request from '@/utils/request'
export const getChannelAll = ()=>request({
    url:'/v1_0/channels'
})

export const putChannels = data=>request({
    method:'PATCH',
    url:'/v1_0/user/channels',
    data
})

export const delChannels = id=>request({
    method:'DELETE',
    // url:'/v1_0/user/channels/'+id,
    url:`/v1_0/user/channels/${id}`
})