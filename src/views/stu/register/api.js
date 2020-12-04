import request from '@/utils/request'
// 注册前异动分页查询
export function registerChange(data) {
  return request({
    url: '/course/register_change/pageList',
    method: 'POST',
    data
  })
}


// 注册前异动分页查询
export function registerChangeSave(data) {
  return request({
    url: '/course/register_change/save',
    method: 'POST',
    data
  })
}
export function registerChangeUpdate(data) {
  return request({
    url: '/course/register_change/update',
    method: 'POST',
    data
  })
}

export function registerChangeDelete(data) {
  return request({
    url: '/course/register_change/delete',
    method: 'POST',
    data
  })
}

export function registerChangeApprove(data) {
  return request({
    url: '/course/register_change/approve',
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