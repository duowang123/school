<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <div class="stu-info-title">学生信息</div>
          <div class="stu-info-box">
            <div>
              <div class="title">学号</div>
              <div class="cont">{{ data.studentNo || '' }}</div>
            </div>
            <div>
              <div class="title">性别</div>
              <div class="cont">{{ data.sex ? (data.sex === '1' ? '男' : '女') : '' }}</div>
            </div>
            <div>
              <div class="title">姓名</div>
              <div class="cont">{{ data.realName || '' }}</div>
            </div>
            <div>
              <div class="title">证件号码</div>
              <div class="cont">{{ data.certNo || '' }}</div>
            </div>
          </div>
          <div class="stu-info-title">学分及费用</div>
          <div class="stu-info-box credit-box">
            <div>
              <div class="title">学分</div>
              <div class="cont">{{data.credit || ''}}</div>
            </div>
            <div>
              <div class="title">费用</div>
              <div class="cont">{{data.money || ''}}</div>
            </div>
          </div>
          <el-form-item label="审核结论" prop="course" class="select-width-240">
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
          <el-form-item label="不通过原因" v-if="ruleForm.approveStatus === '3'" class="select-width-240">
            <textarea v-model="ruleForm.notPassRemark1"></textarea>
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
  },
  data(vm) {
    return {
      ruleForm: {
        approveStatus: '',
        id: vm.data.id,
        notPassRemark1: ''
      },
      approveStatusList: [
        {
          name: '待审核',
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
    this.ruleForm.notPassRemark1 = this.data.notPassRemark1
  },
  methods: {
    handlerApproveStatus({ value }) {
      if(value !== '3') this.ruleForm.notPassRemark1 = ''
    },
    confirm(callBack) {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          api.cfApprove(this.ruleForm)
          callBack(valid)
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
.credit-box {
  width: 240px;
}
.stu-info-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}
.stu-info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  height: 88px;
  padding: 16px;
  margin-bottom: 24px;
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #666666;
    margin-bottom: 8px;
  }
  .cont {
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
