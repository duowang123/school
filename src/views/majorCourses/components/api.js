import request from '@/utils/request'

// 获取数据字段
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 获取课程简介
export function getCourseIntroduce(id) {
  return request({
    url: '/course/course_introduce/get/' + id,
    method: 'GET',
  })
}
// 更新课程简介
export function updateCourseIntroduce(data) {
  return request({
    url: '/course/course_introduce/saveAndUpdate',
    method: 'POST',
    data
  })
}
