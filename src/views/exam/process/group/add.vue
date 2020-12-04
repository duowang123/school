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
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考辅人员" prop="coachId">
            <el-select v-model="ruleForm.coachId" placeholder="请选择">
              <el-option
                v-for="(item, index) in coachList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="station" label="岗位">
            <el-select v-model="ruleForm.station" placeholder="请选择">
              <el-option
                v-for="item in stationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as api from '../../api'
import { isvalidMobile } from '@/utils/validate'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data(vm) {
    const testMobile = (rule, value, callback) => {
      const validRes = isvalidMobile(value)
      if (!validRes) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        id: '',
        coachId: '',
        planInfoId: '',
        station: '',
        phone: '',
        organId: ''
      },
      rules: {
        planInfoId: [
          { required: true, message: '请选择考试计划', trigger: 'change' }
        ],
        coachId: [
          { required: true, message: '请选择考辅人员', trigger: 'change' }
        ],
        station: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        phone: { validator: testMobile, trigger: 'blur' },
        organId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      examPlanInfoList: []
    }
  },
  computed: {
    stationOptions() {
      return this.data.stationOptions
    },
    coachList() {
      return this.data.coachList
    }
  },
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.organId = this.data.organId || ''
      this.ruleForm.coachId = this.data.coachId || ''
      this.ruleForm.station = this.data.station || ''
      this.ruleForm.planInfoId = this.data.planInfoId || ''
      this.ruleForm.phone = this.data.phone || ''
    }
    this.getExamPlanInfoList()
  },
  methods: {
    change(val) {
      this.getExamPlanInfoList()
    },
    getExamPlanInfoList() {
      if (this.ruleForm.organId) {
        api.examPlanInfoList({ organId: this.ruleForm.organId }).then((res) => {
          this.examPlanInfoList = res.data.map((t) => {
            return {
              label: t.planName,
              value: t.id
            }
          })
        })
      }
    },
    confirm(callBack) {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm
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
            api.addExamGroup(params).then(responseCallback)
          } else {
            api.updateExamGroup(params).then(responseCallback)
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
