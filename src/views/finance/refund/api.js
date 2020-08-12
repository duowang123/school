import request from '@/utils/request'

// 获取数据字段
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
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

// 获取退费查询列表
export function getStudentPaybackList(data) {
  return request({
    url: '/course/student_return_money/pageList',
    method: 'post',
    data
  })
}

// 删除
export function deleteStudentPayback(data) {
  return request({
    url: '/course/student_return_money/delete',
    method: 'post',
    data
  })
}

// 新增
export function addStudentPayback(data) {
  return request({
    url: '/course/student_return_money/save',
    method: 'post',
    data
  })
}

// 财务审批分页查询
export function getCreaditSaleApproveList(data) {
  return request({
    url: '/course/student_creadit_sale_approve/cfPageList',
    method: 'post',
    data
  })
}

// 财务审批
export function cfApprove(data) {
  return request({
    url: '/course/student_creadit_sale_approve/cf_approve',
    method: 'post',
    data
  })
}
