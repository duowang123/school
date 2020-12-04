import request from '@/utils/request'

export function login(mobile, password, clientId, ip) {
  const data = {
    mobile: mobile,
    password: password,
    clientId: clientId,
    ip: ip
  }
  // 密码登录接口
  return request({
    url: '/system/pc/api/sys_user/login',
    // url: '/user/pc/api/user/login/password',
    method: 'post',
    data
  })
}

// 首次登录修改密码
export function firstLogin(data) {
  return request({
    url: '/system/pc/sys/user/update/password',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePass(data) {
  return request({
    url: '/system/pc/sys/user/update/passwordForLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
