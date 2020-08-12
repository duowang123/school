import axios from 'axios'
import { getToken } from '@/utils/auth'
import Vue from 'vue'

export default {
  methods: {
    // 单个图片下载
    download(params, url, method, name, type) {
      axios({
        url: `${process.env.BASE_API}${url}`,
        method,
        data: params,
        responseType: 'blob',
        headers: { token: getToken() }
      }).then(res => {
        const reander = new FileReader()
        reander.readAsDataURL(res.data)
        reander.onload = e => {
          const a = document.createElement('a')
          a.download = `${name}.${type}`
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    }
  }
}
