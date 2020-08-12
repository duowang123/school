// export const BASE_API = 'http:///203.195.152.77:6080/admin/apis'
const BASE = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://106.52.50.102'

export const BASE_API = `${BASE}/admin/apis`

export const STATIC_BASE = `${BASE}/admin`
