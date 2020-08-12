import request from '@/utils/request'

//获取总院和下面机构列表
export function getRootAndChildOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan/',
    method: 'POST',
    data
  })
}
