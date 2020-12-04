<template>
  <el-row :gutter="24" v-show="detail.realName">
    <el-col :span="10">
      <div>学号：{{ detail.studentNo}}</div>
      <div>性别：{{ detail.sex ? (detail.sex === '1' ? '男' : '女') : 'XX' }}</div>
    </el-col>
    <el-col :span="14">
      <div>
        <div>姓名：{{ detail.realName}}</div>
        <div>证件号码：{{ detail.certNo}}</div>
      </div>
    </el-col>
    <el-col>
      <div>学校：{{detail.organName}}</div>
    </el-col>
    <el-col>
      <div>教学点：{{detail.schoolOrganName}}</div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'StuInfoCard',
  props: {
    detail: {
      type: Object,
      default: () => ({}),
      require: true
    }
  }
}
</script>

<style scoped>

</style>
