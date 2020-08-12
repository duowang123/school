<template>
  <div class="situation">
    <Navigate
        :is-hide="{schoolInfo: false, schoolDetail: true}"
        @add="handleAdd"
        @search="search"
        @select="organChange"
        @school-detail="schoolDetail"
        :select-options="organList"
    />
    <courses-table
      class="table"
      @btnTxt="btnTxt"
      :tableConfig="tableConfig"
      :tableData="tableData">
      <template slot-scope="{ scope }">
        <div class="item">
          <el-button type="text" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" @click="handleAttr(scope)">属性</el-button>
          <el-button type="text" @click="handleDelete(scope)">删除</el-button>
        </div>
      </template>
    </courses-table>
    <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="page.pageCurrent"
        :pagination-config="paginationConfig"
    />
    <el-drawer :title="title" :visible.sync="dialogVisible" :size="width" :direction="direction">
      <component :is="componentName" :ref="componentName" :data="componentData"/>
      <div v-show="isShowBtn" class="demo-drawer__footer">
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
    <el-dialog title="学期信息" :visible.sync="schoolDetailVisible" :close-on-click-modal="false">
      <el-table :data="schoolDetailData" >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="schoolYear" label="学年" ></el-table-column>
        <el-table-column property="semesterName" label="学期" ></el-table-column>
        <el-table-column property="startDate" label="开始日期" ></el-table-column>
        <el-table-column property="endDate" label="结束日期"></el-table-column>
        <el-table-column width="400">
          <template slot-scope="scope">
            <div slot="reference" v-if="selData.id === scope.row.id">
              <el-date-picker
                v-model="selData.date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="text" size="small" @click="updateTime(scope)">确定</el-button>
            </div>
            <el-button v-else slot="reference"  type="text" size="small" @click="clickHandler(scope)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../api'
  import Navigate from '../components/navigate'
  import CoursesTable from '@/components/Table/coursesTable'
  import Pagination from '@/components/Table/pagination'
  import Attr from '@/components/Table/attr'
  import Add from './add'
  import Courses from './courses'
  export default {
    name: 'TeachProgram',
    components: {
      Navigate,
      CoursesTable,
      Pagination,
      Add,
      Attr,
      Courses
    },
    data() {
      return {
        searchValue: '',
        selectValue: '',
        selectOptions: [],
        params: {
          queryContent: ''
        },
        organId: '',
        tableData: [],
        tableConfig: {
          loading: false,
          serialNumber: {
            label: '序号',
            type: 'index',
            width: '64'
          },
          columnConfig: [
            {
              label: '计划名称',
              prop: 'name',
              width: '288'
            },
            {
              label: '计划类型',
              prop: 'typeName',
              width: '160'
            },
            {
              label: '专业名称',
              prop: 'specialtyName',
              width: '224'
            },
            {
              label: '层次',
              prop: 'level',
              width: '128'
            },
            {
              label: '学年',
              prop: 'schoolYear',
              width: '96'
            },
            {
              label: '学期',
              prop: 'semesterName',
              width: '96'
            },
            {
              label: '所属学校',
              prop: 'collegeName',
              width: '192'
            },
            {
              label: '课程清单',
              prop: '',
              width: '128',
              slot: {
                type: 'btnTxt',
                txt: '查看'
              }
            }
          ]
        },
        schoolYearOptions: [],
        levelOption: [],
        courseList: [],
        semesterOptions: [],
        specialtyOptions: [],
        typeOptions: [],
        page: {
          pageCurrent: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        },
        dialogVisible: false,
        schoolDetailVisible: false,
        schoolDetailData: [],
        selData: {
          date: [],
          id: ''
        },
        title: '',
        componentName: '',
        componentData: null,
        width: '500px',
        direction: 'rtl',
        isShowBtn: true
      }
    },
    watch: {
      dialogVisible(val) {
        val || (this.componentName = '')
      }
    },
    created() {
      this.init()
    },
    computed: {
      ...mapGetters(['organList']),
      paginationConfig() {
        return {
          total: this.page.totalCount,
          pageSize: this.page.pageSize,
          pageSizes: [20, 50, 100, 200]
        }
      }
    },
    methods: {
      async init() {
        this.organId = this.organList[0].value
        this.params.queryContent = ''
        this.initSelectOptions()
        this.getSpecialty()
        this.initPage()
        this.getTableData()
      },
      getTableData() {
        const params = {
          ...this.params,
          organId: this.organId,
          pageCurrent: this.page.pageCurrent,
          pageSize: this.page.pageSize
        }
        api.getTeachingPlanList(params).then(res => {
          this.tableData = this.formatData(res.data.rows)
          this.page.totalCount = res.data.totalCount
          this.page.totalPage = res.data.totalPage
        })
      },
      // 处理表格需要转换的数据
      formatData(data) {
        return data
      },
      // 从字典中获取下拉框数据
      initSelectOptions() {
        api.listByCode({ code: '0015' }).then(res => {
          this.levelOption = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({ code: '0014' }).then(res => {
          this.schoolYearOptions = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({ code: '0024' }).then(res => {
          this.semesterOptions = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({ code: '0023' }).then(res => {
          this.typeOptions = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
      },
      initPage() {
        this.page.pageCurrent = 0
      },
      // 获取专业和专业
      getSpecialty() {
        let params = {
          organId: this.organId
        }
        api.specialtyOptions(params).then(res => {
          this.specialtyOptions = res.data.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          })
        })
        params = {
          organId: this.organId,
          pageCurrent: 1,
          pageSize: 1000
        }
        // 获取课程
        api.getCoursePage(params).then(res => {
          this.courseList = res.data.rows
        })
      },
      btnTxt(row) {
        this.title = '课程清单'
        this.dialogVisible = true
        this.componentName = 'Courses'
        this.width = '800px'
        this.componentData = row
        this.isShowBtn = false
      },
      // 搜索
      search(val) {
        this.params.queryContent = val
        this.getTableData()
      },
      organChange(organId) {
        if (!organId)
          return false
        this.organId = organId
        this.initPage()
        this.getSpecialty()
        this.getTableData()
      },
      schoolDetail() {
        this.selData = {
          date: [],
          id: ''
        }
        api.getSchoolDetail().then(res => {
          this.schoolDetailData = res.data
          this.schoolDetailVisible = true
        })
      },
      // 新增
      handleAdd() {
        this.title = '新增'
        this.dialogVisible = true
        this.componentName = 'Add'
        this.width = '800px'
        this.isShowBtn = true
        this.componentData = {
          isAdd: true,
          organId: this.organId,
          schoolYearOptions: this.schoolYearOptions,
          levelOption: this.levelOption,
          semesterOptions: this.semesterOptions,
          specialtyOptions: this.specialtyOptions,
          typeOptions: this.typeOptions,
          courseList: this.courseList
        }
      },
      confirm() {
        this.$nextTick(() => {
          this.$refs[`${this.componentName}`].confirm((valid) => {
            this.dialogVisible = !valid
            if (valid) {
              this.init()
            }
          })
        })
      },
      clickHandler({ row }) {
        this.selData = {
          id: row.id,
          date: [row.startDate, row.endDate]
        }
      },
      updateTime() {
        debugger
        if (!this.selData.date) {
          this.$message.warning('请选择时间范围')
          return
        }
        const params = {
          id: this.selData.id,
          startDate: this.selData.date[0],
          endDate: this.selData.date[1]
        }
        api.updateSchoolDetail(params).then(res => {
          if (res.code === 200) {
            this.$message.success('更新成功!')
            this.schoolDetail()
          } else {
            this.$message.error('更新失败!')
          }
        })
      },
      // 编辑
      handleEdit({ row }) {
        this.title = '编辑'
        this.dialogVisible = true
        this.componentName = 'Add'
        this.width = '800px'
        this.isShowBtn = true
        this.componentData = {
          isAdd: false,
          tableData: row,
          organId: this.organId,
          schoolYearOptions: this.schoolYearOptions,
          levelOption: this.levelOption,
          semesterOptions: this.semesterOptions,
          specialtyOptions: this.specialtyOptions,
          typeOptions: this.typeOptions,
          courseList: this.courseList
        }
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
            { label: '专业名称', key: 'specialtyName' },
            { label: '最近更新时间', key: 'updateDate' },
            { label: '更新人', key: 'updateUserId' },
            { label: '创建时间', key: 'createDate' },
            { label: '创建人', key: 'createUserId' }
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
          api.deleteTeachingPlan({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.initPage()
              this.getTableData()
            }
          })
        })
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
    .demo-drawer__footer{
      text-align: center;
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
    .item {
      margin-right: 16px;
      color: #A3AAB3;
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
  }
</style>
