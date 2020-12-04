// export const BASE_API = 'http:///203.195.152.77:6080/admin/apis'
// const BASE = process.env.NODE_ENV === 'production' ? window.location.origin : 'https://www.slycjy.com'
const BASE = process.env.NODE_ENV === 'production' ? window.location.origin : 'https://test.slycjy.com'

export const BASE_API = `${BASE}/admin/apis/`

export const STATIC_BASE = `${BASE}/admin`

export const COLORS = {
  red: '#CF0000',
  greed: '#67C23A'
}
