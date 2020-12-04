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
              <div class="cont">{{ data.sex ? (data.sex === '1' ? '男' : '女') : 'XX' }}</div>
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
          <el-form-item label="审核结论" prop="course" class="select-width-240">
            <el-select v-model="ruleForm.registerType" placeholder="请选择">
              <el-option
                v-for="(item, index) in registerTypeList"
                :key="index"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item -->
            <!-- label="不通过原因" -->
            <!-- v-if="ruleForm.approveStatus === '3'" -->
            <!-- class="select-width-240" -->
          <!-- > -->
            <!-- <textarea v-model="ruleForm.notPassRemark"></textarea> -->
          <!-- </el-form-item> -->
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
        registerType: '',
        id: vm.data.id,
        notPassRemark: ''
      },
      registerTypeList: [],
      rules: {
        registerType: [
          { required: true, message: '请选择审核结论', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    data(val) {
      this.ruleForm.registerType = val.registerType
    }
  },
  created() {
    api.listByCode({ code: '0012' }).then((res) => {
      this.registerTypeList = res.data || []
    })
    this.ruleForm.registerType = this.data.registerType
    // this.ruleForm.notPassRemark = this.data.notPassRemark
  },
  methods: {
    confirm(callBack) {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          api.studentApprove(this.ruleForm).then(res => {
            if (res.code === 200) {
              callBack(true)
            }
          })
        }
      })
    }
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
