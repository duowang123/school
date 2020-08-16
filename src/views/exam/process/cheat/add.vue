<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="考试计划" prop="planInfoId">
            <el-select v-model="ruleForm.planInfoId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanInfoList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划项目" prop="planId">
            <el-select v-model="ruleForm.planId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanProjectList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item prop="cheatType" label="缺考/作弊">
            <el-select v-model="ruleForm.cheatType" placeholder="请选择">
              <el-option
                v-for="(item, index) in cheatTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
        studentNoOrCertNo: null,
        loading: false,
        rows: {},
        ruleForm: {
          id: '',
          studentId: '',
          planId: '',
          planInfoId: '',
          remark: '',
          cheatType: ''
        },
        rules: {
          cheatType: [{ required: true, message: '请选择', trigger: 'change' }],
          planId: [{ required: true, message: '请选择', trigger: 'change' }],
          planInfoId: [{ required: true, message: '请选择', trigger: 'change' }]
        }
      }
    },
    computed: {
      examPlanInfoList() {
        return this.data.examPlanInfoList
      },
      examPlanProjectList() {
        return this.data.examPlanProjectList
      },
      cheatTypeList() {
        return this.data.cheatTypeList
      }
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.studentId = this.data.studentId || ''
        this.ruleForm.planId = this.data.planId || ''
        this.ruleForm.planInfoId = this.data.planInfoId || ''
        this.ruleForm.cheatType = this.data.cheatType || ''
        this.studentNoOrCertNo = this.data.studentNo || ''
        this.onSearch()
      }
    },
    methods: {
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
            if (!this.rows.id) return this.$message.warning('请先搜索学号/身份证!')
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
              api.addExamCheat(params).then(responseCallback)
            } else {
              api.updateExamCheat(params).then(responseCallback)
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
