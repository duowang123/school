import request from '@/utils/request'

// 获取数据字段
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
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

export function getOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan/',
    method: 'POST',
    data
  })
}

// 总院招生计划列表
export function admissionList(data) {
  return request({
    url: '/course/admission/pageList',
    method: 'POST',
    data
  })
}

// 新增总院招生计划
export function addPlan(data) {
  return request({
    url: '/course/admission/save',
    method: 'POST',
    data
  })
}
// 更新总院招生计划
export function AddmissionUpdate(data) {
  return request({
    url: '/course/admission/update',
    method: 'POST',
    data
  })
}

// 更新总院招生计划
export function updatePlan(data) {
  return request({
    url: '/course/qual/update',
    method: 'POST',
    data
  })
}

// 更新总院招生计划
export function deletePlan(data) {
  return request({
    url: '/course/admission/delete',
    method: 'POST',
    data
  })
}

// 分院招生资格列表
export function organQual(data) {
  return request({
    url: '/course/qual/pageList',
    method: 'POST',
    data
  })
}

// 分院招生资格列表
export function organAddQual(data) {
  return request({
    url: '/course/qual/save',
    method: 'POST',
    data
  })
}
