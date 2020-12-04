import request from '@/utils/request'
// 总院信息
export function getManagerOrgan() {
  return request({
    url: '/system/sys_organ/getManagerOrgan',
    method: 'post'
  })
}

// 根据机构获取角色列表
export function getRoleFormOrgan(data) {
  return request({
    url: '/system/pc/sys/role/list4Organ',
    method: 'post',
    data
  })
}

// 获取角色的菜单列表
export function getMenuFormRole(data) {
  return request({
    url: '/system/pc/menu/role/listSelect',
    method: 'post',
    data
  })
}

// 保存角色的菜单权限
export function saveMenuToRole(data) {
  return request({
    url: '/system/pc/menu/role/save',
    method: 'post',
    data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/pc/sys/role/save',
    method: 'post',
    data
  })
}

// 更新角色名称
export function updateRoleName(data) {
  return request({
    url: '/system/pc/sys/role/update ',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: '/system/pc/sys/role/delete',
    method: 'post',
    data
  })
}

// 获取所有机构
export function getOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan',
    method: 'POST',
    data
  })
}
// 获取总院下面的机构名称，不包含总院,包含学校和教学点
export function getOrganChild(data) {
  return request({
    url: '/system/sys_organ/getOrganChild',
    method: 'post',
    data
  })
}

// 获取总院下面的机构列表
export function getUserList(data) {
  return request({
    url: '/system/pc/sys/user/pageList',
    method: 'post',
    data
  })
}

// 新增机构
export function addOrgan(data) {
  return request({
    url: '/system/sys_organ/save',
    method: 'post',
    data
  })
}

// 更新机构
export function updateOrgan(data) {
  return request({
    url: '/system/sys_organ/update',
    method: 'post',
    data
  })
}

// 更新机构
export function deleteOrgan(data) {
  return request({
    url: '/system/sys_organ/delete',
    method: 'post',
    data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/pc/sys/user/save',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/system/pc/sys/user/update',
    method: 'post',
    data
  })
}

// 重置用户密码
export function resetUserPwd(data) {
  return request({
    url: '/system/pc/sys/user/reset',
    method: 'post',
    data
  })
}

// 禁用用户
export function resetUserDisable(data) {
  return request({
    url: '/system/pc/sys/user/close',
    method: 'post',
    data
  })
}

// 启用用户
export function resetUserEnable(data) {
  return request({
    url: '/system/pc/sys/user/open',
    method: 'post',
    data
  })
}

// 删除用户
export function resetUserDelete(data) {
  return request({
    url: '/system/pc/sys/user/delete',
    method: 'post',
    data
  })
}

// 机构管理--机构列表
export function organPageList(data) {
  return request({
    url: '/system/sys_organ/pageList',
    method: 'post',
    data
  })
}

// 获取学生招生计划
export function getAdmitList(data) {
  return request({
    url: '/course/studentSign/pageList',
    method: 'POST',
    data
  })
}

// 学籍信息列表
export function studentRollList(data) {
  return request({
    url: '/course/student_roll/pageList',
    method: 'POST',
    data
  })
}
// 学籍异动列表
export function studentChangeList(data) {
  return request({
    url: '/course/student_change/pageList',
    method: 'POST',
    data
  })
}
// 学籍管理获取属性
export function studentRollAttribute(data) {
  return request({
    url: '/course/student_roll/view',
    method: 'POST',
    data
  })
}
// 学籍异动审批列表
export function verifyList(data) {
  return request({
    url: '/course/student_change_approve/pageList',
    method: 'POST',
    data
  })
}
// 新增学籍异动

export function addStudentChange(data) {
  return request({
    url: '/course/student_change/save',
    method: 'POST',
    data
  })
}

// 修改学籍异动
export function editStudentChange(data) {
  return request({
    url: '/course/student_change/update',
    method: 'POST',
    data
  })
}
// 删除学籍异动

export function deleteStudentChange(data) {
  return request({
    url: '/course/student_change/delete',
    method: 'POST',
    data
  })
}
// 学分优惠申请列表
export function creditSaleList(data) {
  return request({
    url: '/course/student_credit_sale/pageList',
    method: 'POST',
    data
  })
}

// 学分优惠申请列表
export function deleteCreditSale(data) {
  return request({
    url: '/course/student_credit_sale/delete',
    method: 'POST',
    data
  })
}

// 学籍异动审批

export function changeApprove(data) {
  return request({
    url: '/course/student_change_approve/approve',
    method: 'POST',
    data
  })
}

// 免修免考申请列表
export function noTestList(data) {
  return request({
    url: '/course/student_no_test/pageList',
    method: 'POST',
    data
  })
}
// 删除免修免考申请
export function deleteNoTest(data) {
  return request({
    url: '/course/student_no_test/delete',
    method: 'POST',
    data
  })
}
// 新增免修免考申请
export function addNoTest(data) {
  return request({
    url: '/course/student_no_test/save',
    method: 'POST',
    data
  })
}
// 修改免修免考申请

export function editNoTest(data) {
  return request({
    url: '/course/student_no_test/update',
    method: 'POST',
    data
  })
}
// 免修免考异动审批

export function noTestApprove(data) {
  return request({
    url: '/course/student_no_test_approve/approve',
    method: 'POST',
    data
  })
}

// 学生录取信息导出
export function studentInfoRoll(data) {
  return request({
    url: '/course/student_roll/enter/export',
    method: 'POST',
    data
  })
}
// 学生照片信息列表
export function studentImgInfo(data) {
  return request({
    url: '/course/student_picture/pageList',
    method: 'POST',
    data
  })
}
// 单张图片下载
export function downloadImage(data) {
  return request({
    url: '/course/student_picture/downloadImage',
    method: 'POST',
    data
  })
}
// 图片批量导出

export function batchDownloadImage(data) {
  return request({
    url: '/course/student_picture/zip/download',
    method: 'POST',
    data
  })
}

// 根据id查找下拉列表
export function getSysDictList(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

export function getSyOrganChild(data) {
  return request({
    url: '/system/sys_organ/getOrganChild',
    method: 'POST',
    data
  })
}

export function getAuthList(data) {
  return request({
    url: '/system/sys_organ/authList',
    method: 'POST',
    data
  })
}

export function getAuth(data) {
  return request({
    url: '/system/sys_organ/auth',
    method: 'POST',
    data
  })
}


export function getTeachAuthList(data) {
  return request({
    url: '/system/sys_organ/teachAuthList',
    method: 'POST',
    data
  })
}

export function getTeacherOrgans(data) {
  return request({
    url: '/system/sys_organ/getTeacherOrgans',
    method: 'POST',
    data
  })
}

export function getSchoolOrgans(data) {
  return request({
    url: '/system/sys_organ/getSchoolOrgans',
    method: 'POST',
    data
  })
}

// 直接替换 字段 0014 0024 的数据
export function getYearAndSemester() {
  return request({
    url: '/course/teaching_plan/api/semester_drop',
    method: 'get'
  })
}
