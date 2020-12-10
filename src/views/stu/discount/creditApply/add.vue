<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item class="full-width" label="学号/证件号码" prop="studentId">
            <el-input
              v-model="ruleForm.studentId"
              suffix-icon="el-icon-search"
              @keyup.enter.native="onSearch"
              placeholder="请输入"
            ></el-input>
            <stu-card :detail="rows"></stu-card>
          </el-form-item>
          <div class="select-box">
            <el-form-item prop="credit" label="学分" class="select-width-240">
              <el-input v-model="ruleForm.credit" placeholder="学分"></el-input>
            </el-form-item>
            <el-form-item prop="money" label="费用" class="select-width-240">
              <el-input v-model="ruleForm.money" placeholder="费用"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="扫描件" prop="pictureUrl">
            <upload class="upload-icon" ref="upload" :url="ruleForm.pictureUrl1" />
          </el-form-item>
          <div class="select-box">
            <el-form-item prop="schoolYear" label="学年" class="select-width-240">
              <el-select v-model="ruleForm.schoolYear" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :key="index"
                  :value="item.value"
                  v-for="(item, index) in schoolYearOptions"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="saleReason" label="减免原因" class="select-width-240">
              <el-select v-model="ruleForm.saleReason" placeholder="请选择">
                <el-option
                  v-for="(item, index) in courseTypeList"
                  :key="index"
                  :label="item.dictName"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item prop="account" label="描述">
            <textarea name v-model="ruleForm.remark" class="text-box" cols="30" rows="10"></textarea>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/ImgUpload'
import * as api from '../api'
import { mapGetters } from 'vuex'
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
    ...mapGetters(['schoolYearOptions'])
  },
  methods: {
    async onSearch() {
      this.loading = true
      try {
        const res = await api.getQueryStudent({
          studentNoOrCertNo: this.ruleForm.studentId
        })
        this.rows = res.data || {}
        if (this.rows.organId) {
          const result = await api.getInfoList(this.rows.organId)
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    async getCodeList() {
      const result2 = (await api.getSysDictList({ code: '0030' })) || {}
      this.courseTypeList = result2.data || []
    },
    confirm(callBack) {
      this.$refs.addForm.validate(async valid => {
        const uploadRes = await this.$refs.upload.upload()
        console.log('uploadRes', uploadRes)
        if (uploadRes.code !== 200) {
          this.$message('图片上传失败！')
          return false
        }
        if (valid) {
          if(!this.rows.id) return this.$message.warning('请先搜索学号/证件号码!')
          Object.assign(this.ruleForm, {
            pictureUrl1: uploadRes.data,
            studentId: this.rows.id
          })
          api.studentCreditSaleSave(this.ruleForm).then(res => {
            if (res.code === 200) {
              callBack(true)
            }
          })
        }
      })
    }
  },
  data() {
    const pictureValid = (rule, val, callback) => {
      if (this.$refs.upload.file) {
        callback()
      } else {
        callback(new Error('请选择扫描件'))
      }
    }
    return {
      loading: false,
      ruleForm: {
        credit: '', // 学分
        remark: '',
        studentId: '', // 学生id
        saleReason: '', // 原因
        pictureUrl1: '',
        schoolYear: '',
        money: ''
      },
      courseTypeList: [],
      rows: {},
      rules: {
        credit: [{ required: true, message: '请输入学分', trigger: 'blur' }],
        money: [{ required: true, message: '请输入学费', trigger: 'blur' }],
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        pictureUrl: [
          { validator: pictureValid, trigger: 'blur' }
        ],
        saleReason: [
          { required: true, message: '请选择减免原因', trigger: 'change' }
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
  .el-form-item {
    display: flex;
    flex-direction: column;
  }
  .el-form-item__label {
    width: auto !important;
    text-align: left;
  }
}
.select-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stu-info-title{
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}
.credit-box{
  width: 240px;
}
.stu-info-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  height: 88px;
  padding: 16px;
  margin-top: 24px;
  .title {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    margin-bottom: 8px;
  }
  .cont{
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
  }
}
/deep/ .el-form-item__label{
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
}
.upload-icon{
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #333333;
}
.text-box{
  width: 504px;
  height: 72px;
}
</style>
