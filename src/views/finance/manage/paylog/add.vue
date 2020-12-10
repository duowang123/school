<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学号/证件号码" prop="studentId">
            <el-input
              v-model="ruleForm.studentId"
              suffix-icon="el-icon-search"
              @keyup.enter.native="onSearch"
              placeholder="学号/证件号码"
            ></el-input>
            <stu-card :detail="rows" v-loading="loading"></stu-card>
          </el-form-item>
          <el-form-item label="缴费方式" prop="payType">
            <el-select class="selectWidth" v-model="ruleForm.payType" placeholder="请选择">
              <el-option
                v-for="item in payTypeOptions"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缴费年度" prop="schoolYear">
            <el-select class="selectWidth" v-model="ruleForm.schoolYear" placeholder="请选择">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缴费单号" prop="ticketNum">
            <el-input v-model="ruleForm.ticketNum" placeholder="缴费单号"></el-input>
          </el-form-item>
          <el-form-item label="缴费金额" prop="payMoney">
            <el-input v-model="ruleForm.payMoney" placeholder="缴费金额"></el-input>
          </el-form-item>
          <el-form-item prop="payTime" label="缴纳时间">
            <el-date-picker
              class="flex-2"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="ruleForm.payTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收费人" prop="receiveUser">
            <el-input v-model="ruleForm.receiveUser" placeholder="收费人"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/ImgUpload'
  import * as api from '../api'
  import {mapGetters} from "vuex";
  export default {
    name: 'Attr',
    components: {
      Upload
    },
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    created() {
      this.getCodeList()
    },
    computed: {
      ...mapGetters(['schoolYearOptions']),
      payTypeOptions() {
        return this.data.payTypeOptions
      }
    },
    methods: {
      async onSearch() {
        this.loading = true
        try {
          const res = await api.getQueryStudent({
            studentNoOrCertNo: this.ruleForm.studentId
          })
          this.rows = res.data || {}
          // if (this.rows.organId) {
          //   const result = await api.getInfoList(this.rows.organId)
          // }
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      async getCodeList() {
      },
      confirm(callBack) {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            if(!this.rows.id) return this.$message.warning('请先搜索学号/证件号码!')
            const params = {
              ...this.ruleForm,
              organId: this.data.organId
            }
            Object.assign(params, {
              studentId: this.rows.id
            })
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '添加成功!' })
              } else {
                this.$message({ type: 'error', message: '添加失败!' })
              }
              callBack(valid)
            }
            api.addPayLog(params).then(responseCallback)
          }
        })
      }
    },
    data() {
      return {
        loading: false,
        ruleForm: {
          remark: '',
          studentId: '', // 学生id
          schoolYear: '', // 学年
          payType: '',
          ticketNum: '',
          payTime: '',
          payMoney: null,
          receiveUser: null // 录入人
        },
        rows: {},
        rules: {
          studentId: [{ required: true, message: '请输入学生学号查询', trigger: 'blur' }],
          payMoney: [{ required: true, message: '请输入缴费金额', trigger: 'blur' },
          // {
          //   pattern: /^[0-9]+$/,
          //   message: '请输入正确金额',
          //   trigger: 'blur'
          // }
          ],
          ticketNum: [{ required: true, message: '请输入缴费编号', trigger: 'blur' }],
          payTime: [{ required: true, message: '请输入缴费时间', trigger: 'blur' }],
          schoolYear: [
            { required: true, message: '请选择缴费年度', trigger: 'change' }
          ],
          payType: [
            { required: true, message: '请选择缴费方式', trigger: 'change' }
          ]
        }
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
    textarea {
      width: 100%;
    }
  }
</style>
