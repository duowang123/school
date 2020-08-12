import request from '@/utils/request'
//公共接口

// 上传图片
export function uploadPic(data = {}) {
  return request({
    url: `/course/upload/pic`,
    // url: `/course/pc/api/upload/pic`,
    method: 'post',
    data: data
  })
}

// 列出用户菜单
export function menuUserList(params) {
  return request({
    url: '/system/pc/menu/login/list',
    // url: '/system/pc/menu/user/list',
    method: 'post',
    data: params
  })
}

export function enumList(enumName) {
  return request({
    url: `/system/pc/api/sys/enum/list`,
    method: 'post',
    data: { enumName: enumName }
  })
}

// 列出菜单
export function menuListSelect(data = {}) {
  return request({
    url: `/system/pc/menu/role/listSelect`,
    method: 'post',
    data: data
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
// 字典数据
export function listByOrganIdAndLevel(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
    method: 'POST',
    data
  })
}

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
