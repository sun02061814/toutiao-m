import request from '@/utils/request'
export const getArticles = params=>{
    return request({
        url:'/v1_0/articles',
        params
    })
}