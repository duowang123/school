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

// 考点新增
export function testCenterAdd(data) {
  return request({
    url: '/course/test_center/save',
    method: 'POST',
    data
  })
}
// 考点修改
export function testCenterUpdate(data) {
  return request({
    url: '/course/test_center/update',
    method: 'POST',
    data
  })
}

// 考点启用
export function testCenterOpen(data) {
  return request({
    url: '/course/test_center/open',
    method: 'POST',
    data
  })
}

// 考点禁用
export function testCenterClose(data) {
  return request({
    url: '/course/test_center/close',
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

// /exam/pageCenterList
// 学生考点分页查询
export function examPageCenterList(data) {
  return request({
    url: '/course/exam/pageCenterList',
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
    url: '/course/exam_plan/list',
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


// 考试计划 -》专业分配考场管理
// Stu Exam Profession Controller
export function getExamProfessionPageList(data) {
  return request({
    url: '/course/exam_profession/pageList',
    method: 'post',
    data
  })
}

//
export function addExamProfession(data) {
  return request({
    url: '/course/exam_profession/save',
    method: 'post',
    data
  })
}

export function updateExamProfession(data) {
  return request({
    url: '/course/exam_profession/update',
    method: 'post',
    data
  })
}

export function deleteExamProfession(data) {
  return request({
    url: '/course/exam_profession/delete',
    method: 'post',
    data
  })
}

// 考试科目管理
// Stu Exam Course Controller
export function getExamCousePageList(data) {
  return request({
    url: '/course/exam_couse/pageList',
    method: 'post',
    data
  })
}

//
export function addExamCouse(data) {
  return request({
    url: '/course/exam_couse/save',
    method: 'post',
    data
  })
}

export function updateExamCouse(data) {
  return request({
    url: '/course/exam_couse/update',
    method: 'post',
    data
  })
}

export function deleteExamCouse(data) {
  return request({
    url: '/course/exam_couse/delete',
    method: 'post',
    data
  })
}

// 学生考试分页查询
export function examPageList(data) {
  return request({
    url: '/course/exam/pageList',
    method: 'POST',
    data
  })
}

// 学生考试科目安排
export function examPageCourseList(data) {
  return request({
    url: '/course/exam/pageCourseList',
    method: 'POST',
    data
  })
}

// 查询某个学生的刷卡记录
export function faceInfoByStudentId(studentId) {
  return request({
    url: `/course/face/info/${studentId}`,
    method: `GET`
  })
}

export function examPaperListByCourseId(id) {
  return request({
    url: '/course/exam_paper/course/' + id,
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

// exam_plan/listByOrganId 计划项目  已经调整为计划科目了
export function listByOrganId(data) {
  return request({
    // url: '/course/exam_plan/listByOrganId',
    url: '/course/exam_couse/listByOrganId',
    method: 'post',
    data
  })
}

// /exam_plan_info/list
export function examPlanInfoList(data) {
  return request({
    url: '/course/exam_plan/list',
    method: 'post',
    data
  })
}

// /exam_plan_info/delete
// export function deleteExamPlanInfo(data) {
//   return request({
//     url: '/course/exam_plan_info/delete',
//     method: 'post',
//     data
//   })
// }
//
// // /exam_plan_info/save
// export function saveExamPlanInfo(data) {
//   return request({
//     url: '/course/exam_plan_info/save',
//     method: 'post',
//     data
//   })
// }


// stu_re_test/pageList
// 分页查询
export function reTestPageList(data) {
  return request({
    url: '/course/stu_re_test/pageList',
    method: 'post',
    data
  })
}

export function reTestAdd(data) {
  return request({
    url: '/course/stu_re_test/save',
    method: 'post',
    data
  })
}

export function reTestUpdate(data) {
  return request({
    url: '/course/stu_re_test/update',
    method: 'post',
    data
  })
}

export function reTestDelete(data) {
  return request({
    url: '/course/stu_re_test/delete',
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

export function getStudentCoursesList(data) {
  return request({
    url: `/course/student_course/course_list`,
    method: 'post',
    data
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

export function stopTestAdd(data) {
  return request({
    url: '/course/stu_stop_test/save',
    method: 'post',
    data
  })
}

export function stopTestUpdate(data) {
  return request({
    url: '/course/stu_stop_test/update',
    method: 'post',
    data
  })
}

export function stopTestDelete(data) {
  return request({
    url: '/course/stu_stop_test/delete',
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

// 人脸识别分页查询
export function facePageList(data) {
  return request({
    url: '/course/face/pageList',
    method: 'post',
    data
  })
}
// 人脸识别分页查询
export function getFacePic(id) {
  return request({
    url: '/course/face/getPic/' + id,
    method: 'get'
  })
}

// 人脸识别分页查询
export function deleteFace(data) {
  return request({
    url: '/course/face/delete/',
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
    method: 'get'
  })
}

// 试卷预览

export function examPaperPreview(id) {
  return request({
    url: `/course/exam_question/get/${id}`,
    method: 'get'
  })
}


// 学生录取信息导出
export function exportExcelStuScore(data) {
  return request({
    url: `/course/stu_test_score/export`,
    method: 'post',
    data
  })
}


// 获取需要阅卷的试卷
export function stuTestScoreGetReview(data) {
  return request({
    url: `/course/stu_test_score/get_review`,
    method: 'post',
    data
  })
}

// 阅卷
export function stuTestScoretReview(data) {
  return request({
    url: `/course/stu_test_score/review`,
    method: 'post',
    data
  })
}

// /exam/update
// 修改学生考试信息
export function examCourseUpdate(data) {
  return request({
    url: `/course/exam/update`,
    method: 'post',
    data
  })
}

// stu_credit/real_score
// 获取学生课程的成绩
export function getCourseRealScore(data) {
  return request({
    url: `/course/stu_credit/real_score`,
    method: 'post',
    data
  })
}
