<template>
  <div class="application attrStyle">
    <div class="stu-info-box" v-show="!data.batch">
      <div>
        <div class="title">学号</div>
        <div class="cont">{{ data.student.studentNo || '' }}</div>
      </div>
      <div>
        <div class="title">性别</div>
        <div class="cont">{{ data.student.sex ? (rows.sex === '1' ? '男' : '女') : '' }}</div>
      </div>
      <div>
        <div class="title">姓名</div>
        <div class="cont">{{ data.student.realName || '' }}</div>
      </div>
      <div>
        <div class="title">证件号码</div>
        <div class="cont">{{ data.student.certNo || '' }}</div>
      </div>
    </div>
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <div class="select-box">
            <el-form-item prop="creditStatus" label="学分审核">
              <el-select v-model="ruleForm.creditStatus" placeholder="请选择">
                <el-option
                    v-for="(item, index) in selectOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="paperStatus" label="论文审核">
              <el-select v-model="ruleForm.paperStatus" placeholder="请选择">
                <el-option
                    v-for="(item, index) in selectOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="graduationStatus" label="毕业审核结论">
              <el-select v-model="ruleForm.graduationStatus" placeholder="请选择">
                <el-option
                    v-for="(item, index) in selectOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import * as api from '../../api'

  export default {
    name: 'Examine',
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      },
    },
    created() {
      this.init()
    },
    watch: {
      dialogVisible(val) {
        val && this.init()
      },
    },
    data() {
      return {
        ruleForm: {
          creditStatus: '', // 学分审核
          graduationStatus: '', // 毕业审核结论
          paperStatus: '' // 论文审核
        },
        selectOption: [
          { label: '通过', value: '1' },
          { label: '不通过', value: '2' }
        ],
        noTestTypeList: [],
        noTestReasonList: [],
        rows: {},
        rules: {
          creditStatus: [
            { required: true, message: '请选择学分审核', trigger: 'blur' }
          ],
          paperStatus: [
            { required: true, message: '请选择论文审核', trigger: 'blur' }
          ],
          graduationStatus: [
            { required: true, message: '毕业审核结论', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init() {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.ruleForm = {
          creditStatus: '', // 学分审核
          graduationStatus: '', // 毕业审核结论
          paperStatus: '' // 论文审核
        }
      },
      async confirm(callBack) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const resCallback = (res) => {
              if (res.code === 200) {
                this.$message.success('审核结果已提交!')
                callBack(true)
              } else {
                callBack(false)
              }
            }
            if (this.data.batch) {
              const params = { ...this.ruleForm, ids: this.data.ids }
              api.batchApprove(params).then(resCallback)
            } else {
              const params = { ...this.ruleForm, id: this.data.student.id }
              api.graduateApprove(params).then(resCallback)
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
    .el-form-item {
      display: flex;
      flex-direction: column;
    }
    .el-form-item__label {
      width: auto !important;
      text-align: left;
    }
  }
  /deep/.el-popper {
    min-width: 240px !important;
  }
  .stu-info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f7fa;
    height: 88px;
    padding: 16px;
    margin-bottom: 24px;
    margin-top: 16px;
    .title {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      margin-bottom: 8px;
    }
    .cont {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
  .select-box {
    /deep/ .el-select {
      width: 500px;
      .el-input {
        width: 100%;
      }
    }
  }
  /deep/ .el-form-item__label {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  }
</style>
