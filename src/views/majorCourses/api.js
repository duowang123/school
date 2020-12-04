import request from '@/utils/request'

// 获取数据字段
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 获取所有机构
export function getOrgan(data) {
  return request({
    url: '/system/sys_organ/getRootAndChildOrgan/',
    method: 'POST',
    data
  })
}

// 总院下的机构列表
export function organPageList(data) {
  return request({
    url: '/system/sys_organ/getOrganChild',
    method: 'post',
    data
  })
}

// 学院专业信息列表
export function specialtyList(data) {
  return request({
    url: '/course/specialty/pageList',
    method: 'POST',
    data
  })
}

// 获取专业下拉框数据
export function specialtyOptions(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
    method: 'POST',
    data
  })
}

// 教学计划可选课程列表
export function courseListByTeachPlan(data) {
  return request({
    url: '/course/course_info/list/teach_plan',
    method: 'POST',
    data
  })
}

// 新增专业
export function addSpecialty(data) {
  return request({
    url: '/course/specialty/save',
    method: 'POST',
    data
  })
}

export function updateSpecialty(data) {
  return request({
    url: '/course/specialty/update',
    method: 'POST',
    data
  })
}

// 删除专业
export function deleteSpecialty(data) {
  return request({
    url: '/course/specialty/delete',
    method: 'POST',
    data
  })
}

// 学院列表
export function schoolList(organId) {
  return request({
    url: '/course/college/list/' + organId,
    method: 'Get'
  })
}

// 新增学院列表
export function addSchool(data) {
  return request({
    url: '/course/college/save',
    method: 'POST',
    data
  })
}
// 修改学院列表
export function updateSchool(data) {
  return request({
    url: '/course/college/update',
    method: 'POST',
    data
  })
}

// 删除学院列表
export function deleteSchool(data) {
  return request({
    url: '/course/college/delete',
    method: 'POST',
    data
  })
}

// 获取课程列表
export function getCoursePage(data) {
  return request({
    url: '/course/course_info/pageList',
    method: 'POST',
    data
  })
}

// 可授权课程列表
export function getAuthList(data) {
  return request({
    url: '/course/course_info/authList',
    method: 'POST',
    data
  })
}

// 获取机构绑定的课程列表
export function getCourseByOrganId(id) {
  return request({
    url: '/course/course_info/selected/' + id,
    method: 'GET'
  })
}

// 获取机构绑定的课程列表
export function bindCourseToOrgan(data) {
  return request({
    url: '/course/rel/save',
    method: 'POST',
    data
  })
}

// 删除课程
export function deleteCourse(data) {
  return request({
    url: '/course/course_info/delete',
    method: 'POST',
    data
  })
}

// 新增课程信息
export function addCourse(data) {
  return request({
    url: '/course/course_info/save',
    method: 'POST',
    data
  })
}

// 更新课程信息
export function updateCourse(data) {
  return request({
    url: '/course/course_info/update',
    method: 'POST',
    data
  })
}

// 获取教学计划列表
export function getTeachingPlanList(data) {
  return request({
    url: '/course/teaching_plan/pageList',
    method: 'POST',
    data
  })
}

// 新增教学计划
export function addTeachingPlan(data) {
  return request({
    url: '/course/teaching_plan/save',
    method: 'POST',
    data
  })
}

// 修改教学计划
export function updateTeachingPlan(data) {
  return request({
    url: '/course/teaching_plan/update',
    method: 'POST',
    data
  })
}

// 删除教学计划
export function deleteTeachingPlan(data) {
  return request({
    url: '/course/teaching_plan/delete',
    method: 'POST',
    data
  })
}

// 根据教学计划获取课程列表
export function getCourseByTeachingPlan(id) {
  return request({
    url: '/course/teaching_plan/getCourseInfoList/' + id,
    method: 'get'
  })
}

// 根据课程清单
export function getCourseListByTeachingPlan(id) {
  return request({
    url: '/course/teaching_plan/get/' + id,
    method: 'get'
  })
}

// 获取学期信息
export function getSchoolDetail(data) {
  return request({
    url: '/course/teaching_plan/semester_info',
    method: 'post',
    data
  })
}

// 修改学期信息
export function updateSchoolDetail(data) {
  return request({
    url: '/course/teaching_plan/semester_update',
    method: 'post',
    data
  })
}

// 修改学期信息
export function addSchoolDetail(data) {
  return request({
    url: '/course/teaching_plan/semester_save',
    method: 'post',
    data
  })
}

// 删除学期信息
export function delSchoolDetail(data) {
  return request({
    url: '/course/teaching_plan/semester_delete',
    method: 'post',
    data
  })
}

// 获取课程占比
export function getCourseRatio() {
  return request({
    url: '/course/course_info/achieve/info',
    method: 'get'
  })
}

// 修改课程占比
export function updateCourseRatio(data) {
  return request({
    url: '/course/course_info/achieve/update',
    method: 'POST',
    data
  })
}

// 总院、选课总览
export function courseSelectOverview(data) {
  return request({
    url: '/course/student_course/select/overview',
    method: 'POST',
    data
  })
}

// 总院查看 学生选课信息
export function courseSelectcourseInfo(data) {
  return request({
    url: '/course/student_course/select/course',
    method: 'POST',
    data
  })
}

//总院查看 学生课程平时成绩
export function studentDailyPerf(data) {
  return request({
    url: '/course/student_course/daily_perf',
    method: 'POST',
    data
  })
}

export function getSpecialtyByOrganId(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
    method: 'POST',
    data
  })
}

export function getYearAndSemester(data) {
  return request({
    url: '/course/teaching_plan/api/semester_drop',
    method: 'get'
  })
}

