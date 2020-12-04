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
          <el-form-item label="是否答辩" prop="defenceStatus">
            <el-select v-model="ruleForm.defenceStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in defenceStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="答辩方式" prop="defenceType">
            <el-select v-model="ruleForm.defenceType" placeholder="请选择">
              <el-option
                v-for="(item, index) in defenceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="答辩时间" prop="defenceDate">
            <el-date-picker
              class="form-item-input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="medium"
              v-model="ruleForm.defenceDate"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="答辩评语" prop="defenceRemark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入初稿评语" v-model="ruleForm.defenceRemark">
            </el-input>
          </el-form-item>
          <el-form-item label="答辩成绩" prop="defenceResult">
            <el-select v-model="ruleForm.defenceResult" placeholder="请选择">
              <el-option
                v-for="item in resultStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批改时间" prop="correctDate">
            <el-date-picker
              class="form-item-input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="medium"
              v-model="ruleForm.correctDate"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="答辩老师" prop="defenceTeacher">
            <el-input type="text" placeholder="请输入答辩老师" v-model="ruleForm.defenceTeacher">
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
          defenceStatus: '',
          defenceType: '',
          defenceDate: '',
          defenceRemark: '',
          defenceResult: '',
          defenceTeacher: '',
          correctDate: ''
        },
        rules: {
          defenceStatus: [{ required: true, message: '请选择', trigger: 'change' }],
          defenceDate: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    computed: {
      defenceTypeList() {
        return this.data.defenceTypeList
      },
      defenceStatusList() {
        return this.data.defenceStatusList
      },
      resultStatusList() {
        return this.data.resultStatusList
      }
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.studentId = this.data.studentId || ''
        this.ruleForm.defenceStatus = this.data.defenceStatus || ''
        this.ruleForm.defenceType = this.data.defenceType || ''
        this.ruleForm.defenceDate = this.data.defenceDate || ''
        this.ruleForm.defenceRemark = this.data.defenceRemark || ''
        this.ruleForm.defenceResult = this.data.defenceResult || ''
        this.ruleForm.defenceTeacher = this.data.defenceTeacher || ''
        this.ruleForm.correctDate = this.data.correctDate || ''
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
                this.$message({ type: 'success', message: '修改成功!' })
              } else {
                this.$message({ type: 'error', message: '修改失败!' })
              }
              callBack(valid)
            }
            api.commonPageRequest(params, this.data.modelName, 'update').then(responseCallback)
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
