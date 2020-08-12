<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <div class="form-item">
        <div class="container">
          <el-form-item label="学号/身份证" prop="studentId" class="full-width">
            <el-input
              v-model="ruleForm.studentId"
              suffix-icon="el-icon-search"
              @keyup.enter.native="onSearch(ruleForm.studentId)"
              placeholder="请输入"
            ></el-input>
            <div class="stu-info-box" v-loading="loading">
              <div>
                <div class="title">学号</div>
                <div class="cont">{{ rows.studentNo || '' }}</div>
              </div>
              <div>
                <div class="title">性别</div>
                <div class="cont">{{ rows.sex ? (rows.sex === '1' ? '男' : '女') : '' }}</div>
              </div>
              <div>
                <div class="title">姓名</div>
                <div class="cont">{{ rows.realName || '' }}</div>
              </div>
              <div>
                <div class="title">证件号码</div>
                <div class="cont">{{ rows.certNo || '' }}</div>
              </div>
            </div>
          </el-form-item>
          <div class="select-box">
            <el-form-item prop="changeType" label="异动类型" class="select-width-240">
              <el-select v-model="ruleForm.changeType" placeholder="请选择">
                <el-option
                  v-for="(item, index) in noTestTypeList"
                  :key="index"
                  :label="item.dictName"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="changeReason" class="select-width-240" label="异动原因">
              <el-select v-model="ruleForm.changeReason" multiple collapse-tags clearable placeholder="请选择">
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
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.init()
    this.getCodeList()
  },
  watch: {
    dialogVisible(val) {
      val && this.init()
    }
  },
  methods: {
    init() {
      for (let key in this.ruleForm) {
        if (key === 'pictureUrl1') {
          this.ruleForm[key] = this.data.changePictureUrl || ''
        } else if (key === 'studentId') {
          this.ruleForm[key] = this.data.certNo || ''
          if (this.ruleForm[key]) {
            this.onSearch(this.ruleForm[key])
          } else {
            this.rows = {}
          }
        } else if (key === 'changeReason') {
          this.ruleForm[key] = !Array.isArray(this.data[key]) && this.data[key] ? [...this.data[key]] : []
        } else {
          this.ruleForm[key] = this.data[key] || ''
        }
      }
    },
    async onSearch(studentId) {
      if (!studentId) {
        this.rows = {}
        return
      }
      this.loading = true
      try {
        const res = await api.getQueryStudent({
          studentNoOrCertNo: this.ruleForm.studentId || studentId
        })
        this.rows = res.data || {}
        if (this.rows.organId) {
          const result = await api.getInfoList(this.rows.organId)
          this.courseList = result.data || []
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    async getCodeList() {
      const result1 = (await api.getSysDictList({ code: '0021' })) || {}
      const result2 = (await api.getSysDictList({ code: '0022' })) || {}
      this.noTestTypeList = result1.data || []
      this.noTestReasonList = result2.data || []
    },
    confirm(callBack) {
      this.$refs.addForm.validate(async valid => {
        const uploadRes = await this.$refs.upload.upload()
        if (uploadRes.code !== 200) {
          this.$message('图片上传失败！')
          return false
        }
        if (valid) {
          Object.assign(this.ruleForm, {
            pictureUrl1: uploadRes.data,
            studentId: this.rows.id
          })
          this.isEdit
            ? api.studentCchangeUpdate({ ...this.ruleForm, id: this.data.id })
            : api.studentCchangeSave(this.ruleForm)
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
        changeReason: [], // 原因
        changeType: '', // 类型
        pictureUrl1: ''
      },
      noTestTypeList: [],
      noTestReasonList: [],
      rows: {},
      rules: {
        changeReason: [
          { required: true, message: '请选择异动原因', trigger: 'change' }
        ],
        changeType: [
          { required: true, message: '请选择异动类型', trigger: 'change' }
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
.select-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/ .el-form-item__label {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
}
</style>
