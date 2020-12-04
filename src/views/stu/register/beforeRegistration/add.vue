<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <div class="stu-info-title">学生信息</div>
          <div class="stu-info-box">
            <div>
              <div class="title">考生号</div>
              <div class="cont">{{ data.testNo || 'xx' }}</div>
            </div>
            <div>
              <div class="title">性别</div>
              <div class="cont">{{ data.sex ? (data.sex === '1' ? '男' : '女') : 'XX' }}</div>
            </div>
            <div>
              <div class="title">姓名</div>
              <div class="cont">{{ data.realName || 'xx' }}</div>
            </div>
            <div>
              <div class="title">证件号码</div>
              <div class="cont">{{ data.certNo || 'xx' }}</div>
            </div>
            <div>
              <div class="title">学校:</div>
              <div class="cont">{{ data.organName || '' }}</div>
            </div>
            <div>
              <div class="title">教学点:</div>
              <div class="cont">{{ data.schoolOrganName || '' }}</div>
            </div>
          </div>
          <el-form-item label="审核结论" prop="approveStatus" class="select-width-240">
            <el-select v-model="ruleForm.approveStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in approveStatusList"
                :key="index"
                @click.native="handlerApproveStatus(item)"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="不通过原因"
            v-if="ruleForm.approveStatus === '3'"
            class="select-width-240"
          >
            <textarea v-model="ruleForm.notPassRemark"></textarea>
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
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data(vm) {
    return {
      ruleForm: {
        approveStatus: '',
        id: vm.data.id,
        notPassRemark: '',
      },
      approveStatusList: [
        {
          name: '待审批',
          value: '1',
        },
        {
          name: '通过',
          value: '2',
        },
        {
          name: '不通过',
          value: '3',
        },
      ],
      rules: {
        approveStatus: [
          { required: true, message: '请选择审核结论', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.ruleForm.approveStatus = this.data.approveStatus
    this.ruleForm.notPassRemark = this.data.notPassRemark
  },
  methods: {
    handlerApproveStatus({ value }) {
      if (value !== '3') this.ruleForm.notPassRemark = ''
    },
    confirm(callBack) {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          const resCallBack = (res) => {
            if (res.code === 200) {
              this.$message.success(
                (this.isEdit ? '数据更新' : '数据添加') + '成功!'
              )
              callBack(valid)
            } else {
              this.$message.error(
                (this.isEdit ? '数据更新' : '数据添加') + '失败!'
              )
            }
          }
          api.registerChangeApprove(this.ruleForm).then(resCallBack)
        }
      })
    },
  },
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
/deep/ .el-popper {
  width: 240px !important;
}
.application /deep/ {
  .el-form-item {
    display: flex;
    flex-direction: column;
  }
  .el-form-item__label {
    width: auto !important;
    text-align: left;
  }
}
.stu-info-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  margin-top: 32px;
}
.stu-info-box {
  display: flex;
  justify-content: space-between;
  align-items: left;
  background-color: #f5f7fa;
  padding: 16px;
  flex-direction: column;
  margin-bottom: 24px;
  margin-top: 16px;
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #666666;
    margin-bottom: 8px;
    display: inline-flex;
  }
  .cont {
    display: inline-flex;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
  }
}
/deep/ .el-form-item__label {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
}
textarea {
  width: 100%;
  height: 120px;
  resize: none;
}
</style>

<style lang="scss" scoped>
.el-select-dropdown__wrap {
  margin-bottom: 0 !important;
}
</style>
