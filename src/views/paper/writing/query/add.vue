<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学号">
            <div>{{ data.studentNo || '--' }}</div>
          </el-form-item>
          <el-form-item label="姓名">
            <div>{{ data.realName || '--' }}</div>
          </el-form-item>
          <el-form-item label="初稿评语" prop="firstRemark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入初稿评语" v-model="ruleForm.firstRemark">
            </el-input>
          </el-form-item>
          <el-form-item label="初稿成绩" prop="firstResult">
            <el-select v-model="ruleForm.firstResult" placeholder="请选择">
              <el-option
                v-for="item in resultStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终稿评语" prop="lastRemark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入初稿评语" v-model="ruleForm.lastRemark">
            </el-input>
          </el-form-item>
          <el-form-item label="终稿成绩" prop="lastResult">
            <el-select v-model="ruleForm.lastResult" placeholder="请选择">
              <el-option
                v-for="item in resultStatusList"
                :key="item.value"
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
        ruleForm: {
          id: '',
          firstRemark: '',
          firstResult: '',
          lastRemark: '',
          lastResult: ''
        },
        rules: {
          firstResult: [{ required: true, message: '请选择', trigger: 'change' }],
          firstRemark: [{ required: true, message: '请输入', trigger: 'blur' }],
          lastResult: [{ required: true, message: '请选择', trigger: 'change' }],
          lastRemark: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    computed: {
      resultStatusList() {
        return this.data.resultStatusList
      }
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.firstRemark = this.data.firstRemark || ''
        this.ruleForm.firstResult = this.data.firstResult || ''
        this.ruleForm.lastRemark = this.data.lastRemark || ''
        this.ruleForm.lastResult = this.data.lastResult || ''
      }
    },
    methods: {
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
