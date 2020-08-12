import request from '@/utils/request'

// 获取系统消息列表
export function sysMessage(data) {
  return request({
    url: '/system/sys_message/managerPageList',
    method: 'POST',
    data
  })
}


// 删除系统消息
export function sysDelete(data) {
  return request({
    url: '/system/sys_message/delete',
    method: 'POST',
    data
  })
}

// 系统启用
export function sysOpen(data) {
  return request({
    url: '/system/sys_message/open',
    method: 'POST',
    data
  })
}

// 系统禁用
export function sysClose(data) {
  return request({
    url: '/system/sys_message/close',
    method: 'POST',
    data
  })
}


// 系统新增
export function sysSave(data) {
  return request({
    url: '/system/sys_message/save',
    method: 'POST',
    data
  })
}

// 系统修改
export function sysUpdate(data) {
  return request({
    url: '/system/sys_message/update',
    method: 'POST',
    data
  })
}



