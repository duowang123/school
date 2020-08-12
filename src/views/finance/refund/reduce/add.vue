<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学生">
            <el-row :gutter="24">
              <el-col :span="8">
                <div>学号：{{ data.studentNo || 'xx' }}</div>
                <div>性别: {{ data.sex ? (data.sex === '1' ? '男' : '女') : 'XX' }}</div>
              </el-col>
              <el-col :span="16">
                <div>
                  <div>姓名{{ data.realName || 'xx' }}</div>
                  <div>证件号码：{{ data.certNo || 'xx' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="schoolYear" label="学年">
            <el-input v-model="data.schoolYear" placeholder="学年" disabled style="margin-bottom: 10px" />
          </el-form-item>
          <el-form-item prop="credit" label="学分">
            <el-input v-model="data.credit" placeholder="学号" disabled style="margin-bottom: 10px" />
          </el-form-item>
          <el-form-item prop="money" label="费用">
            <el-input v-model="data.money" placeholder="费用" disabled></el-input>
          </el-form-item>
          <el-form-item label="审核结论" prop="approveStatus">
            <el-select v-model="data.approveStatus" disabled placeholder="请选择">
              <el-option
                v-for="(item, index) in approveStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="财务确认" prop="approveStatus">
            <el-select v-model="ruleForm.approveStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in approveStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.notPassRemark2">
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import * as api from '../api'
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
          approveStatus: '',
          notPassRemark2: '',
          id: vm.data.id
        },
        approveStatusList: [
          // {
          // name: '待审核',
          // value: '1'
          // },
          {
            name: '通过',
            value: '2'
          },
          {
            name: '不通过',
            value: '3'
          }
        ],
        rules: {
          approveStatus: [
            { required: true, message: '请选择财务确认', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '操作成功!' })
              } else {
                this.$message({ type: 'error', message: '操作失败!' })
              }
              callBack(valid)
            }
            api.cfApprove(this.ruleForm).then(responseCallback)
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
