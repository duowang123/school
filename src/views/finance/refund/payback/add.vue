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
            <el-row v-show="rows.realName" :gutter="24" v-loading="loading">
              <el-col :span="10">
                <div>学号：{{ rows.studentNo || 'xx' }}</div>
                <div>性别：{{ rows.sex ? (rows.sex === '1' ? '男' : '女') : 'XX' }}</div>
              </el-col>
              <el-col :span="14">
                <div>
                  <div>姓名：{{ rows.realName || 'xx' }}</div>
                  <div>证件号码：{{ rows.certNo || 'xx' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="缴费年度" prop="payYear">
            <el-select class="selectWidth" v-model="ruleForm.payYear" placeholder="请选择">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退费项目" prop="returnType">
            <el-select class="selectWidth" v-model="ruleForm.returnType" placeholder="请选择">
              <el-option
                v-for="item in returnTypeOptions"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="returnMoney" label="退费金额">
            <el-input v-model="ruleForm.returnMoney" placeholder="费用"></el-input>
          </el-form-item>
          <el-form-item label="扫描件" >
            <upload :url="ruleForm.pictureUrl" class="upload-icon" ref="upload" />
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
      ...mapGetters(['yearAndSemester']),
      schoolYearOptions() {
        return this.yearAndSemester.schoolYears
      },
      returnTypeOptions() {
        return this.data.returnTypeOptions
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
      async  confirm(callBack) {
        const uploadRes = await this.$refs.upload.upload()
        console.log('uploadRes', uploadRes)
        if (uploadRes.code !== 200) {
          this.$message('图片上传失败！')
          return false
        }
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            if(!this.rows.id) return this.$message.warning('请先搜索学号/证件号码!')
            const params = {
              ...this.ruleForm,
              organId: this.data.organId,
              pictureUrl: uploadRes.data
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
            api.addStudentPayback(params).then(responseCallback)
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
          payYear: '', // 缴费年度：dict0014
          returnType: '',
          returnMoney: '',
          pictureUrl: ''
        },
        rows: {},
        rules: {
          studentId: [{ required: true, message: '请输入学生学号查询', trigger: 'blur' }],
          returnMoney: [{ required: true, message: '请输入退费金额', trigger: 'blur' },
          //  {
          //   pattern: /^[0-9]+\.[0-9]+$/,
          //   message: '请输入正确金额',
          //   trigger: 'blur'
          // }
          ],
          payYear: [
            { required: true, message: '请选择缴费年度', trigger: 'change' }
          ],
          pictureUrl: [
            { required: true, message: '请选上传扫描附件', trigger: 'change' }
          ],
          returnType: [
            { required: true, message: '请选择退费项目', trigger: 'change' }
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
