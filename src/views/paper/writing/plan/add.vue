<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学校" prop="organId">
            <el-select placeholder="请选择" v-model="ruleForm.organId">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in schoolOrgansList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="论文计划名称" prop="paperName">
            <el-input v-model="ruleForm.paperName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-row :gutter="10" class="el-row-select">
            <el-col :span="12">
              <el-form-item label="论文写作学年" prop="schoolYear">
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
              <el-form-item label="论文写作学期" prop="semester">
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
          <el-row :gutter="10" class="el-row-select">
            <el-col :span="12">
              <el-form-item label="学生入学学年" prop="inSchoolYear">
                <el-select v-model="ruleForm.inSchoolYear" placeholder="请选择">
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
              <el-form-item label="学生入学学期" prop="inSemester">
                <el-select v-model="ruleForm.inSemester" placeholder="请选择">
                  <el-option
                    v-for="item in inSemesterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="el-row-select">
            <el-col :span="12">
              <el-form-item label="选课学分" prop="courseScore">
                <el-input v-model="ruleForm.courseScore" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="获得学分" prop="getScore">
                <el-input v-model="ruleForm.getScore" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="当前状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, idx) in dateRangeList" :key="idx" :label="item.title" :prop="item.keys[0]">
            <datePicker :newVal="form[item.model]" :keys="item.keys" @returnBack="dateChange" type="daterange"></datePicker>
          </el-form-item>
          <el-form-item label="备注">
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
  import datePicker from '@/components/DateRange/datePicker'
  import {mapGetters} from "vuex";

  export default {
    components: { datePicker },
    name: 'Add',
    props: {
      data: Object
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.organId = this.data.organId || ''
        this.ruleForm.paperName = this.data.paperName || ''
        this.ruleForm.semester = this.data.semester || ''
        this.ruleForm.schoolYear = this.data.schoolYear || ''
        this.ruleForm.inSemester = this.data.inSemester || ''
        this.ruleForm.inSchoolYear = this.data.inSchoolYear || ''
        this.ruleForm.courseScore = this.data.courseScore.toString() || ''
        this.ruleForm.getScore = this.data.getScore.toString() || ''
        this.ruleForm.status = this.data.status || ''
        this.ruleForm.remark = this.data.remark || ''
        for (let i = 1; i < 10; i++) {
          const key_s = 'start' + i
          const key_e = 'end' + i
          const key_se = 'startend' + i
          this.ruleForm[key_s] = this.data[key_s] || ''
          this.ruleForm[key_e] = this.data[key_e] || ''
          this.$set(this.form, key_se, [this.data[key_s], this.data[key_e]])
        }
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
      inSemesterOptions() {
        return this.yearAndSemester.semesterMap[this.ruleForm.inSchoolYear] || []
      },
      statusOptions() {
        return this.data.statusOptions
      }
    },
    data() {
      return {
        ruleForm: {
          id: '',
          organId: '',
          paperName: '',
          schoolYear: '',
          semester: '',
          inSchoolYear: '',
          inSemester: '',
          courseScore: '',
          getScore: '',
          remark: '',
          status: '',
          start1: '',
          end1: '',
          start2: '',
          end2: '',
          start3: '',
          end3: '',
          start4: '',
          end4: '',
          start5: '',
          end5: '',
          start6: '',
          end6: '',
          start7: '',
          end7: '',
          start8: '',
          end8: '',
          start9: '',
          end9: ''
        },
        rules: {
          start1: [{ required: true, message: '请选择', trigger: 'change' }],
          start2: [{ required: true, message: '请选择', trigger: 'change' }],
          start3: [{ required: true, message: '请选择', trigger: 'change' }],
          start4: [{ required: true, message: '请选择', trigger: 'change' }],
          start5: [{ required: true, message: '请选择', trigger: 'change' }],
          start6: [{ required: true, message: '请选择', trigger: 'change' }],
          start7: [{ required: true, message: '请选择', trigger: 'change' }],
          start8: [{ required: true, message: '请选择', trigger: 'change' }],
          start9: [{ required: true, message: '请选择', trigger: 'change' }],
          status: [{ required: true, message: '请选择', trigger: 'change' }],
          organId: [{ required: true, message: '请选择', trigger: 'change' }],
          schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
          semester: [{ required: true, message: '请选择', trigger: 'change' }],
          inSchoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
          inSemester: [{ required: true, message: '请选择', trigger: 'change' }],
          courseScore: [{ required: true, message: '请输入', trigger: 'blur' }, {
            pattern: '^[1-9]\\d*$',
            message: '只能是数字',
            trigger: 'blur'
          }],
          getScore: [{ required: true, message: '请输入', trigger: 'blur' }, {
            pattern: '^[1-9]\\d*$',
            message: '只能是数字',
            trigger: 'blur'
          }],
          paperName: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        form: {
          startend1: [],
          startend2: [],
          startend3: [],
          startend4: [],
          startend5: [],
          startend6: [],
          startend7: [],
          startend8: [],
          startend9: []
        },
        dateRangeList: [{
          title: '提交选题起止时间',
          model: 'startend1',
          keys: ['start1', 'end1']
        }, {
          title: '提交提纲起止时间',
          model: 'startend2',
          keys: ['start2', 'end2']
        }, {
          title: '提交初稿起止时间',
          model: 'startend3',
          keys: ['start3', 'end3']
        }, {
          title: '提交终稿起止时间',
          model: 'startend4',
          keys: ['start4', 'end4']
        }, {
          title: '批改提纲起止时间',
          model: 'startend5',
          keys: ['start5', 'end5']
        }, {
          title: '批改初稿起止时间',
          model: 'startend6',
          keys: ['start6', 'end6']
        }, {
          title: '批改终稿起止时间',
          model: 'startend7',
          keys: ['start7', 'end7']
        }, {
          title: '答辩终稿修改起止时间',
          model: 'startend8',
          keys: ['start8', 'end8']
        }, {
          title: '论文重写申请起止时间',
          model: 'startend9',
          keys: ['start9', 'end9']
        }]
      }
    },
    methods: {
      dateChange(val, keys) {
        if (val !== null && val.length) {
          this.ruleForm[keys[0]] = this.$dayjs(val[0]).format(
            'YYYY-MM-DD 00:00:00'
          )
          this.ruleForm[keys[1]] = this.$dayjs(val[1]).format(
            'YYYY-MM-DD 00:00:00'
          )
        } else {
          this.ruleForm[keys[0]] = ''
          this.ruleForm[keys[1]] = ''
        }
      },
      confirm(callBack) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...this.ruleForm,
            }
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: (this.data.isAdd ? '添加' : '修改') + '成功!' })
              } else {
                this.$message({ type: 'error', message: (this.data.isAdd ? '添加' : '修改') + '失败!' })
              }
              callBack(valid)
            }
            if (this.data.isAdd) {
              api.commonPageRequest(params, this.data.modelName, 'save').then(responseCallback)
            } else {
              api.commonPageRequest(params, this.data.modelName, 'update').then(responseCallback)
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .demo-ruleForm {
    padding: 0 20px;
  }
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
    .el-range-editor {
      width: 100%;
    }
  }
</style>
