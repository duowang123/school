<template>
  <div>
     <el-drawer
      title="异动申请"
      :visible.sync="openStatus"
      ref="openStatus"
      direction="rtl"
      size="380px"
      :before-close="closeDia"
      :wrapperClosable="false"
    >
      <el-scrollbar id="scroll-box">
        <div class="drawer-content">
          <div class="content-container" style="margin-left: 24px">
            <el-form :rules="rules" :model="addData" ref="addForm" label-width="0">
              <div class="OEP-form-item">
                <div class="container">
                  <p class="label">
                    学号/证件号码
                    <span class="required-icon">*</span>
                  </p>
                  <el-form-item prop="studentId">
                    <el-input
                      v-model="addData.studentId"
                      prefix-icon="el-icon-search"
                      placeholder="学号/证件号码"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="plan-detail">
                  <div class="content">
                    <p class="item-left">
                      <span>学号</span>
                      <span>{{addData.studentNo}}</span>
                    </p>
                    <p class="item-right">
                      <span>姓名</span>
                      <span>{{addData.realName}}</span>
                    </p>
                  </div>
                  <div class="content">
                    <p class="item-left">
                      <span>性别</span>
                      <span>{{addData.sex}}</span>
                    </p>
                    <p class="item-right">
                      <span>证件号码</span>
                      <span>{{addData.certNo}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="OEP-form-item">
                <div class="container">
                  <p class="label">
                    异动类型
                    <span class="required-icon">*</span>
                  </p>
                  <el-form-item prop="changeType">
                    <el-select
                      class="form-item-input"
                      v-model="addData.changeType"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, i) in typeItem"
                        :key="i"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="OEP-form-item">
                <div class="container">
                  <p class="label">
                    异动原因
                    <span class="required-icon">*</span>
                  </p>
                  <el-form-item prop="changeReason">
                    <el-select
                      class="form-item-input"
                      v-model="addData.changeReason"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, i) in reasonItem"
                        :key="i"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="upload-file">
                  <p class="title">
                    扫描件
                    <span class="required-icon">*</span>
                    <i class="el-icon-warning-outline el-icon--right"></i>
                  </p>
                  <img-list class="upload-icon" ref="imgList" :imgs="fileList" />
                </div>
              </div>
              <!-- <div>
              <div>退学申请表</div>
              <div>休学申请表</div>
              <div>复学申请表</div>
              <div>转中心申请表</div>
              <div>转专业申请表</div>
              </div>-->
              <!-- <div>填写打印后盖章上传扫描件,学生签字需手写</div> -->
            </el-form>
          </div>
          <div class="drawer-footer">
            <el-button type="primary" @click="addDataSubmit()">申请</el-button>
            <el-button @click="closeDia">取 消</el-button>
          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '@/api/organ'
import ImgList from '@/components/ImgList'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ImgList
  },
  watch: {
    dialogVisible (val) {
      this.openStatus = val
      if (val) {
        this.addData = this.rowData
      }
    }
  },
  data() {
    return {
      openStatus: this.dialogVisible,
      typeItem: [
        { value: '退学', label: '退学' },
        { value: '休学', label: '休学' },
        { value: '复学', label: '复学' },
        { value: '转专业', label: '转专业' },
        { value: '转学习中心', label: '转学习中心' }
      ],
      reasonItem: [
        { value: '学生本人申请', label: '学生本人申请' },
        { value: '学费已交', label: '学费已交' },
        { value: '复前置学历清查未通过', label: '复前置学历清查未通过' },
        { value: '学习中心与学生失联', label: '学习中心与学生失联' },
        { value: '转学习中心', label: '转学习中心' },
        { value: '已故', label: '已故' },
        { value: '欠费', label: '欠费' },
        {
          value: '我院网教专科毕业学生续读网教专升本',
          label: '我院网教专科毕业学生续读网教专升本'
        },
        { value: '其他', label: '其他' }
      ],
      rules: {
        id: [{ required: true, message: '请选择学号/证件号码', trigger: 'blur' }],
        type: [{ required: true, message: '请选择异动类型', trigger: 'blur' }],
        reason: [{ required: true, message: '请选择异动原因', trigger: 'blur' }]
      },
      fileList: [],
      addData: {}
    }
  },
  created() {
    this.addData = this.rowData
  },
  methods: {
    resetData() {
      this.addData = {
        changeReason: '',
        changeType: '',
        studentId: '',
        studentNo: '',
        realName: '',
        sex: '',
        certNo: ''
      }
      this.fileList = []
    },
    closeDia() {
      this.resetData()
      this.$emit('closeDia', {}, false)
    },
    addDataSubmit() {
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          return void '验证失败'
        }
        if (this.isAdd) {
          this.addSave()
        } else {
          this.updateSave()
        }
      })
    },
    async uploadFiles() {
      // 上传图片
      const list = await this.$refs.imgList.uploadImg()
      return list.join('&')
    },
    async addSave() {
      const url = await this.uploadFiles()
      if (!url) {
        this.$message({
          showClose: true,
          message: '图片上传失败',
          type: 'error'
        })
        return false
      }
      this.addData.pictureUrl1 = url
      api.addStudentChange(this.addData).then(res => {
        this.resetData()
        if (res.code === 200) {
          this.$message({
            message: '数据更新成功',
            type: 'success'
          })
          this.init()
        } else {
          this.$message({
            message: '数据更新失败',
            type: 'error'
          })
        }
      })
    },
    async updateSave() {
      const url = await this.uploadFiles()
      if (!url) {
        this.$message({
          showClose: true,
          message: '图片上传失败',
          type: 'error'
        })
        return false
      }
      const updateObj = {
        changeReason: this.addData.changeReason,
        changeType: this.addData.changeType,
        id: this.addData.id,
        pictureUrl1: url,
        studentId: this.addData.studentId
      }
      api.editStudentChange(updateObj).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '数据更新成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '数据更新失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  #scroll-box {
    height: 100%;
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .content-container {
    flex: 1;
    .plan-detail {
      width: 330px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      background-color: #c0c0c0;
      color: #333;
      .content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 2px 0;
        .item-left {
          width: 35%;
          font-size: 14px;
          line-height: 14px;
        }
        .item-right {
          width: 65%;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
    .upload-file {
      margin-bottom: 20px;
      .title {
        height: 24px;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 24px;
        margin: 0 0 8px 0;
      }
      /deep/ .el-icon-warning-outline:before {
        color: #8c939d;
      }
      /deep/ .el-upload--picture-card {
        width: 200px;
        height: 108px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /deep/.el-upload--picture-card i {
        font-size: 32px;
      }
    }
  }
  .drawer-footer {
    margin-left: 24px;
    height: 72px;
    line-height: 72px;
  }
}
.OEP-form-item {
  margin-bottom: 0;
}
</style>
