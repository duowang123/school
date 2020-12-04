<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item>
            <stu-card :detail="data"></stu-card>
          </el-form-item>
          <el-form-item label="座位号" prop="seatSeq">
            <el-input v-model="ruleForm.seatSeq" placeholder="座位号" style="margin-bottom: 10px" />
          </el-form-item>
          <el-form-item label="准考证号" prop="examNo">
            <el-input v-model="ruleForm.examNo" placeholder="准考证号" style="margin-bottom: 10px" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注内容" v-model="ruleForm.remark">
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/ImgUpload'
  import * as api from '../../api'
  export default {
    components: {
      Upload
    },
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    data(vm) {
      return {
        loading: false,
        ruleForm: {
          id: '',
          seatSeq: '',
          examNo: '',
          remark: ''
        },
        rules: {
          seatSeq: [{ required: true, message: '请输入', trigger: 'blur' }],
          examNo: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.seatSeq = this.data.seatSeq || ''
        this.ruleForm.examNo = this.data.examNo || ''
        this.ruleForm.remark = this.data.remark || ''
      }
    },
    methods: {
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: (this.data.isAdd ? '添加' : '修改') + '成功!' })
              } else {
                this.$message({ type: 'error', message: (this.data.isAdd ? '添加' : '修改') + '失败!' })
              }
              callBack(valid)
            }
            api.examCourseUpdate(this.ruleForm).then(responseCallback)
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
