<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
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
          <el-form-item label="考试批次" prop="planInfoId">
            <el-select v-model="ruleForm.planInfoId" placeholder="请选择">
              <el-option
                v-for="(item, index) in examPlanInfoList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡考方式" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择">
              <el-option
                v-for="(item, index) in inspectionTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="inspectorIds" label="巡考员">
            <el-select v-model="ruleForm.inspectorIds" multiple placeholder="请选择">
              <el-option
                v-for="item in inspectorList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
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
        inspectorList: [],
        ruleForm: {
          id: '',
          organId: '',
          inspectorIds: [],
          type: '',
          planInfoId: ''
        },
        rules: {
          organId: [{ required: true, message: '请选择学校', trigger: 'change' }],
          inspectorIds: [{ required: true, message: '请选择巡考员', trigger: 'change' }],
          type: [{ required: true, message: '请选择巡考方式', trigger: 'change' }],
          planInfoId: [{ required: true, message: '请选择考试批次', trigger: 'change' }]
        }
      }
    },
    computed: {
      examPlanInfoList() {
        return this.data.examPlanInfoList
      },
      inspectionTypeOptions() {
        return this.data.inspectionTypeOptions
      },
    },
    created() {
      if (!this.data.isAdd) {
        this.ruleForm.id = this.data.id || ''
        this.ruleForm.organId = this.data.organId || ''
        this.ruleForm.type = this.data.type || ''
        this.ruleForm.planInfoId = this.data.planInfoId || ''
        this.getInspectorList()
      }
    },
    methods: {
      getInspectorList() {
        api.inspectorListByOrganId({
          organId: this.ruleForm.organId,
          pageCurrent: 0,
          pageSize: 100
        }).then((res) => {
            this.inspectorList = res.data.map((t) => {
              return {
                label: t.realName,
                value: t.id
              }
            })
            const arr = []
            this.data.inspectorIds.forEach(t => {
              if (this.inspectorList.map(o => o.value).includes(t)) {
                arr.push(t)
              }
            })
            this.ruleForm.inspectorIds = arr
          })
      },
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            const params = {
              ...this.ruleForm,
              organId: this.data.organId
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
              api.addExamInspection(params).then(responseCallback)
            } else {
              api.updateExamInspection(params).then(responseCallback)
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
