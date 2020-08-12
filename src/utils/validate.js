/**
 * Created by jiachenpan on 16/11/18.
 */
// 校验手机号是否合法
export function isvalidMobile(str) {
  const valid_map = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
  return valid_map.test(str)
}
// 校验手机号是否合法
export function isvalidPhone(tel) {
  var phone = /([0-9]{3,4}-)?[0-9]{7,8}/;
  return phone.test(tel);
}

// 校验邮箱是否合法
export function isvalidEmail(str) {
  const valid_map = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return valid_map.test(str)
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 校验身份证*/
export function validateIdCard(id) {
  // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
  const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(id)) {
    return { 'status': 0, 'msg': '身份证号码不合规' };
  }
  //区位码校验
  //出生年月日校验  前正则限制起始年份为1900;
  const year = id.substr(6, 4) //身份证年
  const month = id.substr(10, 2) //身份证月
  const date = id.substr(12, 2) //身份证日
  const time = Date.parse(month + '-' + date + '-' + year) //身份证日期时间戳date
  const now_time = Date.parse(new Date()) //当前时间戳
  const dates = (new Date(year, month, 0)).getDate();//身份证当月天数
  if (time > now_time || date > dates) {
    return { 'status': 0, 'msg': '出生日期不合规' }
  }
  //校验码判断
  // eslint-disable-next-line
  const c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); // 系数
  // eslint-disable-next-line
  const b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
  const id_array = id.split("");
  let sum = 0;
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
    return { 'status': 0, 'msg': '身份证校验码不合规' }
  }
  return { 'status': 1, 'msg': '校验通过' }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
