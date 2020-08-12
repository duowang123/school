import request from '@/utils/request'

// 获取主题讨论列表
export function getTopicDiscussList(data) {
  return request({
    url: '/course/topic_discusses/pageList',
    method: 'POST',
    data
  })
}

// 获取主题的评论
export function getCommentList(data) {
  return request({
    url: '/course/topic_comment/pageList',
    method: 'POST',
    data
  })
}

// 新增评论
export function addComment(data) {
  return request({
    url: '/course/topic_comment/save',
    method: 'POST',
    data
  })
}
