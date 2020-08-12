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

// 仅获取剩余应学时长
export function getLearnTime(data) {
  return request({
    url: '/course/study_log/getLearnTime',
    method: 'POST',
    data
  })
}

// 更新剩余应学时长
export function updateLearnTime(data) {
  return request({
    url: '/course/study_log/study',
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
