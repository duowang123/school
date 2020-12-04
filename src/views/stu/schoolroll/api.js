import request from '@/utils/request'
//获取总院和下面机构列表
export function getRootAndChildOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan/',
    method: 'POST',
    data
  })
}
// 招生计划列表
export function listByOrganId(data) {
  return request({
    url: '/course//admission/list',
    method: 'GET',
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

export function listByOrganIdAndLevel(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
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
// 根据id查找下拉列表
export function getSysDictList(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 根据id查找下拉列表
export function studentCchangeSave(data) {
  return request({
    url: '/course/student_change/save',
    method: 'POST',
    data
  })
}


// 根据id查找下拉列表
export function studentCchangeUpdate(data) {
  return request({
    url: '/course/student_change/update',
    method: 'POST',
    data
  })
}



// 学籍异动审批
export function studentCchangeApprove(data) {
  return request({
    url: '/course/student_change_approve/approve',
    method: 'POST',
    data
  })
}

// 获取学生学籍的财务信息
export function stuFinanceInfo(data) {
  return request({
    url: '/course/student_roll/getStudentCF',
    method: 'POST',
    data
  })
}
// 获取学生课程列表
export function getStuCourseList(id) {
  return request({
    url: `/course/student_course/student_course/${id}`,
    method: 'GET'
  })
}

// 获取学籍信息的异动历史
export function getStuChangeList(data) {
  return request({
    url: `/course/student_roll/studentChangeList`,
    method: 'post',
    data
  })
}

// 获取学籍相关信息
export function getStuInfo(data) {
  return request({
    url: `/course/student_roll/getStudentRoll`,
    method: 'post',
    data
  })
}

// 获取学籍的论文信息

export function getThesisInfo(data) {
  return request({
    url: `/course/paper_write/findStudentWiter`,
    method: 'post',
    data
  })
}

// 获取毕业信息
export function getGrudationInfo(data) {
  return request({
    url: `/course/stu_graduate/getGrudation`,
    method: 'post',
    data
  })
}