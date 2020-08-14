import request from '@/utils/request'

// 题库管理分页查询
export function examQuestion(data) {
  return request({
    url: '/course/exam_question/pageList',
    method: 'POST',
    data
  })
}

// 题库编辑
export function examEdit(id) {
  return request({
    url: `/course/exam_question/get/${id}`,
    method: 'GET',
  })
}

// 根据学号和身份证查询学生信息查询
export function getQueryStudent(data) {
  return request({
    url: `/course/student_roll/queryStudent`,
    method: 'POST',
    data
  })
}

// 题库新增
export function examQuestionSave(data) {
  return request({
    url: '/course/exam_question/save',
    method: 'POST',
    data
  })
}

// 字典
export function listByCode(data) {
  return request({
    url: '/system/sys_dict/listByCode',
    method: 'POST',
    data
  })
}

// 根据专业id,课程下拉列表
export function specialtySubject(specialtyId) {
  return request({
    url: `/course/course_info/courseId/${specialtyId}`,
    method: 'GET',
  })
}

// 根据机构查询专业列表信息
export function listByOrganIdAndLevel(data) {
  return request({
    url: '/course/specialty/listByOrganIdAndLevel',
    method: 'POST',
    data
  })
}

// 考点列表
export function getTestCenterList(data) {
  return request({
    url: '/course/test_center/pageList',
    method: 'POST',
    data
  })
}

// 考点删除
export function testCenterDelete(data) {
  return request({
    url: '/course/test_center/delete',
    method: 'POST',
    data
  })
}


// 考点列表
export function getExamRoomList(data) {
  return request({
    url: '/course/exam_room/pageList',
    method: 'POST',
    data
  })
}

// 考点删除
export function examRoomDelete(data) {
  return request({
    url: '/course/exam_room/delete',
    method: 'POST',
    data
  })
}

// /exam_room/listByOrganId
export function examRoomListByOrganId(data) {
  return request({
    url: '/course/exam_room/listByOrganId',
    method: 'POST',
    data
  })
}

// 获取启用的考点列表 /test_center/getOpenList
export function getOpenTestCenterList(data) {
  return request({
    url: '/course/test_center/getOpenList',
    method: 'POST',
    data
  })
}
// 根据机构查询专业列表信息
export function examQuestionDelete(data) {
  return request({
    url: '/course/exam_question/delete',
    method: 'POST',
    data
  })
}

// /exam_room/save
export function saveExamRoom(data) {
  return request({
    url: '/course/exam_room/save',
    method: 'post',
    data
  })
}

export function updateExamRoom(data) {
  return request({
    url: '/course/exam_room/update',
    method: 'post',
    data
  })
}

// 考试计划
export function getExamPlanList(data) {
  return request({
    url: '/course/exam_plan/pageList',
    method: 'post',
    data
  })
}

// 考试计划新增
export function addExamPlan(data) {
  return request({
    url: '/course/exam_plan/save',
    method: 'post',
    data
  })
}

export function updateExamPlan(data) {
  return request({
    url: '/course/exam_plan/update',
    method: 'post',
    data
  })
}

export function deleteExamPlan(data) {
  return request({
    url: '/course/exam_plan/delete',
    method: 'post',
    data
  })
}

export function examPaperListByOrganId(id) {
  return request({
    url: '/course/exam_paper/list/' + id,
    method: 'GET'
  })
}

// stu_test_score/pageList 考试成绩查询
export function getTestScoreList(data) {
  return request({
    url: '/course/stu_test_score/pageList',
    method: 'post',
    data
  })
}

// stu_test_score/pageList 新增考试成绩查询
export function addStudentTestScore(data) {
  return request({
    url: '/course/stu_test_score/save',
    method: 'post',
    data
  })
}

// stu_test_score/pageList 编辑考试成绩查询
export function updateStudentTestScore(data) {
  return request({
    url: '/course/stu_test_score/update',
    method: 'post',
    data
  })
}

// stu_test_score/pageList 删除考试成绩查询
export function deleteStudentTestScore(data) {
  return request({
    url: '/course/stu_test_score/delete',
    method: 'post',
    data
  })
}

// exam_plan/listByOrganId 根据机构查询考试计划
export function listByOrganId(data) {
  return request({
    url: '/course/exam_plan/listByOrganId',
    method: 'post',
    data
  })
}

// /exam_plan_info/list
export function examPlanInfoList(data) {
  return request({
    url: '/course/exam_plan_info/list',
    method: 'post',
    data
  })
}

// stu_re_test/pageList
// 分页查询
export function reTestPageList(data) {
  return request({
    url: '/course/stu_re_test/pageList',
    method: 'post',
    data
  })
}
// 试卷管理分页查询
export function examPaperInfoList(data) {
  return request({
    url: '/course/exam_paper/pageList',
    method: 'post',
    data
  })
}

// stu_re_test_approve/pageList
// 分页查询
export function reTestApprovePageList(data) {
  return request({
    url: '/course/stu_re_test_approve/pageList',
    method: 'post',
    data
  })
}

// /stu_re_test_approve/approve
// 审批
export function reTestApprove(data) {
  return request({
    url: '/course/stu_re_test_approve/approve',
    method: 'post',
    data
  })
}

// 学生所有的课程信息
export function getStudentCourses(id) {
  return request({
    url: `/course/student_course/student_course/${id}`,
    method: 'GET'
  })
}

// stu_stop_test/pageList
// 分页查询
export function stopTestPageList(data) {
  return request({
    url: '/course/stu_stop_test/pageList',
    method: 'post',
    data
  })
}

