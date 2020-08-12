import request from '@/utils/request'

// 获取数据字段
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

// 总院下的机构列表
export function getOrganChild(data) {
  return request({
    url: '/system/sys_organ/getOrganChild',
    method: 'post',
    data
  })
}

// 获取学分收费标准列表
export function getCreditStandardList(data) {
  return request({
    url: '/course/credit_charg_standard/pageList',
    method: 'post',
    data
  })
}

// 删除学分收费标准列表
export function deleteCreditStandard(data) {
  return request({
    url: '/course/credit_charg_standard/delete',
    method: 'post',
    data
  })
}

// 新增学分收费标准
export function addCreditStandard(data) {
  return request({
    url: '/course/credit_charg_standard/save',
    method: 'post',
    data
  })
}

// 修改学分收费标准
export function updateCreditStandard(data) {
  return request({
    url: '/course/credit_charg_standard/update',
    method: 'post',
    data
  })
}

// 获取学分收费标准列表
export function getMajorStandardList(data) {
  return request({
    url: '/course/professional_standard/pageList',
    method: 'post',
    data
  })
}

// 删除学分收费标准列表
export function deleteMajorStandard(data) {
  return request({
    url: '/course/professional_standard/delete',
    method: 'post',
    data
  })
}

// 新增学分收费标准
export function addMajorStandard(data) {
  return request({
    url: '/course/professional_standard/save',
    method: 'post',
    data
  })
}

// 修改学分收费标准
export function updateMajorStandard(data) {
  return request({
    url: '/course/professional_standard/update',
    method: 'post',
    data
  })
}

// 获取属性信息
export function viewMajorStandard(data) {
  return request({
    url: '/course/professional_standard/view',
    method: 'post',
    data
  })
}

