<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="毕业计划名称" prop="planName">
            <el-input v-model="ruleForm.planName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-row :gutter="10" class="el-row-select">
            <el-col :span="8">
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
            <el-col :span="8">
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
            <el-col :span="8">
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
            </el-col>
          </el-row>
          <el-form-item label="毕业申请起止时间" prop="start1">
            <datePicker :newVal="startend1" @returnBack="dateChange1" type="daterange"></datePicker>
          </el-form-item>
          <el-form-item label="毕业审核起止时间" prop="start2">
            <datePicker :newVal="startend2" @returnBack="dateChange2" type="daterange"></datePicker>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import * as api from '../../api'
  import datePicker from '@/components/DateRange/datePicker'
  import { mapGetters } from 'vuex'

  export default {
    components: { datePicker },
    name: 'Add',
    props: {
      data: Object
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.planName = this.data.planName || ''
        this.ruleForm.semester = this.data.semester || ''
        this.ruleForm.schoolYear = this.data.schoolYear || ''
        this.ruleForm.status = this.data.status || ''
        this.ruleForm.start1 = this.data.startDate || ''
        this.ruleForm.end1 = this.data.endDate || ''
        this.ruleForm.start2 = this.data.approveStartDate || ''
        this.ruleForm.end2 = this.data.approveEndDate || ''
        this.startend1 = [this.ruleForm.start1, this.ruleForm.end1]
        this.startend2 = [this.ruleForm.start2, this.ruleForm.end2]
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
      statusOptions() {
        return this.data.statusOptions
      }
    },
    data() {
      return {
        ruleForm: {
          id: '',
          planName: '',
          schoolYear: '',
          semester: '',
          status: '',
          startDate: '',
          endDate: '',
          approveStartDate: '',
          approveEndDate: '',
          start1: '',
          start2: ''
        },
        rules: {
          start1: [{ required: true, message: '请选择', trigger: 'change' }],
          start2: [{ required: true, message: '请选择', trigger: 'change' }],
          status: [{ required: true, message: '请选择', trigger: 'change' }],
          schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
          semester: [{ required: true, message: '请选择', trigger: 'change' }],
          planName: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        startend1: [],
        startend2: []
      }
    },
    methods: {
      dateChange1(val) {
        if (val !== null && val.length) {
          this.ruleForm.start1 = this.$dayjs(val[0]).format(
            'YYYY-MM-DD 00:00:00'
          )
          this.ruleForm.end1 = this.$dayjs(val[1]).format(
            'YYYY-MM-DD 00:00:00'
          )
        } else {
          this.ruleForm.start1 = ''
          this.ruleForm.end1 = ''
        }
      },
      dateChange2(val) {
        if (val !== null && val.length) {
          this.ruleForm.start2 = this.$dayjs(val[0]).format(
            'YYYY-MM-DD 00:00:00'
          )
          this.ruleForm.end2 = this.$dayjs(val[1]).format(
            'YYYY-MM-DD 00:00:00'
          )
        } else {
          this.ruleForm.start2 = ''
          this.ruleForm.end2 = ''
        }
      },
      confirm(callBack) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...this.ruleForm,
              ...{
                startDate: this.ruleForm.start1,
                endDate: this.ruleForm.end1,
                approveStartDate: this.ruleForm.start2,
                approveEndDate: this.ruleForm.end2
              },
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
