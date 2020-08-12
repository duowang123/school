import request from '@/utils/request'

// 根据机构查询专业列表信息
export function del(data) {
  return request({
    url: '/system/sys_dict/delete',
    method: 'POST',
    data
  })
}

export function add(data) {
  return request({
    url: '/system/sys_dict/save',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/system/sys_dict/update',
    method: 'post',
    data
  })
}
