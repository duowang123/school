<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学生信息">
            <el-input
              suffix-icon="el-icon-search"
              v-model="studentNoOrCertNo"
              @keyup.enter.native="onSearch"
              placeholder="学号/证件号码"
              v-show="false"
            ></el-input>
            <el-row v-show="rows.realName" :gutter="24" v-loading="loading">
              <el-col :span="10">
                <div>学号：{{ rows.studentNo || 'xx' }}</div>
                <div>性别：{{ rows.sex ? (rows.sex === '1' ? '男' : '女') : 'XX' }}</div>
                <div>学年：{{ data.schoolYear || '--' }}</div>
              </el-col>
              <el-col :span="14">
                <div>
                  <div>姓名：{{ rows.realName || 'xx' }}</div>
                  <div>证件号码：{{ rows.certNo || 'xx' }}</div>
                  <div>学期：{{ data.semester || '--' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <div>专业：{{ data.professional || '--' }}</div>
          </el-form-item>
          <el-form-item label="">
            <div>论文选题：{{ data.selectName || '--' }}</div>
          </el-form-item>
          <el-form-item label="预约审核" prop="approveStatus">
            <el-select v-model="ruleForm.approveStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in approveStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ruleForm.approveStatus === '3'" label="预约时间修改" prop="submitDate">
            <el-date-picker
              class="form-item-input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="medium"
              v-model="ruleForm.submitDate"
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
          submitDate: '',
          remark: '',
          approveStatus: ''
        },
        rules: {
          approveStatus: [{ required: true, message: '请选择', trigger: 'change' }],
          submitDate: [{ required: true, message: '请输入预约时间修改', trigger: 'blur' }]
        }
      }
    },
    computed: {
      approveStatusList() {
        return this.data.approveStatusList
      }
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
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
          // this.ruleForm.studentId = res.data.id
          this.loading = false
          this.getCourseList()
        } catch (err) {
          this.loading = false
        }
      },
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            const params = Object.assign({}, this.ruleForm)
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '审核成功!' })
              } else {
                this.$message({ type: 'error', message: '审核失败!' })
              }
              callBack(valid)
            }
            api.commonPageRequest(params, this.data.modelName, 'approve').then(responseCallback)
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
