<template>
  <div class="situation">
    <Navigate
      :is-hide="{authorization:true, ratio: true}"
      @add="handleAdd"
      @search="search"
      @select="organChange"
      @ratio="ratioOpen"
      @authorization="handleAuthorization"
      :clearable="true"
      :select-options="organList"
    />
    <courses-table
      class="table"
      @btnTxt="btnTxt"
      :tableConfig="tableConfig"
      :tableData="tableData">
      <template slot-scope="{ scope }">
        <div class="operator">
          <div class="item">
            <el-button type="text" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="text" @click="handleAttr(scope)">属性</el-button>
            <el-button type="text" @click="handleDelete(scope)">删除</el-button>
          </div>
        </div>
      </template>
    </courses-table>
    <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="page.pageCurrent"
        :pagination-config="paginationConfig"
    />
    <!-- 课程预览 -->
    <el-dialog class="course-preview" :modal="false" :show-close="false" :close-on-press-escape="false"  fullscreen :visible.sync="previewVisible" append-to-body>
      <div class="course-title" slot="title"> <span @click="previewVisible = false" class="iconfont icon-arrow-back"></span>课程预览</div>
      <Preview v-if="previewVisible" :course-id="courseId" :tabsCourseData="tabsCourseData" :renderData="renderData"/>
    </el-dialog>
    <el-drawer :title="title" :visible.sync="dialogVisible" :size="width" :direction="direction">
      <component :is="componentName" :ref="componentName" @update="organChange" :data="componentData"/>
      <div v-show="isShowBtn" class="demo-drawer__footer">
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
    <el-dialog :title="courseTitle" fullscreen :visible.sync="dialogCourseVisible">
      <addCourseInfo
      ref="addCourseInfo"
      :visible="dialogCourseVisible"
      :isAdd="isAdd"
      @update="getTableData"
      @close="dialogCourseVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script>
    // majorCourses/courseInfo
  import * as api from '../api'
  import Navigate from '../components/navigate'
  import CoursesTable from '@/components/Table/coursesTable'
  import Pagination from '@/components/Table/pagination'
  import AddCourseInfo from '../components/addCourseInfo'
  import Attr from '@/components/Table/attr'
  import CourseDistribution from './courseDistribution'
  import Ratio from './ratio'
  import Preview from './preview'

  export default {
    name: 'CourseInfo',
    components: {
      Navigate,
      CoursesTable,
      Pagination,
      CourseDistribution,
      AddCourseInfo,
      Preview,
      Attr,
      Ratio
    },
    data() {
      return {
        organId: '',
        isAdd: true,
        searchValue: '',
        selectValue: '',
        courseId: '',
        selectOptions: [],
        organList: [],
        tableData: [],
        allCourseData: [],
        params: {
          queryContent: ''
        },
        tableConfig: {
          loading: false,
          serialNumber: {
            label: '序号',
            type: 'index',
            width: '64'
          },
          columnConfig: [
            {
              label: '编号',
              prop: 'courseNo',
              width: '170'
            },
            {
              label: '课程名称',
              prop: 'courseName',
              width: '150'
            },
            {
              label: '学分',
              prop: 'courseCredit'
            },
            {
              label: '课程时数',
              prop: 'courseHours'
            },
            // {
            //   label: '成绩占比',
            //   prop: 'scoreProp',
            //   width: '128'
            // },
            {
              label: '课程类型',
              prop: 'courseTypeLabel'
            },
            {
              label: '计分模式',
              prop: 'scoringModelLabel'
            },
            {
              label: '考试模式',
              prop: 'examModeLabel'
            },
            {
              label: '考试方式',
              prop: 'examTypeLabel'
            },
            {
              label: '授课方式',
              prop: 'teachingMethodLabel'
            },
            {
              label: '课程详情',
              prop: 'courseDetails',
              slot: {
                type: 'btnTxt',
                txt: '查看'
              }
            }
          ]
        },
        page: {
          pageCurrent: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        },
        previewVisible: false,
        dialogVisible: false,
        moreVisible: false,
        tabsCourseData: {
          CourseIntroduction: '课程简介',
          LearnContent: '学习内容'
        },
        renderData: {
          CourseIntroduction: {},
          LearnContent: {}
        },
        title: '',
        componentName: '',
        componentData: null,
        width: '500px',
        direction: 'rtl',
        isShowBtn: true,
        dialogCourseVisible: false,
        courseTitle: ''
      }
    },
    watch: {
      dialogVisible(val) {
        val || (this.componentName = '')
      }
    },
    computed: {
      paginationConfig() {
        return {
          total: this.page.totalCount,
          pageSize: this.page.pageSize,
          pageSizes: [20, 50, 100, 200]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        await this.getOrganList()
        this.params.queryContent = ''
        this.initPage()
        this.getTableData()
      },
      async getOrganList() {
        await api.getOrgan({ name: '' }).then(res => {
          this.organList = res.data.list.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          })
          this.allOrgan = [...this.organList]
          // this.organList.unshift({ label: '全部课程', value: '' })
        })
      },
      getTableData() {
        const params = {
          ...this.params,
          organId: this.organId,
          pageCurrent: this.page.pageCurrent,
          pageSize: this.page.pageSize
        }
        api.getCoursePage(params).then(res => {
          this.tableData = this.formatData(res.data.rows)
          this.page.totalCount = res.data.totalCount
          this.page.totalPage = res.data.totalPage
          if (this.organId === '') {
            this.allCourseData = this.tableData
          }
        })
      },
      // 处理表格需要转换的数据
      formatData(data) {
        return data
      },
      initPage() {
        this.page.pageCurrent = 1
      },
      btnTxt({ id }) {
        this.courseId = id
        this.previewVisible = true
      },
      // 搜索
      search(val) {
        this.params.queryContent = val
        this.getTableData()
      },
      organChange(organId) {
        this.organId = organId
        this.initPage()
        this.getTableData()
      },
      ratioOpen() {
        this.title = '成绩占比'
        this.dialogVisible = true
        this.componentName = 'Ratio'
        this.width = '450px'
      },
      // 课程授权
      handleAuthorization() {
        this.title = '课程授权'
        this.dialogVisible = true
        this.componentName = 'courseDistribution'
        this.width = '650px'
        this.componentData = {
          allCourse: this.allCourseData,
          allOrgan: this.allOrgan
        }
        this.isShowBtn = true
      },
      // 编辑
      handleEdit({ row }) {
        this.courseTitle = '编辑课程'
        this.dialogCourseVisible = true
        this.isAdd = false
        this.$nextTick(() => {
          this.$refs.addCourseInfo.initCourseData(row)
        })
      },
      // 新增
      handleAdd() {
        this.courseTitle = '新增课程'
        this.dialogCourseVisible = true
        this.isAdd = true
        this.$nextTick(() => {
          this.$refs.addCourseInfo.initCourseData({})
        })
      },
      confirm() {
        // this.tableConfig.loading = true
        this.$refs[`${this.componentName}`].confirm(valid => {
          this.dialogVisible = !valid
        })
      },
      // 属性
      handleAttr({ row }) {
        this.title = '属性'
        this.dialogVisible = true
        this.componentName = 'Attr'
        this.width = '450px'
        this.isShowBtn = false
        this.componentData = {
          data: row,
          keys: [
            { label: '课程名称', key: 'courseName' },
            { label: '学分', key: 'courseCredit' },
            { label: '课程时数', key: 'courseHours' },
            { label: '成绩占比', key: 'scoreProp' },
            { label: '课程类型', key: 'courseType' },
            { label: '计分模式', key: 'scoringModel' },
            { label: '考试模式', key: 'examMode' },
            { label: '考试方式', key: 'examType' },
            { label: '授课方式', key: 'teachingMethod' }
          ]
        }
      },
      // 删除
      handleDelete({ row }) {
        this.$confirm('是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteCourse({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.initPage()
              this.getTableData()
            }
          })
        });
      },
      handleSizeChange(val) {
        this.page.pageSize = val
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.getTableData()
      }
    }
  }
</script>

<style scoped lang="scss">
  .situation {
    margin: 56px 24px 24px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 11, 30, 0.08);
    padding: 20px;
    .table{
      margin-bottom: 10px;
    }
    /*.demo-drawer__footer{*/
    /*  text-align: center;*/
    /*  position: absolute;*/
    /*  bottom: 20px;*/
    /*  left: 20px;*/
    /*}*/
    .operator {
      display: flex;
      .item{
        margin-right: 16px;
        color: #A3AAB3;
      }
    }
  }
  .icon-item {
    width: 100%;
    height: 40px;
    padding: 9px 16px;
    text-align: left;
    font-size:14px;
    font-weight:400;
    color: rgba(51,51,51,1);
    line-height:22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    .iconfont {
      transform: translateY(-3px);
      margin-right: 10px;
    }
  }
</style>