// stu_stop_test_approve/pageList
// 分页查询
export function stopTestApprovePageList(data) {
  return request({
    url: '/course/stu_stop_test_approve/pageList',
    method: 'post',
    data
  })
}

// /stu_stop_test_approve/approve
// 审批
export function stopTestApprove(data) {
  return request({
    url: '/course/stu_stop_test_approve/approve',
    method: 'post',
    data
  })
}

// /exam_inspector/pageList
// 巡考员管理 分页查询
export function inspectorPageList(data) {
  return request({
    url: '/course/exam_inspector/pageList',
    method: 'post',
    data
  })
}

export function addExamInspector(data) {
  return request({
    url: '/course/exam_inspector/save',
    method: 'post',
    data
  })
}

export function updateExamInspector(data) {
  return request({
    url: '/course/exam_inspector/update',
    method: 'post',
    data
  })
}

export function deleteExamInspector(data) {
  return request({
    url: '/course/exam_inspector/delete',
    method: 'post',
    data
  })
}

// /exam_inspector/listByOrganId
// 根据机构查询
export function inspectorListByOrganId(data) {
  return request({
    url: '/course/exam_inspector/listByOrganId',
    method: 'post',
    data
  })
}

// /exam_inspection/pageList
// 巡考管理 分页查询
export function inspectionPageList(data) {
  return request({
    url: '/course/exam_inspection/pageList',
    method: 'post',
    data
  })
}

export function addExamInspection(data) {
  return request({
    url: '/course/exam_inspection/save',
    method: 'post',
    data
  })
}

export function updateExamInspection(data) {
  return request({
    url: '/course/exam_inspection/update',
    method: 'post',
    data
  })
}

export function deleteExamInspection(data) {
  return request({
    url: '/course/exam_inspection/delete',
    method: 'post',
    data
  })
}

// /exam_coach/pageList
// 考辅人员 分页查询
export function coachPageList(data) {
  return request({
    url: '/course/exam_coach/pageList',
    method: 'post',
    data
  })
}
// 试卷管理分页查询
export function examPaperDelete(data) {
  return request({
    url: '/course/exam_paper/delete',
    method: 'post',
    data
  })
}

export function addExamCoach(data) {
  return request({
    url: '/course/exam_coach/save',
    method: 'post',
    data
  })
}

export function updateExamCoach(data) {
  return request({
    url: '/course/exam_coach/update',
    method: 'post',
    data
  })
}

export function deleteExamCoach(data) {
  return request({
    url: '/course/exam_coach/delete',
    method: 'post',
    data
  })
}

export function coachListByOrganId(data) {
  return request({
    url: '/course/exam_coach/listByOrganId',
    method: 'post',
    data
  })
}

// /exam_group/pageList
// 考务小组 分页查询
export function examGroupPageList(data) {
  return request({
    url: '/course/exam_group/pageList',
    method: 'post',
    data
  })
}

export function addExamGroup(data) {
  return request({
    url: '/course/exam_group/save',
    method: 'post',
    data
  })
}

// 题库编辑
export function examQuestionUpdate(data) {
  return request({
    url: '/course/exam_question/update',
    method: 'POST',
    data
  })
}

export function updateExamGroup(data) {
  return request({
    url: '/course/exam_group/update',
    method: 'post',
    data
  })
}

export function deleteExamGroup(data) {
  return request({
    url: '/course/exam_group/delete',
    method: 'post',
    data
  })
}

// /exam_invigilator/pageList
// 监考人员 分页查询
export function invigilatorPageList(data) {
  return request({
    url: '/course/exam_invigilator/pageList',
    method: 'post',
    data
  })
}

export function addExamInvigilator(data) {
  return request({
    url: '/course/exam_invigilator/save',
    method: 'post',
    data
  })
}

export function updateExamInvigilator(data) {
  return request({
    url: '/course/exam_invigilator/update',
    method: 'post',
    data
  })
}

export function deleteExamInvigilator(data) {
  return request({
    url: '/course/exam_invigilator/delete',
    method: 'post',
    data
  })
}

// /exam_cheat/pageList
// 作弊管理 分页查询
export function cheatPageList(data) {
  return request({
    url: '/course/exam_cheat/pageList',
    method: 'post',
    data
  })
}

export function addExamCheat(data) {
  return request({
    url: '/course/exam_cheat/save',
    method: 'post',
    data
  })
}

export function updateExamCheat(data) {
  return request({
    url: '/course/exam_cheat/update',
    method: 'post',
    data
  })
}

export function deleteExamCheat(data) {
  return request({
    url: '/course/exam_cheat/delete',
    method: 'post',
    data
  })
}

// 手动添加题目
export function examQuestionAddlist(data) {
  return request({
    url: `/course/exam_question/addList`,
    method: 'post',
    data
  })
}

// 自动添加题目
export function examQuestionAuto(data) {
  return request({
    url: `/course/exam_question/auto/add`,
    method: 'post',
    data
  })
}


// 试卷新增
export function examPaperSave(data) {
  return request({
    url: `/course/exam_paper/save`,
    method: 'post',
    data
  })
}

// 试卷修改
export function examPaperUpdate(data) {
  return request({
    url: `/course/exam_paper/update`,
    method: 'post',
    data
  })
}
// 试卷是否启用
export function examPaperEnable(data) {
  return request({
    url: `/course/exam_paper/enable`,
    method: 'post',
    data
  })
}

// 试卷编辑id
export function examPaperGet(id) {
  return request({
    url: `/course/exam_paper/get/${id}`,
    method: 'get',
  })
}

// 试卷预览

export function examPaperPreview(id) {
  return request({
    url: `/course/exam_question/get/${id}`,
    method: 'get',
  })
}
