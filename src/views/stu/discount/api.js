import request from '@/utils/request'

// 学分优惠申请列表
export function creditSaleList(data) {
  return request({
    url: '/course/student_credit_sale/pageList',
    method: 'POST',
    data
  })
}
// 学分优惠新增
export function creaditSave(data) {
  return request({
    url: '/course/student_credit_sale/save',
    method: 'POST',
    data
  })
}

// 免修免考申请
export function studentTest(data) {
  return request({
    url: '/course/student_no_test/pageList',
    method: 'POST',
    data
  })
}

export function studentApplyDelete(data) {
  return request({
    url: '/course/student_credit_sale/delete',
    method: 'POST',
    data
  })
}

export function studentDelete(data) {
  return request({
    url: '/course/student_no_test/delete',
    method: 'POST',
    data
  })
}

//获取总院和下面机构列表
export function getRootAndChildOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan',
    method: 'POST',
    data
  })
}

//获取总院和下面机构列表
export function getNoTestApprove(data) {
  return request({
    url: '/course/student_no_test_approve/pageList',
    method: 'POST',
    data
  })
}

// 根据id查找下拉列表
export function getSysDictList(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}


// 根据课程列表
export function getInfoList(id) {
  return request({
    url: `/course/course_info/list/${id}`,
    method: 'GET',
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

// 免修免考申请新增
export function studentNoTest(data) {
  return request({
    url: `/course/student_no_test/save`,
    method: 'POST',
    data
  })
}

// 免修免考异动审批
export function noTestApprove(data) {
  return request({
    url: '/course/student_no_test_approve/approve',
    method: 'POST',
    data
  })
}

// 根据课程列表
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 财务审批
export function cfPageList(data) {
  return request({
    url: '/course/student_creadit_sale_approve/pageList',
    method: 'POST',
    data
  })
}

// 财务审批
export function cfApprove(data) {
  return request({
    url: '/course/student_creadit_sale_approve/organ_approve',
    method: 'POST',
    data
  })
}


// 财务审批
export function approve(data) {
  return request({
    url: '/course/student_no_test_approve/approve',
    method: 'POST',
    data
  })
}


// 学分优惠申请
export function studentCreditSaleSave(data) {
  return request({
    url: '/course/student_credit_sale/save',
    method: 'POST',
    data
  })
}
