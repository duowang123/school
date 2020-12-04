<template >
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学校" prop="organId">
            <el-select @change="change" placeholder="请选择" v-model="ruleForm.organId">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in schoolOrgansList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试科目" prop="projectName">
            <el-input placeholder="计划项目" style="margin-bottom: 10px" v-model="ruleForm.projectName" />
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
          <el-form-item v-if="false" label="学年" prop="schoolYear">
            <el-select v-model="ruleForm.schoolYear" placeholder="请选择">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="false" label="学期" prop="semester">
            <el-select v-model="ruleForm.semester" placeholder="请选择">
              <el-option
                v-for="item in semesterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-scrollbar style="height:650px;"> -->
          <el-row class="el-row-select">
            <el-col :span="24" v-for="(item,index) of selectList" :key="index">
              <el-form-item :label="item.name" :prop="item.model">
                <el-select
                  v-model="ruleForm[item.model]"
                  @visible-change="visibleChange($event, item)"
                  :placeholder="item.placeholder"
                >
                  <el-option
                    v-for="(e,index) in item.data"
                    :key="index"
                    @click.native="handlerClickOption(item)"
                    :label="e.dictName"
                    :value="e.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="试卷编号">
            <el-select v-model="ruleForm.paperId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPaperOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="testType" label="考试方式">
            <el-select v-model="ruleForm.testType" placeholder="请选择">
              <el-option
                v-for="(item, index) in testTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="false" prop="roomIds" label="考场">
            <el-select v-model="ruleForm.roomIds" multiple placeholder="请选择">
              <el-option
                v-for="(item, index) in examRoomOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试开始时间" prop="startDate">
            <el-date-picker
              class="form-item-input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="medium"
              v-model="ruleForm.startDate"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="考试结束时间" prop="endDate">
            <el-date-picker
              class="form-item-input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="medium"
              v-model="ruleForm.endDate"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
  import * as api from '../../api'
  import { mapGetters } from 'vuex'
  import selectMixin from '@/views/mixins/select.js'
  export default {
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    mixins: [selectMixin],
    data() {
      return {
        selectList: [
          {
            placeholder: '请选择层次',
            name: '层次',
            key: 'code',
            model: 'level',
            code: '0015',
            data: []
          },
          {
            placeholder: '请选择专业',
            name: '专业',
            model: 'professionalId',
            key: 'professionalId',
            data: []
          },
          {
            placeholder: '请选择课程',
            name: '课程',
            model: 'courseId',
            key: 'courseId',
            data: []
          }
        ],
        ruleForm: {
          organId: '',
          level: '', // 层次
          courseId: '', // 课程id
          professionalId: '', // 专业id
          endDate: '',
          roomIds: '',
          paperId: '',
          planId: '',
          projectName: '',
          schoolYear: '',
          semester: '',
          startDate: '',
          testType: ''
        },
        rules: {
          organId: [{ required: true, message: '请选择', trigger: 'blur' }],
          projectName: [{ required: true, message: '请输入计划项目', trigger: 'blur' }],
          startDate: [{ required: true, message: '请输入考试开始时间', trigger: 'blur' }],
          endDate: [{ required: true, message: '请输入考试结束时间', trigger: 'blur' }],
          testType: [{ required: true, message: '请选择考试方式', trigger: 'change' }],
          semester: [{ required: true, message: '请选择', trigger: 'change' }],
          schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
          planId: [{ required: true, message: '请选择', trigger: 'change' }],
          paperId: [{ required: true, message: '请选择', trigger: 'change' }],
          roomIds: [{ required: true, message: '请选择', trigger: 'change' }],
          level: [{ required: true, message: '请选择', trigger: 'change' }]
        },
        examPaperOptions: []
      }
    },
    watch: {
      'ruleForm.courseId': {
        handler(val) {
          console.log(val)
          this.examPaperOptions = []
          this.ruleForm.paperId = ''
          if (val) {
            this.getExamPaperList(val)
          }
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['yearAndSemester']),
      schoolYearOptions() {
        return this.yearAndSemester.schoolYears
      },
      semesterOptions() {
        return this.yearAndSemester.semesterMap[this.ruleForm.schoolYear] || []
      },
      testTypeOptions() {
        return this.data.testTypeOptions
      },
      examRoomOptions() {
        return this.data.examRoomOptions
      },
      examPlanInfoList() {
        return this.data.examPlanInfoList
      }
    },
    async created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.organId = this.data.organId || ''
        this.ruleForm.projectName = this.data.projectName || ''
        this.ruleForm.startDate = this.data.startDate || ''
        this.ruleForm.endDate = this.data.endDate || ''
        this.ruleForm.testType = this.data.testType || ''
        this.ruleForm.semester = this.data.semester || ''
        this.ruleForm.schoolYear = this.data.schoolYear || ''
        this.ruleForm.planId = this.data.planId || ''
        this.ruleForm.roomIds = this.data.roomIds || ''
        this.ruleForm.level = this.data.level || ''
        this.ruleForm.professionalId = this.data.professionalId || ''
        this.ruleForm.courseId = this.data.courseId || ''
        this.getExamPaperList(this.ruleForm.courseId, () => {
          this.ruleForm.paperId = this.data.paperId || ''
        })
        this.selectList.forEach(t => {
          this.handlerSelect(t, t.key)
        })
      }
    },
    methods: {
      getExamPaperList(val, callback) {
        api.examPaperListByCourseId(val).then(res => {
          this.examPaperOptions = res.data.map(t => {
            return {
              label: t.paperName,
              value: t.id
            }
          })
          callback && callback()
        })
      },
      confirm(callBack) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...this.ruleForm,
              organId: this.data.organId
            }
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: (this.data.isAdd ? '添加' : '修改') + '成功!' })
              } else {
                this.$message({ type: 'error', message: (this.data.isAdd ? '添加' : '修改') + '失败!' })
              }
              callBack(valid)
            }
            console.log(params);
            if (this.data.isAdd) {
              api.addExamCouse(params).then(responseCallback)
            } else {
              api.updateExamCouse(params).then(responseCallback)
            }
          }
        })
      },
      handlerClickOption(item) {
        if (item.model === 'level') this.ruleForm.professionalId = ''
        if (item.model !== 'courseId') this.ruleForm.courseId = ''
      },
      async visibleChange(value, item) {
        if (
          !item.data.length ||
          item.key === 'professionalId' ||
          item.key === 'courseId'
        )
          this.handlerSelect(item, item.key)
      },
      async handlerSelect(item, value) {
        const handler = {
          code: async () => {
            const res =
              ((await api.listByCode({ code: item.code })) || {}).data || []
            item.data = res
          },
          professionalId: async () => {
            const params = {
              organId: this.data.organId,
              level: this.ruleForm.level
            }
            if (!this.ruleForm.level) return this.$message.warning('请先选择层次!')
            const data =
              ((await api.listByOrganIdAndLevel(params)) || {}).data || []
            if (data.length) {
              item.data = data.map((item) => {
                return {
                  dictName: item.name,
                  dictValue: item.id
                }
              })
            }
          },
          courseId: async () => {
            if (!this.ruleForm.professionalId)
              return this.$message.warning('请先选择专业!')
            const data =
              ((await api.specialtySubject(this.ruleForm.professionalId)) || {}).data ||
              []
            item.data = data.length
              ? (item.data = data.map((item) => {
                return {
                  dictName: item.courseName,
                  dictValue: item.id
                }
              }))
              : []
          }
        }
        handler[value]()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-row-select /deep/ {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
</style>
<style lang="scss">
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
