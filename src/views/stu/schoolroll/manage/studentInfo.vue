<template>
<div>
  <div class="info-title">基本信息</div>
  <div class="container">
    <div class="item cell-combox-container3">
      <div class="common-container">
        <div class="item-title">入学年</div>
        <div class="item-cont">{{studentRoll.createDate}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">学期</div>
        <div class="item-cont"></div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">学号</div>
        <div class="item-cont">{{studentRoll.studentNo}}</div>
      </div>
      <div class="item-title4 item-photo">
        <img class="avatar-box" :src="studentRoll.pictureUrl1" alt="">
      </div>
    </div>
    <div class="item cell-combox-container2">
      <div class="common-container">
        <div class="item-title">姓名</div>
        <div class="item-cont">{{studentRoll.realName}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">性别</div>
        <div class="item-cont">{{studentRoll.sex ? (studentRoll.sex === '1' ? '男' : '女') : 'XX'}}</div>
      </div>
      <div class="item-title4">
        
      </div>
    </div>
    <div class="item cell-combox-container2">
      <div class="common-container">
        <div class="item-title">学习中心</div>
        <div class="item-cont">{{studentRoll.organName}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">层次</div>
        <div class="item-cont">{{studentRoll.enterLevel}}</div>
      </div>
      <div class="item-title4">
        
      </div>
    </div>
    <div class="item cell-container3">
      <div class="common-container">
        <div class="item-title">专业</div>
        <div class="item-cont">{{studentRoll.major}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">出生日期</div>
        <div class="item-cont">{{studentRoll.birthday}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">籍贯</div>
        <div class="item-cont">{{studentRoll.birthPlace}}</div>
      </div>
    </div>
    <div class="item cell-container4">
      <div class="item-4 common-container">
        <div class="item-title">民族</div>
        <div class="item-cont1">{{studentRoll.nation}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">政治面貌</div>
        <div class="item-cont1">{{studentRoll.marryStatus}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">婚姻状况</div>
        <div class="item-cont1">{{studentRoll.marryStatus ? (studentRoll.marryStatus === '1' ? '已婚' : '未婚') : 'XX'}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">证件类型</div>
        <div class="item-cont1">{{studentRoll.certType === '1' ? '身份证' : ''}}</div>
      </div>
    </div>
    <div class="item cell-container3">
      <div class="common-container">
        <div class="item-title">证件号码</div>
        <div class="item-cont">{{studentRoll.certNo}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">学习类型</div>
        <div class="item-cont">{{studentRoll.certNo}}</div>
      </div>
      <div class="common-container">
        <div class="item-title item-title4">学习状态</div>
        <div class="item-cont">{{studentRoll.stuentStatus}}</div>
      </div>
    </div>
    <div class="item cell-container4">
      <div class="item-4 common-container">
        <div class="item-title">邮编</div>
        <div class="item-cont1">{{studentRoll.postalCode}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">联系电话</div>
        <div class="item-cont1">{{studentRoll.mobile}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">手机</div>
        <div class="item-cont1">{{studentRoll.backMobile}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">电子邮箱</div>
        <div class="item-cont1">{{studentRoll.email}}</div>
      </div>
    </div>
    <div class="item cell-container2">
      <div class="item-4 common-container">
        <div class="item-title">户籍地址</div>
        <div class="item-cont1">{{studentRoll.birthPlace}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">紧急联系电话</div>
        <div class="item-cont1">{{studentRoll.backMobile}}</div>
      </div>
    </div>
    <div class="item cell-container5">
      <div class="item-title">邮寄地址</div>
      <div class="item-cont1">{{studentRoll.address}}</div>
    </div>
  </div>

  <div class="info-title">其他信息</div>
  <div class="container">
    <div class="cell-container1">
      <div class="item common-container">
        <div class="item-title">毕业证书类型</div>
        <div class="item-cont">{{studentRoll.record}}</div>
      </div>
      <div class="item common-container">
        <div class="item-title">毕业学校</div>
        <div class="item-cont">{{studentRoll.university}}</div>
      </div>
      <div class="item common-container">
        <div class="item-title">专业</div>
        <div class="item-cont">{{studentRoll.enterMajor}}</div>
      </div>
    </div>
    <div class="item cell-container4">
      <div class="item-4 common-container">
        <div class="item-title">毕业证书号</div>
        <div class="item-cont1">{{studentRoll.recordNo}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">最后学历</div>
        <div class="item-cont1">{{studentRoll.record}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">毕业时间</div>
        <div class="item-cont1">{{studentRoll.graduationDate}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">是否奥鹏</div>
        <div class="item-cont1"></div>
      </div>
    </div>
    <div class="item cell-container4">
      <div class="item-4 common-container">
        <div class="item-title">工作单位</div>
        <div class="item-cont1">{{studentRoll.workCompany}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">职业</div>
        <div class="item-cont1">{{studentRoll.occupation}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">职务</div>
        <div class="item-cont1">{{studentRoll.job}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">职称</div>
        <div class="item-cont1">{{studentRoll.title}}</div>
      </div>
    </div>
    <div class="item cell-container4">
      <div class="item-4 common-container">
        <div class="item-title">职业状况</div>
        <div class="item-cont1">{{studentRoll.jobStatus ? (studentRoll.jobStatus === '1' ? '从业' : '无业') : ''}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">是否教师</div>
        <div class="item-cont1">{{studentRoll.yesTeacher}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">是否可上网</div>
        <div class="item-cont1">{{studentRoll.yesIntelnet ? (studentRoll.yesIntelnet === '1' ? '是' : '否') : ''}}</div>
      </div>
      <div class="item-4 common-container">
        <div class="item-title4 item-title">参加工作时间</div>
        <div class="item-cont1">{{studentRoll.workDate ? (studentRoll.workDate === '1' ? '是' : '否') : ''}}</div>
      </div>
    </div>
    <div class="item cell-container5">
      <div class="item-title">备注</div>
      <div class="item-cont1">{{studentRoll.remark}}</div>
    </div>
  </div>
</div>
</template>
<script>
import * as api from '../api'
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      studentRoll: {}
    }
  },
  mounted() {
    this.getStuInfoData()
  },
  methods: {
    async getStuInfoData() {
      const params = {
        id: this.data.data.id
      }
      const res = await api.getStuInfo(params)
      const obj = res.data.studentRoll
      let recordValue = ''
        if(obj.record === 1) {
          recordValue = '专科'
        } else if(obj.record === 2) {
          recordValue = '本科'
        } else if(obj.record === 3) {
          recordValue = '研究生'
        } 
      this.studentRoll = Object.assign({}, obj, {
        pictureUrl1: obj.pictureUrl1 ? `${BASE_API}/course/${obj.pictureUrl1}?token=${getToken()}` : '',
        record: recordValue,
        createDate: obj.createDate.split(" ")[0]
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.info-title{
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #333333;
  margin: 24px 0 16px 0;
}
.cell-combox-container3{
  display: grid;
  grid-template-columns: 25% 25% auto 169px;
  grid-template-rows: 48px;
}
.cell-combox-container2{
  display: grid;
  grid-template-columns: 50% auto 169px;
  grid-template-rows: 48px;
}
.container{
  display: grid;
  grid-template-columns: repeat(4, 120px, auto);
  grid-template-rows: 48px;
  .cell-container5{
    display: grid;
    grid-template-columns: 120px auto;
    grid-template-rows: 48px;
  }
  .cell-container4{
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: 48px;
  }
  .cell-container1{
    display: grid;
    grid-template-columns: 25% 50% 25%;
    grid-template-rows: 48px;
  }
  .cell-container2{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 48px;
  }
  .cell-container3{
    display: grid;
    grid-template-columns: 50% 25% 25%;
    grid-template-rows: 48px;
  }
  .common-container{
      display: grid;
      grid-template-columns: 120px auto;
    }
}
.item {
  font-size: 14px;
  text-align: center;
  border: 1px solid #cdd6df;
}
.item-title{
  width: 120px;
  height: 48px;
  border-right: 1px solid #cdd6df;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(224,232,239,0.24);
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
}
.item-title4{
  border-left: 1px solid #cdd6df;
}
.cell-container{
  display: inline-grid;
  grid-template-columns: repeat(2, 25%);
  grid-template-rows: 48px;
}
.container2{
  display: grid;
  grid-template-columns: 120px, 160px;
}
.item-4{
  font-size: 14px;
  text-align: center;
}
.item-cont, .item-cont1{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
}
.item-photo{
  border-bottom: none;
  border-top: none;
  z-index: 999;
  background-color: #fff;
  height: 144px;
}
.avatar-box{
  width: 90px;
  height: 120px;
}
</style>