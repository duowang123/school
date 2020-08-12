<template>
  <div>
    <el-drawer
      title
      ref="InfoDrawer"
      :visible.sync="openStatus"
      direction="rtl"
      size="1348px"
      :before-close="closeDia"
    >
      <div class="drawer-content">
        <div class="content-container" style="margin-left: 24px">
          <el-scrollbar id="scroll-box">
            <div>个人信息</div>
            <div class="info-box">
              <div class="row-left">
                <!--左侧信息-->
                <div class="row-left-box" v-for="(item, i) in infoLeft" :key="i">
                  <div class="title">{{item.label}}</div>
                  <div class="cont-left" v-if="!!rowData.length">{{ rowData[item.key] }}</div>
                </div>
              </div>
              <div class="row-right">
                <div class="row-box">
                  <div class="title">入学季</div>
                  <div class="cont-right">2020</div>
                </div>
                <div class="row-right-box">
                  <!--证件右侧图片-->
                  <div class="info-part">
                    <div class="info-part-box" v-for="(item, i) in infoRight1" :key="i">
                      <div class="title">{{item.label}}</div>
                      <div class="cont-right" v-if="!!rowData.length">{{ rowData[item.key] }}</div>
                    </div>
                  </div>
                  <div class="img-part">
                    <!-- <img-list class="upload-icon" ref="imgList" :imgs="fileList" /> -->
                  </div>
                </div>
                <div class="row-right-box">
                  <div class="info-part">
                    <div class="info-part-tel">
                      <div class="title">紧急联系电话</div>
                      <div class="cont-addr">15298545686</div>
                    </div>
                    <div class="info-part-addr">
                      <div class="title">邮寄地址</div>
                      <div class="cont-addr">湖南长沙</div>
                    </div>
                  </div>
                </div>
                <div class="bottom-box">
                  <div class="info-part">
                    <div class="info-part-bott" v-for="(item, i) in infoRight2" :key="i">
                      <div class="title">{{item.label}}</div>
                      <div class="cont-bott" v-if="!!rowData.length">{{rowData[item.key]}}</div>
                    </div>
                  </div>
                  <div class="img-part">
                    <div class="row-box" v-for="(item, i) in infoRight3" :key="i">
                      <div class="title">{{item.label}}</div>
                      <div class="cont-right">2020</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>财务信息</div>
            <div class="info-box"></div>
            <div>异动历史</div>
            <div class="info-box"></div>
            <div>学习汇总</div>
            <div class="info-box"></div>
            <div>考试成绩统计</div>
            <div class="info-box"></div>
          </el-scrollbar>
        </div>
        <div class="drawer-footer">
          <el-button type="primary">确 定</el-button>
          <el-button @click="closeDia">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '@/api/organ'
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
  components: {},
  watch: {
    dialogVisible (val) {
      this.openStatus = val
    }
  },
  data() {
    return {
      openStatus: this.dialogVisible,
      // 个人信息
      infoLeft: [
        { label: '入学年', key: '' },
        { label: '学号', key: 'studentNo' },
        { label: '学习中心', key: '' },
        { label: '出生日期', key: 'birthday' },
        { label: '政治面貌', key: 'politicalOutlook' },
        { label: '证件号码', key: 'certNo' },
        { label: '邮编', key: 'postalCode' },
        { label: '户籍地址', key: 'address' },
        { label: '毕业证书类型', key: 'record' },
        { label: '最后学历', key: 'studentStatus' },
        { label: '工作单位', key: 'workCompany' },
        { label: '职业状况', key: 'jobStatus' }
      ],
      infoRight1: [
        { label: '姓名', key: 'realName' },
        { label: '性别', key: 'sex' },
        { label: '层次', key: 'enterLevel' },
        { label: '专业', key: 'enterMajor' },
        { label: '籍贯', key: 'birthPlace' },
        { label: '民族', key: 'nation' },
        { label: '婚姻状况', key: 'marryStatus' },
        { label: '证件类型', key: 'enterLevel' },
        { label: '学生类型', key: '' },
        { label: '学习状态', key: '' },
        { label: '联系电话', key: 'backMobile' },
        { label: '手机', key: 'mobile' }
      ],
      infoRight2: [
        { label: '毕业学校', key: 'university' },
        { label: '学习专业', key: 'enterMajor' },
        { label: '毕业时间', key: 'graduationDate' },
        { label: '原专业', key: 'major' },
        { label: '职业', key: 'occupation' },
        { label: '职务', key: 'job' },
        { label: '是否教师', key: 'yesTeacher' },
        { label: '是否具备上网条件', key: 'yesIntelnet' }
      ],
      infoRight3: [
        { label: '毕业证书号', key: 'recordNo' },
        { label: '是否奥鹏', key: '' },
        { label: '职称', key: 'title' },
        { label: '参加工作时间', key: 'workDate' }
      ]
    }
  },
  created() {
  },
  methods: {
    closeDia() {
      this.$emit('closeDia', {}, false)
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .content-container {
    flex: 1;
  }
  .OEP-form-item {
    width: 260px;
    .el-form-item {
      margin-bottom: 0;
      /deep/ .width168 {
        width: 168px;
      }
      /deep/ .form-item-input {
        width: 240px;
        .el-input--suffix {
          width: 100%;
        }
      }
    }
  }
  .drawer-footer {
    margin: 0 0 24px 24px;
    height: 72px;
    line-height: 72px;
  }
  .flex-right {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-right: 24px;
  }
  .upload-icon {
    width: 240px;
    height: 168px;
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
    .required-icon {
      width: 8px;
      height: 8px;
      line-height: 8px;
      color: #3f93db;
      margin-left: 4px;
    }
    /deep/ .el-icon-warning-outline:before {
      color: #8c939d;
    }
    /deep/ .el-upload--picture-card {
      width: 240px;
      height: 168px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/.el-upload--picture-card i {
      font-size: 32px;
    }
  }
  .plan-detail {
    margin-bottom: 24px;
    .title {
      height: 24px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
      margin-bottom: 8px;
    }
    .content {
      background: rgba(245, 247, 250, 1);
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      .item {
        width: 33%;
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
        span {
          margin-left: 16px;
          margin-bottom: 8px;
        }
      }
    }
  }
}
.OEP-form-item {
  margin-bottom: 0;
}
.content-row {
  margin: 0 24px 24px 24px;
  .title {
    height: 24px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: 24px;
  }
  .cont {
    height: 24px;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    font-family: PingFangSC, PingFangSC-Medium;
    text-align: left;
    color: #333333;
  }
}
.info-box {
  margin-right: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  .row-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    .row-left-box {
      border-bottom: 1px solid #ccc;
    }
    .cont-left {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
    }
  }
  .row-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    .row-right-box {
      display: flex;
      flex-direction: row;
    }
    .info-part {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .info-part-box {
        width: 50%;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
    }
    .info-part-tel {
      width: 37.2%;
      display: flex;
      border-bottom: 1px solid #ccc;
    }
    .info-part-addr {
      width: 62.8%;
      display: flex;
      border-bottom: 1px solid #ccc;
    }
    .cont-addr {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .cont-right {
      flex: 1;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .img-part {
      width: 170px;
      height: 245px;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      .upload-icon {
        width: 170px;
        height: 204px;
      }
    }
  }
  .title {
    width: 120px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #ccc;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
  }
  .row-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    border-bottom: 1px solid #ccc;
  }
}
.iconfont {
  margin-right: 10px;
}
.bottom-box {
  // width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  border-bottom: 1px solid #ccc;
  .info-part {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ccc;
  }
  .info-part-bott {
    width: 50%;
    display: flex;
    height: 41px;
  }
  .img-part {
    width: 170px;
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    .upload-icon {
      width: 170px;
    }
  }
}
#scroll-box {
  height: 580px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.search-btn {
  cursor: pointer;
  margin-left: 20px;
}
</style>