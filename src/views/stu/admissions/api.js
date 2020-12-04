import request from '@/utils/request'

// 获取数据字段
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 获取所有机构
export function getOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan',
    method: 'POST',
    data
  })
}

// 总院下的机构列表
export function getOrganChild(data) {
  return request({
    url: '/system/sys_organ/getOrganChild',
    method: 'post',
    data
  })
}

// 获取学生报名清单
export function studentSignList(data) {
  return request({
    url: '/course/studentSign/pageList',
    method: 'POST',
    data
  })
}

// 获取学生报名清单
export function exportExcelByStudentSign(data) {
  return request({
    url: '/course/studentSign/enter/export',
    method: 'POST',
    data
  })
}

// 删除学生报名清单
export function deleteStudentSign(data) {
  return request({
    url: '/course/studentSign/delete',
    method: 'POST',
    data
  })
}

// 获取学生录取清单
export function getStudentList(data) {
  return request({
    url: '/course/student/pageList',
    method: 'POST',
    data
  })
}

export function importStudentFile(data) {
  return request({
    url: 'course/student/api/enter/import',
    method: 'POST',
    data
  })
}

// 删除录取清单
export function studentDelete(data) {
  return request({
    url: '/course/student/delete',
    method: 'POST',
    data
  })
}

// 重置学生密码
export function resetStuPWD(data) {
  return request({
    url: '/course/student/api/password/reset',
    method: 'POST',
    data
  })
}

// 新增录入学生
export function studentSave(data) {
  return request({
    url: '/course/studentSign/save',
    method: 'POST',
    data
  })
}
// 报考信息
export function stundentSignImport(data) {
  return request({
    url: '/course/studentSign/api/enter/import',
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

// 报考信息修改
export function stundentUpdate(data) {
  return request({
    url: '/course/studentSign/update',
    method: 'POST',
    data
  })
}

// 新增录入学生
export function addStundentSave(data) {
  return request({
    url: '/course/student/save',
    method: 'POST',
    data
  })
}

// 新增录入学生
export function addStudentUpdate(data) {
  return request({
    url: '/course/student/update',
    method: 'POST',
    data
  })
}
// 新增录入学生
export function studentApprove(data) {
  return request({
    url: '/course/student/approve',
    method: 'POST',
    data
  })
}
// 新增录入学生
export function uploadDoc(data) {
  return request({
    url: '/course/upload/doc',
    method: 'POST',
    data
  })
}

// 获取学生报名清单
export function studentAutoSignList(data) {
  return request({
    url: '/course/studentSign/online/pageList',
    method: 'POST',
    data
  })
}

// 线上报考信息修改
export function stundentOnlineUpdate(data) {
  return request({
    url: '/course/studentSign/online/update',
    method: 'POST',
    data
  })
}
