/**
 * 评论请求模块
 */
import request from '@/utils/request'

// 获取评论
export const getCommentList = params=>request({
    method:'GET',
    url:'/v1_0/comments',
    params
})