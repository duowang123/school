<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学校" prop="organId">
            <el-select v-model="ruleForm.organId" @change="change" placeholder="请选择">
              <el-option
                v-for="item in schoolOrgansList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教学点" prop="schoolOrganId">
            <el-select placeholder="请选择" v-model="ruleForm.schoolOrganId">
              <el-option
                :key="item.id"
                v-for="item in schoolOrgansList"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试计划" prop="planInfoId">
            <el-select @change="getPlanPreject()" placeholder="请选择" v-model="ruleForm.planInfoId">
              <el-option
                v-for="(item, index) in examPlanInfoList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试科目" prop="planId">
            <el-select v-model="ruleForm.planId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanProjectList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学号/证件号码">
            <el-input
              suffix-icon="el-icon-search"
              v-model="studentNoOrCertNo"
              @keyup.enter.native="onSearch"
              placeholder="学号/证件号码"
            ></el-input>
            <stu-card :detail="rows" v-loading="loading"/>
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
import selectMixin from '@/views/mixins/select.js'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [selectMixin],
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
        cheatType: '',
        organId: '',
        schoolOrganId: ''
      },
      rules: {
        cheatType: [{ required: true, message: '请选择', trigger: 'change' }],
        planId: [{ required: true, message: '请选择', trigger: 'change' }],
        planInfoId: [{ required: true, message: '请选择', trigger: 'change' }],
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolOrganId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      examPlanProjectList: [],
      examPlanInfoList: []
    }
  },
  computed: {
    cheatTypeList() {
      return this.data.cheatTypeList
    }
  },
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.organId = this.data.organId || ''
      this.ruleForm.schoolOrganId = this.data.schoolOrganId || ''
      this.ruleForm.studentId = this.data.studentId || ''
      this.ruleForm.planInfoId = this.data.planInfoId || ''
      this.ruleForm.cheatType = this.data.cheatType || ''
      this.studentNoOrCertNo = this.data.studentNo || ''
      this.getExamPlanInfoList()
      this.getPlanPreject(() => {
        this.ruleForm.planId = this.data.planId || ''
      })
      this.onSearch()
    }
  },
  methods: {
    change(val) {
      this.getExamPlanInfoList()
      this.getPlanPreject()
    },
    getExamPlanInfoList() {
      if (!this.ruleForm.organId) {
        return false
      }
      api.examPlanInfoList({ organId: this.ruleForm.organId }).then((res) => {
        this.examPlanInfoList = res.data.map((t) => {
          return {
            label: t.planName,
            value: t.id
          }
        })
      })
    },
    getPlanPreject(callback) {
      if (!this.ruleForm.organId || !this.ruleForm.planInfoId) {
        return false
      }
      this.ruleForm.planId = ''
      api.listByOrganId({
          organId: this.ruleForm.organId,
          planId: this.ruleForm.planInfoId
        })
        .then((res) => {
          this.examPlanProjectList = res.data.map((t) => {
            return {
              name: t.projectName,
              value: t.id
            }
          })
          callback && callback()
        })
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
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          if (!this.rows.id) { return this.$message.warning('请先搜索学号/证件号码!') }
          const params = {
            ...this.ruleForm,
          }
          const responseCallback = (res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: (this.data.isAdd ? '添加' : '修改') + '成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: (this.data.isAdd ? '添加' : '修改') + '失败!'
              })
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
