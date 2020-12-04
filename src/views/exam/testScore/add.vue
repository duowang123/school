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
          <el-form-item label="考试计划" prop="planInfoId">
            <el-select v-model="ruleForm.planInfoId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanInfoList"
                :key="index"
                @click.native="handlerPlan(item)"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试科目" prop="planId">
            <el-select v-model="ruleForm.planId" placeholder="请选择" @visible-change="visibleChange">
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
            <stu-card :detail="rows"></stu-card>
          </el-form-item>
          <el-form-item prop="testType" label="考试方式">
            <div style="padding-left: 10px">线下</div>
          </el-form-item>
          <el-form-item prop="testScore" label="成绩">
            <el-input v-model="ruleForm.testScore" placeholder="成绩" style="margin-bottom: 10px" />
          </el-form-item>
          <el-form-item prop="testStatus" label="考试状态">
            <el-select v-model="ruleForm.testStatus" placeholder="请选择">
              <el-option label="缺考" value="0"></el-option>
              <el-option label="正常考试" value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as api from '../api'
import selectMixin from '@/views/mixins/select.js'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [selectMixin],
  data(vm) {
    return {
      studentNoOrCertNo: null,
      loading: false,
      rows: {},
      ruleForm: {
        id: '',
        organId: '',
        studentId: '',
        planId: '',
        planInfoId: '',
        remark: '',
        testScore: '',
        testType: '0',
        testStatus: '',
      },
      rules: {
        testScore: [
          { required: true, message: '请输入成绩', trigger: 'blur' },
          {
            pattern: '^[1-9][0-9]*(\\.[0-9]+)?$',
            message: '只能是数字',
            trigger: 'blur',
          },
        ],
        testStatus: [
          { required: true, message: '请输入考试状态', trigger: 'change' },
        ],
        testType: [
          { required: true, message: '请选择考试方式', trigger: 'change' },
        ],
        planId: [{ required: true, message: '请选择', trigger: 'change' }],
        planInfoId: [{ required: true, message: '请选择', trigger: 'change' }],
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      examPlanInfoList: [],
      examPlanProjectList: [],
    }
  },
  computed: {
    // examPlanInfoList() {
    // return this.data.examPlanInfoList
    // },
    // examPlanProjectList() {
    // return this.data.examPlanProjectList
    // },
    testTypeList() {
      return this.data.testTypeList
    },
  },
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.studentId = this.data.studentId || ''
      this.ruleForm.planId = this.data.planId || ''
      this.ruleForm.planInfoId = this.data.planInfoId || ''
      this.ruleForm.testScore = this.data.testScore.toString() || ''
      this.ruleForm.testType = this.data.testType || ''
      this.ruleForm.testStatus = this.data.testStatus || ''
      this.studentNoOrCertNo = this.data.studentNo || ''
      this.handlerPlan({ value: this.data.planInfoId }, true)
      this.onSearch()
    }
  },
  methods: {
    change(val) {
      if (val) {
        this.getExamPlanInfoList()
      } else {
        this.examPlanInfoList = []
      }
    },
    visibleChange() {
      if (!this.ruleForm.planInfoId)
        return this.$message.warning('请选择考试计划!')
    },
    getExamPlanInfoList() {
      api.examPlanInfoList({ organId: this.ruleForm.organId }).then((res) => {
        this.examPlanInfoList = res.data.map((t) => {
          return {
            label: t.planName,
            value: t.id,
          }
        })
      })
    },
    handlerPlan(item, isFirst = false) {
      api
        .listByOrganId({ organId: this.ruleForm.organId, planId: item.value })
        .then((res) => {
          // 判断是否是第一次
          if (!isFirst) this.ruleForm.planId = ''
          this.data.examPlanProjectList = res.data.map((t) => {
            return {
              name: t.projectName,
              value: t.id,
            }
          })
        })
    },
    async onSearch() {
      this.loading = true
      try {
        const res = await api.getQueryStudent({
          studentNoOrCertNo: this.studentNoOrCertNo,
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
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          if (!this.rows.id)
            return this.$message.warning('请先搜索学号/证件号码!')
          const params = {
            ...this.ruleForm,
            organId: this.data.organId,
          }
          const responseCallback = (res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: (this.data.isAdd ? '添加' : '修改') + '成功!',
              })
            } else {
              this.$message({
                type: 'error',
                message: (this.data.isAdd ? '添加' : '修改') + '失败!',
              })
            }
            callBack(valid)
          }
          if (this.data.isAdd) {
            api.addStudentTestScore(params).then(responseCallback)
          } else {
            api.updateStudentTestScore(params).then(responseCallback)
          }
        }
      })
    },
  },
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
