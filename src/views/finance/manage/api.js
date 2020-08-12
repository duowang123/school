import request from '@/utils/request'

export function getOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan/',
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

// 获取数据字段
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 获取学生缴费查询列表
export function getStudentPayLogList(data) {
  return request({
    url: '/course/student_pay_log/pageList',
    method: 'post',
    data
  })
}

// 获取学生应缴费查询列表
export function getStudentPayAbleList(data) {
  return request({
    url: '/course/student_payable_order/pageList',
    method: 'post',
    data
  })
}

// 收费统计
export function payLogReport(data) {
  return request({
    url: '/course/student_pay_log/payReport',
    method: 'post',
    data
  })
}

// 欠费统计
export function oweLogReport(data) {
  return request({
    url: '/course/student_pay_log/oweReport',
    method: 'post',
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

// 新增
export function addPayLog(data) {
  return request({
    url: `/course/student_pay_log/save`,
    method: 'POST',
    data
  })
}
