<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
    label-position="top"
  >
    <el-form-item label="教学点" prop="organId">
      <el-select :disabled="!data.isAdd" v-model="ruleForm.organId" placeholder="请选择">
        <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <!--      <el-input :disabled="!data.isAdd" v-model="ruleForm.name" placeholder="考点名称"></el-input>-->
    </el-form-item>
    <el-form-item label="考点地址" prop="address">
      <el-input
        :disabled="!data.isEdit && !data.isAdd"
        v-model="ruleForm.address"
        placeholder="请输入考点地址"
      ></el-input>
    </el-form-item>
    <el-form-item v-if="!data.isEdit && !data.isAdd" label="状态" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="2">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        :disabled="!data.isEdit && !data.isAdd"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="ruleForm.remark"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  testCenterAdd,
  testCenterUpdate,
  testCenterOpen,
  testCenterClose,
} from '../../api'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Add',
  props: {
    data: Object,
  },
  mixins: [selectMixin],
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.organId = this.data.organId || ''
      this.ruleForm.remark = this.data.remark || ''
      this.ruleForm.address = this.data.address || ''
      this.ruleForm.status = parseInt(this.data.status) || 0
    }
  },
  data() {
    return {
      ruleForm: {
        id: '',
        organId: '',
        address: '',
        remark: '',
        status: '',
      },
      rules: {
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
      },
    }
  },
  methods: {
    confirm(callBack) {
      const params = {
        ...this.ruleForm,
      }
      const responseCallback = (res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: (this.data.isEdit ? '修改' : '操作') + '成功!',
          })
        } else {
          this.$message({
            type: 'error',
            message: (this.data.isEdit ? '修改' : '操作') + '失败!',
          })
        }
        callBack(true)
      }
      if (!this.data.isEdit && !this.data.isAdd) {
        parseInt(params.status) === 1
          ? testCenterOpen(params).then(responseCallback)
          : testCenterClose(params).then(responseCallback)
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.data.isAdd) {
              testCenterAdd(params).then(responseCallback)
            } else {
              testCenterUpdate(params).then(responseCallback)
            }
          }
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.demo-ruleForm {
  padding: 0 20px;
}
</style>
