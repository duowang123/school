import request from '@/utils/request'

// 字典
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 根据层级获取专业
export function listByOrganIdAndLevel(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
    method: 'POST',
    data
  })
}

// 根据层级获取专业
export function graduateSave(data) {
  return request({
    url: '/course/stu_graduate/save',
    method: 'POST',
    data
  })
}

// 学生学籍信息，用于毕业申请
export function graduatePageList(data) {
  return request({
    url: '/course/student_roll/graduatePageList',
    method: 'POST',
    data
  })
}

// 批量毕业审批
export function batchApprove(data) {
  return request({
    url: '/course/stu_graduate/batchApprove',
    method: 'POST',
    data
  })
}

// 毕业审批
export function graduateApprove(data) {
  return request({
    url: '/course/stu_graduate/approve',
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
