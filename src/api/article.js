/**
 * 文章请求模块
 */
import request from '@/utils/request'
export const getArticles = params=>{
    return request({
        url:'/v1_0/articles',
        params
    })
}
export const getArticlesAPI = id=>{
    return request({
        url:`/v1_0/articles/${id}`
    })
}

// 文章收藏
export const collextAPI = articleId=>request({
    method:'POST',
    url:'/v1_0/article/collections',
    data:{
        target:articleId
    }
})

// 取消文章收藏
export const recollextAPI = target=>request({
    method:'DELETE',
    url:`/v1_0/article/collections/${target}`
})

// 评论点赞
export const likingAPI = target=>request({
    method:'POST',
    url:'/v1_0/comment/likings',
    data:{target}
})

// 取消评论点赞
export const relikingAPI = target=>request({
    method:'DELETE',
    url:`/v1_0/comment/likings/${target}`
})

// 对文章或者评论进行评论
export const postCommentAPI = data=>request({
    method:'POST',
    url:'/v1_0/comments',
    data
})