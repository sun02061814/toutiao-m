/**
 * 搜索模块请求
 */
import request from '@/utils/request'

export const suggestAPI = params=>request({
    url:'/v1_0/suggestion',
    params
})

export const getSearchResults = params=>{
    return request({
        url:'/v1_0/search',
        params
    })
}