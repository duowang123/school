<template>
  <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
  >
    <el-form-item label="课程学习时长占比" prop="learnTimeProp">
      <el-input type="number" v-model.number="ruleForm.learnTimeProp" min="0" :max="100"/>
    </el-form-item>
    <el-form-item label="作业占比" prop="homeworkProp">
      <el-input type="number" v-model.number="ruleForm.homeworkProp" min="0" :max="100"/>
    </el-form-item>
    <el-form-item label="考试成绩占比" prop="scoreProp">
      <el-input type="number" v-model.number="ruleForm.scoreProp" min="0" max="100"/>
    </el-form-item>
  </el-form>
</template>

<script>
  import { updateCourseRatio, getCourseRatio } from '../api'
  export default {
    name: 'Ratio',
    props: {
      data: Object
    },
    data() {
      return {
        ruleForm: {
          homeworkProp: '',
          learnTimeProp: '',
          scoreProp: ''
        },
        rules: {
          homeworkProp: [{ required: true, message: '请输入', trigger: 'blur' }],
          learnTimeProp: [{ required: true, message: '请输入', trigger: 'blur' }],
          scoreProp: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getRatioData()
    },
    methods: {
      getRatioData() {
        getCourseRatio().then(res => {
          this.ruleForm = res.data
        })
      },
      confirm(callBack) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (this.ruleForm.homeworkProp + this.ruleForm.learnTimeProp + this.ruleForm.scoreProp !== 100) {
              this.$message.info('请输入正确的占比')
              return false
            }
            const params = {
              ...this.ruleForm
            }
            updateCourseRatio(params).then(res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '更新成功!' })
              } else {
                this.$message({ type: 'error', message: '更新失败!' })
              }
              callBack && callBack(valid)
            })
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
</style>
