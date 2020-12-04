import dayjs from 'dayjs'

export default {
  str2ymd(val) {
    if (!val) return '--'
    return dayjs(val).format('YYYY-MM-DD')
  },
  str2mdhm(val) {
    if (!val) return '--'
    return dayjs(val).format('MM/DD HH:mm')
  },
  str2ymdhm(val) {
    if (!val) return '--'
    return dayjs(val).format('YYYY-MM-DD HH:mm')
  }
}
