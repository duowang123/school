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
                <el-select v-model="ruleForm.schoolYear" placeholder="请选择">
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
                <el-select v-model="ruleForm.semester" placeholder="请选择">
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
            <el-select v-model="ruleForm.courseId" @change="courseChange" placeholder="请选择">
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
            <el-select v-model="ruleForm.planId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanInfoList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扫描件">
            <upload class="upload-icon" ref="upload" :url="ruleForm.pictureUrl" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/ImgUpload'
  import * as api from '../../api'
  export default {
    components: {
      Upload
    },
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
          remark: ''
        },
        rules: {
          testScore: [{ required: true, message: '请输入成绩', trigger: 'blur' },
            {
              pattern: '^[1-9][0-9]*(\\.[0-9]+)?$',
              message: '只能是数字',
              trigger: 'blur'
            }],
          testStatus: [{ required: true, message: '请输入考试状态', trigger: 'blur' }],
          testType: [{ required: true, message: '请选择考试方式', trigger: 'change' }],
          planId: [{ required: true, message: '请选择', trigger: 'change' }],
          planInfoId: [{ required: true, message: '请选择', trigger: 'change' }]
        },
        studentCourseList: []
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
          const uploadRes = await this.$refs.upload.upload()
          console.log('uploadRes', uploadRes)
          if (uploadRes.code !== 200) {
            this.$message('图片上传失败！')
            return false
          }
          if (valid) {
            if (!this.rows.id) return this.$message.warning('请先搜索学号/身份证!')
            Object.assign(this.ruleForm, {
              pictureUrl: uploadRes.data,
              organId: this.data.organId
            })
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: (this.data.isAdd ? '添加' : '修改') + '成功!' })
              } else {
                this.$message({ type: 'error', message: (this.data.isAdd ? '添加' : '修改') + '失败!' })
              }
              callBack(valid)
            }
            if (this.data.isAdd) {
              api.stopTestAdd(this.ruleForm).then(responseCallback)
            } else {
              api.stopTestUpdate(this.ruleForm).then(responseCallback)
            }
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
