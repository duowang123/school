import request from '@/utils/request'

export function getOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan/',
    method: 'POST',
    data
  })
}
