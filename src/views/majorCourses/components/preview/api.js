import request from '@/utils/request'

// 获取课程简介
export function getCourseIntroduce(id) {
  return request({
    url: '/course/course_introduce/get/' + id,
    method: 'GET',
  })
}

// 课程目录菜单
export function getCourseMenuTree(courseId) {
  return request({
    url: '/course/menu/tree/' + courseId,
    method: 'GET'
  })
}

// 获取章节内容
export function getChapterCont(data) {
  return request({
    url: '/course/chapter/getInfo',
    method: 'POST',
    data
  })
}

// 获取AppId
export function getAppIdForVideo() {
  return request({
    url: '/course/tencent/appId',
    method: 'get',
  })
}
