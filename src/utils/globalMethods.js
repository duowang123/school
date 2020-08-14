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
  console.log('text', text)
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