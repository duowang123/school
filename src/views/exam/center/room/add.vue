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
      <el-select v-model="ruleForm.organId" filterable placeholder="请选择">
        <el-option
          v-for="(item,index) in teacherList"
          :key="index"
          @click.native="getOrganId(item)"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属考点" prop="testCerterId">
      <el-select v-model="ruleForm.testCerterId" filterable placeholder="请选择">
        <el-option
          v-for="(item,index) in openCenterLists"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="考场编号" prop="roomCode">
      <el-input v-model="ruleForm.roomCode"></el-input>
    </el-form-item>
    <el-form-item label="考场名称" prop="roomName">
      <el-input v-model="ruleForm.roomName"></el-input>
    </el-form-item>
    <el-form-item label="座位数" prop="seatNumber">
      <el-input v-model="ruleForm.seatNumber"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="2">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="ruleForm.address"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { saveExamRoom, updateExamRoom } from '../../api'
import selectMixin from '@/views/mixins/select.js'
import * as api from '../../api'
export default {
  name: 'Add',
  props: {
    data: Object,
  },
  mixins: [selectMixin],
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.organId = this.data.organId || ''
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.status = parseInt(this.data.status) || 0
      this.ruleForm.seatNumber = this.data.seatNumber.toString() || ''
      this.ruleForm.roomName = this.data.roomName || ''
      this.ruleForm.roomCode = this.data.roomCode || ''
      this.ruleForm.address = this.data.address || ''
      this.ruleForm.testCerterId =
        (this.openCenterOptions.filter(
          (s) => this.data.testCerterId === s.value
        ) || [])[0].value || ''
      // this.initProfessional()
    }
  },
  data() {
    return {
      ruleForm: {
        id: '',
        status: '',
        seatNumber: '',
        roomName: '',
        testCerterId: '',
        roomCode: '',
        address: '',
        organId: '',
      },
      openCenterLists: [],
      rules: {
        seatNumber: [
          { required: true, message: '请输入座位数', trigger: 'blur' },
          {
            pattern: '^[1-9]\\d*$',
            message: '只能是数字',
            trigger: 'blur',
          },
        ],
        organId: { required: true, message: '请选择', trigger: 'change' },
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        roomName: [
          { required: true, message: '请输入考场名称', trigger: 'blur' },
        ],
        roomCode: [
          { required: true, message: '请输入考场编号', trigger: 'blur' },
        ],
        testCerterId: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择启用状态', trigger: 'change' },
        ],
      },
    }
  },
  // computed: {
  // openCenterOptions() {
  // return this.data.openCenterList
  // },
  // },
  methods: {
    getOrganId(item) {
      this.ruleForm.testCerterId = ''
      this.initSelectOptions()
    },
    //从字典中获取下拉框数据
    initSelectOptions() {
      api
        .getOpenTestCenterList({ organId: this.ruleForm.organId })
        .then((res) => {
          this.openCenterLists = res.data.map((t) => {
            return {
              label: t.address,
              label: t.name,
              value: t.id,
            }
          })
        })
    },
    confirm(callBack) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
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
            saveExamRoom(params).then(responseCallback)
          } else {
            updateExamRoom(params).then(responseCallback)
          }
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.demo-ruleForm {
  padding: 0 20px;
}
</style>
