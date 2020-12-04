<template>
  <div>
    <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
    </courses-table>
    <div class="bott-total">
      <div>合计</div>
      <div>{{totalParams.courseList}}门课程</div>
      <div>{{totalParams.courseCredit}}</div>
      <div>{{totalParams.getCredit}}</div>
    </div>
  </div>

</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import * as api from '../api'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    coursesTable
  },
  data() {
    return {
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#fff', color: '#333333' },
        isHideOperation: true,
        columnConfig: [
          {
            label: '学年',
            prop: 'schoolYear',
          },
          {
            label: '学期',
            prop: 'semester',
            width: '160'
          },
          {
            label: '课程名称',
            prop: 'courseName',
            width: '280'
          },
          {
            label: '学分',
            prop: 'courseCredit'
          },
          {
            label: '获得学分',
            prop: 'getCredit',
            width: '160px'
          },
          {
            label: '成绩',
            prop: 'score'
          },
          {
            label: '课程类型',
            prop: 'courseType',
            width: '160px'
          }
        ]
      },
      totalParams: {
        courseList: '',
        courseCredit: '',
        getCredit: ''
      }
    }
  },
  mounted() {
    this.getStuCourseListData()
  },
  methods: {
    async getStuCourseListData() {
      const res = await api.getStuCourseList(this.data.data.id)
      this.tableData = res.data.studentCourseInfos
      this.totalParams.courseCredit = res.data.totalCourseCredit
      this.totalParams.getCredit = res.data.totalGetCredit
      this.totalParams.courseList = res.data.courseCount
    },
  }
}
</script>
<style lang="scss" scoped>
.bott-total{
  height: 48px;
  background-color: #F2F2F2;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #333333;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
}
.bott-total div:nth-child(1){
  width: 292px;
}
.bott-total div:nth-child(2){
  width: 280px;
}
.bott-total div:nth-child(3){
  width: 130px;
}
</style>
