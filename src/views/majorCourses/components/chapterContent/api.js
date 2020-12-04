import request from '@/utils/request'

// 课程目录菜单
export function getCourseMenuTree(courseId) {
  return request({
    url: '/course/menu/tree/' + courseId,
    method: 'GET',
  })
}

// 新增课程目录
export function addCourseMenu(data) {
  return request({
    url: '/course/menu/save',
    method: 'POST',
    data
  })
}
// 新修改课程目录
export function updateCourseMenu(data) {
  return request({
    url: '/course/menu/update',
    method: 'POST',
    data
  })
}

// 新增课程目录
export function deleteCourseMenu(data) {
  return request({
    url: '/course/menu/delete',
    method: 'POST',
    data
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

// 修改章节内容
export function updateChapterCont(data) {
  return request({
    url: '/course/chapter/saveAndUpdate',
    method: 'POST',
    data
  })
}

// 搜索视频列表
export function searchVideo(data) {
  return request({
    url: '/course/tencent/search',
    method: 'POST',
    data
  })
}

export function getDoc(data) {
  return request({
    url: '/course/chapter/getDoc',
    method: 'POST',
    data
  })
}

export function getVideo(data) {
  return request({
    url: '/course/chapter/getVideo',
    method: 'POST',
    data
  })
}

export function getDiscusses(data) {
  return request({
    url: '/course/chapter/getDiscusses',
    method: 'POST',
    data
  })
}
