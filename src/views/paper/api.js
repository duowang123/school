import request from '@/utils/request'

// 字典
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 字典数据
export function listByOrganIdAndLevel(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
    method: 'POST',
    data
  })
}

// common
export function commonPageRequest(data, model, action) {
  return request({
    url: '/course/' + model + '/' + action,
    method: 'POST',
    data
  })
}

// 根据学号和身份证查询学生信息查询
export function getQueryStudent(data) {
  return request({
    url: `/course/student_roll/queryStudent`,
    method: 'POST',
    data
  })
}
