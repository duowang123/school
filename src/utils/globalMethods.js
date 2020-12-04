import { cloneDeep as l_cloneDeep } from 'loadsh'
import { Message } from 'element-ui'
import { BASE_API, COLORS } from '@/constant/global'
import { getToken } from '@/utils/auth'

/**
 * 获取对象属性
 * @param obj (Object) 目标对象
 * @param path {String | Array} 属性路径
 * @param defaultResult 默认返回结果
 * @returns {*} 对象属性不存在时， 返回undefined
 */
export function getValue(obj, path, defaultResult) {
  if (!obj) {
    return defaultResult
  }
  const pathArr = Array.isArray(path) ? path : (path + '').split('.')
  return getValueByKeyArray(obj, pathArr) || defaultResult
}

// 通过一个key的数组来获取对象里的值
function getValueByKeyArray(obj, arr) {
  return arr.reduce((prev, next) => {
    return (prev === undefined) || (prev === null) ? prev : prev[next]
  }, obj)
}

export function flattenObj(arr, path = 'children') {
  const res = []
  if (!arr || !Array.isArray(arr)) {
    return res
  }
  arr.forEach(e => {
    res.push(e)
    if (e && e[path]) {
      res.push(...flattenObj(e[path]))
    }
  })
  return res
}
// 提取富文本有效数字
export function getSimpleText(html) {
  const re1 = new RegExp('<.+?>', 'g')
  const text = html.replace(re1, '')
  if (text.length > 10) {
    return `${text.substring(0, 9)}...`
  } else {
    return text
  }
}
// 生成id
export function gentID(length) {
  return Number(
    Math.random().toString().substr(3, length) + Date.now()
  ).toString(36)
}

// 数组对象去重复
export function ObjectDeDuplication(arr, key = 'id') {
  let obj = {}//有助于增加遍历效率
  arr = arr.reduce((cur, next) => {
    obj[next[key]] ? "" : obj[next[key]] = true && cur.push(next)
    return cur;
  }, [])
  return arr
}

export function cloneDeep(obj) {
  return l_cloneDeep(obj)
}

export function isMoney(val) {
  return /^[0-9]+\.[0-9]{2}$/.test(val)
}

export function picTypeCheck(file, size = 2) {
  const isPic = /.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file.type);
  const isLt2M = file.size / 1024 / 1024 < size;

  if (!isPic) {
    Message.error('上传头像图片只能是 JPG 格式!');
  }
  if (!isLt2M) {
    Message.error('上传头像图片大小不能超过 2MB!');
  }
  return isPic && isLt2M;
}

export function docTypeCheck(file, size = 10) {
  const wordList = ['doc', 'docx']
  const isWord = !!wordList.filter(type => file.name.includes(type)).length;
  if (!isWord) {
    Message.error('只能上传Word文档!');
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  return isWord && isLt10M;
}

export function getUrl(url) {
  return `${BASE_API}/course${url}?token=${getToken()}`
}

export function getColor(type) {
  return COLORS[type]
}

/**
 * 剔除机构中的全部选项
 * @param organList
 * @returns {*[]}
 */
export function organFilter(organList) {
  return organList.filter(e => e.label !== '全部')
}
