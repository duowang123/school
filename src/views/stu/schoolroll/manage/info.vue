<template>
<div class="info-box">
  <el-tabs v-model="activeName">
    <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in list" :key="index">
      <component :is="activeName" :data="data" v-if="item.name === activeName"></component>
    </el-tab-pane>
  </el-tabs>
  <!-- <div class="bott-btn"><el-button>关闭</el-button></div> -->
</div>
</template>
<script>
import studentInfo from './studentInfo'
import Finance from './finance'
import courseList from './courseList'
import transactions from './transactions'
import grade from './grade'
import study from './study'
import Thesis from './Thesis'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    studentInfo,
    Finance,
    courseList,
    transactions,
    grade,
    study,
    Thesis
  },
  data() {
    return {
      activeName: 'studentInfo',
      list: [
        {
          label: '个人信息',
          name: 'studentInfo'
        },
        {
          label: '财务信息',
          name: 'Finance'
        },
        {
          label: '选课列表',
          name: 'courseList'
        },
        {
          label: '异动历史',
          name: 'transactions'
        },
        {
          label: '论文毕业',
          name: 'Thesis'
        }
        // {
          // label: '学习汇总',
          // name: 'study'
        // },
        // {
          // label: '考试成绩统计',
          // name: 'grade'
        // }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.info-box{
  display: flex;
  height: 100%;
  justify-content: space-between;
  flex-direction: column;
  padding: 0 24px 24px 24px;
  /deep/ .el-tabs__header{
    margin: 0;
  }
  /deep/ .is-active {
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #3f93db !important;
    background-color: #fff;
    height: 56px;
  }
  /deep/ .el-tabs__nav{
    height: 56px;
  }
  /deep/ .el-tabs__item {
    width: 120px;
    height: 56px;
    line-height: 56px;
    text-align: center;
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #666666;
    padding: 0;
  }
  /deep/ .el-tabs__nav-scroll {
    background-color: #E6E9EC;
    height: 56px;
    line-height: 56px;
  }
  .bott-btn{
    display: flex;
    justify-content: flex-end;
  }
}
</style>