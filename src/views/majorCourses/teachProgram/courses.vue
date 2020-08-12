<template>
  <div class="coursesBox">
    <p class="title"><span>计划名称：</span> <span class="name">{{planName}}</span></p>
    <p class="title">课程清单</p>
    <courses-table
      class="table"
      :tableConfig="tableConfig"
      :tableData="tableData"
      :colWidth="{ opear: '60px' }"
      >
<!--      <template slot-scope="{ scope }">-->
<!--        <el-tooltip class="item" effect="dark" content="查看" placement="top-start">-->
<!--          <el-button type="text" size="small" @click="handleCheck">查看</el-button>-->
<!--        </el-tooltip>-->
<!--      </template>-->
    </courses-table>
  </div>
</template>

<script>
  import CoursesTable from '@/components/Table/coursesTable'
  import { getCourseListByTeachingPlan } from '../api'

  export default {
    name: 'Courses',
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      CoursesTable
    },
    watch: {
      data: {
        handler(val) {
          if (val) {
            this.getTableData(val)
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        tableData: [],
        planName: '',
        tableConfig: {
          loading: false,
          showSummary: true,
          height: '750',
          columnConfig: [
            {
              label: '课程',
              prop: 'courseName',
              width: '380'
            },
            {
              label: '考试方式',
              prop: 'examType'
            },
            {
              label: '学分',
              prop: 'courseCredit'
            }
          ]
        }
      }
    },
    methods: {
      getTableData(data) {
        const id = data.id
        getCourseListByTeachingPlan(id).then(res => {
          this.tableData = res.data.courseInfoList
          this.planName = res.data.name
        })
      },
      handleCheck({ row }) {
      }
    }
  }
</script>

<style scoped lang="scss">
  .coursesBox {
    padding: 0 20px;
    .title {
      width:100%;
      height:32px;
      font-size:14px;
      color:rgba(102,102,102,1);
      line-height:32px;
      .name {
        font-weight:500;
        color:rgba(33,33,33,1);
        padding-left: 32px;
      }
    }
    h5, p{
      margin: 0;
      margin-bottom: 10px;
    }
  }
</style>
