<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="计划项目" prop="planId">
            <el-select v-model="ruleForm.planId" @change="planProjectChange" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanProjectList"
                :key="index"
                :label="item.projectName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-row v-show="rows.projectName" :gutter="24" v-loading="loading">
              <el-col :span="24">
                <div>计划名称：{{ rows.projectName || '--' }}</div>
              </el-col>
            </el-row>
            <el-row v-show="rows.projectName" :gutter="24" v-loading="loading">
              <el-col :span="24">
                <div>考试批次：{{ rows.planId || '--' }}</div>
              </el-col>
            </el-row>
            <el-row v-show="rows.projectName" :gutter="24" v-loading="loading">
              <el-col :span="12">
                <div>学年：{{ rows.schoolYear || '--' }}</div>
                <div>考场：{{ rows.examRoomId || '--' }}</div>
              </el-col>
              <el-col :span="12">
                <div>学期：{{ rows.semester || '--' }}</div>
                <div>座位数：{{ rows.seatNumber || '--' }}</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="监考人数" prop="invigilatorNum">
            <el-input
              v-model="ruleForm.invigilatorNum"
              placeholder="学号/身份证"
            ></el-input>
          </el-form-item>
          <el-form-item prop="coachIds" label="监考老师安排">
            <el-select v-model="ruleForm.coachIds" multiple placeholder="请选择">
              <el-option
                v-for="item in coachList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
        examPlanProjectList: [],
        studentNoOrCertNo: null,
        loading: false,
        ruleForm: {
          id: '',
          planId: '',
          planInfoId: '',
          invigilatorNum: '',
          coachIds: ''
        },
        rules: {
          invigilatorNum: [{ required: true, message: '请输入监考人数', trigger: 'blur' },
            {
              pattern: '^[1-9]\\d*$',
              message: '只能是数字',
              trigger: 'blur'
            }],
          coachIds: [{ required: true, message: '请选择', trigger: 'change' }],
          planId: [{ required: true, message: '请选择', trigger: 'change' }]
        }
      }
    },
    computed: {
      coachList() {
        return this.data.coachList
      },
      rows() {
        if(this.ruleForm.planId) {
          return this.examPlanProjectList.filter(t => t.id === this.ruleForm.planId)[0]
        }
        return {}
      }
    },
    created() {
      api.listByOrganId({ organId: this.data.organId }).then(res => {
        this.examPlanProjectList = res.data
      })
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.planId = this.data.planId || ''
        this.ruleForm.planInfoId = this.data.planInfoId || ''
        this.ruleForm.invigilatorNum = this.data.invigilatorNum.toString() || ''
        this.ruleForm.coachIds = this.data.coachIds || []
      }
    },
    methods: {
      planProjectChange() {
        const obj = this.examPlanProjectList.filter(t => t.id === this.ruleForm.planId)[0]
        this.ruleForm.planInfoId = obj.planId
      },
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
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
            if (this.data.isAdd) {
              api.addExamInvigilator(params).then(responseCallback)
            } else {
              api.updateExamInvigilator(params).then(responseCallback)
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
