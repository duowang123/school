<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item class="full-width" label="学号/证件号码" prop="studentId">
            <el-input
              v-model="ruleForm.studentId"
              suffix-icon="el-icon-search"
              @keyup.enter.native="onSearch(ruleForm.studentId)"
              placeholder="请输入"
            ></el-input>
            <div class="stu-info-box" v-loading="loading">
              <div>
                <div class="title">学号</div>
                <div class="cont">{{ rows.studentNo }}</div>
              </div>
              <div>
                <div class="title">性别</div>
                <div class="cont">{{ rows.sex ?(rows.sex === '1' ? '男' : '女') : '' }}</div>
              </div>
              <div>
                <div class="title">姓名</div>
                <div class="cont">{{ rows.realName }}</div>
              </div>
              <div>
                <div class="title">证件号码</div>
                <div class="cont">{{ rows.certNo }}</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="申请课程" prop="courseId" class="full-width">
            <el-select v-model="ruleForm.courseId" placeholder="请选择">
              <el-option
                v-for="(item, index) in courseList"
                :key="index"
                :label="item.courseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="select-box">
            <el-form-item prop="noTestType" label="免修免考类型" class="select-width-240">
              <el-select v-model="ruleForm.noTestType" placeholder="请选择">
                <el-option
                  v-for="(item, index) in noTestTypeList"
                  :key="index"
                  :label="item.dictName"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="noTestReason" label="免修免考原因" class="select-width-240">
              <el-select v-model="ruleForm.noTestReason" placeholder="请选择">
                <el-option
                  v-for="(item, index) in noTestReasonList"
                  :key="index"
                  :label="item.dictName"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="扫描件">
            <upload class="upload-icon" ref="upload" :url="ruleForm.pictureUrl1" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/ImgUpload'
import * as api from '../api'
export default {
  name: 'Attr',
  components: {
    Upload
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    organId: {
      type: String
    }
  },
  created() {
    this.getCodeList()
  },
  methods: {
    async onSearch(studentId) {
      if (!studentId) {
        this.rows = {}
        return
      }
      this.loading = true
      try {
        const res = await api.getQueryStudent({
          studentNoOrCertNo: this.ruleForm.studentId
        })
        this.rows = res.data || {}
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    async getCodeList() {
      const result1 = (await api.getSysDictList({ code: '0027' })) || {}
      const result2 = (await api.getSysDictList({ code: '0028' })) || {}
      this.noTestTypeList = result1.data || []
      this.noTestReasonList = result2.data || []
      if (this.organId) {
        const result3 = await api.getInfoList(this.organId)
        this.courseList = result3.data || []
      }
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
          Object.assign(this.ruleForm, {
            pictureUrl1: uploadRes.data,
            studentId: this.rows.id
          })
          api.studentNoTest(this.ruleForm)
          callBack(valid)
        }
      })
    }
  },
  data() {
    return {
      loading: false,
      ruleForm: {
        studentId: '', // 学生id
        courseId: '', // 课程id
        noTestReason: '', // 原因
        noTestType: '', // 类型
        pictureUrl1: ''
      },
      courseList: [],
      noTestTypeList: [],
      noTestReasonList: [],
      rows: {},
      rules: {
        courseId: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        noTestType: [
          { required: true, message: '请选择免修免考类型', trigger: 'change' }
        ],
        noTestReason: [
          { required: true, message: '请选择免修免考原因', trigger: 'change' }
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
.select-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stu-info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  height: 88px;
  padding: 16px;
  margin-top: 24px;
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
</style>
