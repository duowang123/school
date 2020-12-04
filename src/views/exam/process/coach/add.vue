<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
    label-position="top"
  >
    <el-form-item label="学校" prop="organId">
      <el-select placeholder="请选择" v-model="ruleForm.organId">
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item.id"
          v-for="item in schoolOrgansList"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="姓名" prop="realName">
      <el-input v-model="ruleForm.realName"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="ruleForm.sex">
        <el-radio class="form-item-radio" label="1">男</el-radio>
        <el-radio class="form-item-radio" label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="联系电话" prop="phone">
      <el-input v-model="ruleForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="职称/职务" prop="job">
      <el-input v-model="ruleForm.job"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="2">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
  import { addExamCoach, updateExamCoach } from '../../api'

  export default {
    name: 'Add',
    props: {
      data: Object
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.organId = this.data.organId || ''
        this.ruleForm.status = parseInt(this.data.status) || 0
        this.ruleForm.realName = this.data.realName || ''
        this.ruleForm.sex = this.data.sex || ''
        this.ruleForm.phone = this.data.phone || ''
        this.ruleForm.job = this.data.job || ''
        // this.initProfessional()
      }
    },
    data() {
      return {
        ruleForm: {
          id: '',
          organId: '',
          status: '',
          sex: '',
          realName: '',
          phone: '',
          job: ''
        },
        rules: {
          organId: [{ required: true, message: '请选择学校', trigger: 'change' }],
          realName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
          job: [{ required: true, message: '请输入职称/职务', trigger: 'change' }],
          phone: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
          sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
          status: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
        }
      }
    },
    methods: {
      confirm(callBack) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...this.ruleForm
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
              addExamCoach(params).then(responseCallback)
            } else {
              updateExamCoach(params).then(responseCallback)
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
</style>
