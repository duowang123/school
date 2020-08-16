<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学号/身份证号">
            <el-input
              suffix-icon="el-icon-search"
              v-model="studentNoOrCertNo"
              @keyup.enter.native="onSearch"
              placeholder="学号/身份证"
              disabled
            ></el-input>
            <el-row v-show="rows.realName" :gutter="24" v-loading="loading">
              <el-col :span="10">
                <div>学号：{{ rows.studentNo || 'xx' }}</div>
                <div>性别：{{ rows.sex ? (rows.sex === '1' ? '男' : '女') : 'XX' }}</div>
              </el-col>
              <el-col :span="14">
                <div>
                  <div>姓名：{{ rows.realName || 'xx' }}</div>
                  <div>证件号码：{{ rows.certNo || 'xx' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-row :gutter="10" class="el-row-select">
            <el-col :span="12">
              <el-form-item label="学年" prop="schoolYear">
                <el-select disabled v-model="ruleForm.schoolYear" placeholder="请选择">
                  <el-option
                    v-for="item in schoolYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学期" prop="semester">
                <el-select disabled v-model="ruleForm.semester" placeholder="请选择">
                  <el-option
                    v-for="item in semesterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="课程" prop="courseId">
            <el-select disabled v-model="ruleForm.courseId" @change="courseChange" placeholder="请选择">
              <el-option
                v-for="(item, index) in studentCourseList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程成绩">
            <el-input v-model="ruleForm.testScore" disabled placeholder="成绩" style="margin-bottom: 10px" />
          </el-form-item>
          <el-form-item label="考试计划" prop="planId">
            <el-select disabled v-model="ruleForm.planId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanInfoList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核结论" prop="approveStatus">
            <el-select v-model="ruleForm.approveStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in approveStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" v-if="ruleForm.approveStatus === '3'" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注内容" v-model="ruleForm.remark">
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import * as api from '../../api'
  export default {
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    data(vm) {
      return {
        studentNoOrCertNo: null,
        loading: false,
        rows: {},
        ruleForm: {
          id: '',
          studentId: '',
          planId: '',
          testScore: '',
          semester: '',
          schoolYear: '',
          courseId: '',
          pictureUrl: '',
          remark: '',
          approveStatus: ''
        },
        rules: {
          approveStatus: [{ required: true, message: '请选择', trigger: 'change' }],
          remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
        },
        studentCourseList: [],
        approveStatusList: [
          {
            name: '通过',
            value: '2'
          },
          {
            name: '不通过',
            value: '3'
          }
        ]
      }
    },
    watch: {
      'ruleForm.studentId': {
        handler(val) {
          //do something
          api.getStudentCourses(val).then(res => {
            this.studentCourseList = res.data.studentCourseInfos.map(t => {
              return {
                label: t.courseName,
                value: t.courseId,
                score: t.score
              }
            })
          })
        }
      }
    },
    computed: {
      examPlanInfoList() {
        return this.data.examPlanInfoList
      },
      semesterOptions() {
        return this.data.semesterOptions
      },
      schoolYearOptions() {
        return this.data.schoolYearOptions
      }
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.studentId = this.data.studentId || ''
        this.ruleForm.planId = this.data.planId || ''
        this.ruleForm.testScore = this.data.testScore.toString() || ''
        this.ruleForm.schoolYear = this.data.schoolYear || ''
        this.ruleForm.semester = this.data.semester || ''
        this.ruleForm.courseId = this.data.courseId || ''
        this.ruleForm.pictureUrl = this.data.pictureUrl || ''
        this.studentNoOrCertNo = this.data.studentNo || ''
        this.onSearch()
      }
    },
    methods: {
      courseChange() {
        const arr = this.studentCourseList.filter(t => {
          return t.value === this.ruleForm.courseId
        })
        console.log(arr)
        this.ruleForm.testScore = arr[0].score
      },
      async onSearch() {
        this.loading = true
        try {
          const res = await api.getQueryStudent({
            studentNoOrCertNo: this.studentNoOrCertNo
          })
          this.rows = res.data || {}
          // if (this.rows.organId) {
          //   const result = await api.getInfoList(this.rows.organId)
          // }
          this.ruleForm.studentId = res.data.id
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            const { id, approveStatus, remark } = this.ruleForm
            const params = { id, approveStatus, remark }
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '审核成功!' })
              } else {
                this.$message({ type: 'error', message: '审核失败!' })
              }
              callBack(valid)
            }
            api.reTestApprove(params).then(responseCallback)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .attrStyle {
    padding: 0 20px;
    .item {
      padding-top: 20px;
      p {
        margin: 0;
      }
    }
  }
  .application /deep/ {
    .form-item {
      width: 100%;
    }
    .el-form-item {
      display: flex;
      flex-direction: column;
    }
    .el-form-item__label {
      width: auto !important;
      text-align: left;
    }
    .el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
    .el-textarea {
      width: 100%;
    }
  }
</style>
