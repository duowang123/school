<template>
  <div class="situation">
    <Navigate
      :is-hide="{schoolInfo: false, schoolDetail: true}"
      @add="handleAdd"
      @search="search"
      @select="organChange"
      @school-detail="schoolDetail"
      :select-options="schoolOrgansListAll"
    />
    <div class="main-content-container">
      <courses-table
        class="table"
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
      >
        <template slot-scope="{ scope }">
          <div class="item">
            <el-button type="text" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="text" @click="handleCopy(scope)">复制</el-button>
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
    </div>
    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
    >
      <component :is="componentName" :ref="componentName" :data="componentData" />
      <div v-show="isShowBtn" class="demo-drawer__footer">
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
    <el-dialog
      title="学期信息"
      :visible.sync="schoolDetailVisible"
      width="900px"
      :close-on-click-modal="false"
    >
      <!-- TODO -->
      <el-button type="primary" size="mini" @click="addSemester">新增</el-button>
      <el-table class="school-info-table" :data="schoolDetailData">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="学年">
          <template slot-scope="{ row }">
            <template v-if="row.add">
              <el-select size="mini" v-model="addSchoolDetailForm.schoolYear" placeholder="请选择">
                <el-option
                  v-for="item in schoolYearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template v-else>{{ row.schoolYear }}</template>
          </template>
        </el-table-column>
        <el-table-column label="学期">
          <template slot-scope="{ row }">
            <template v-if="row.add">
              <el-select size="mini" v-model="addSchoolDetailForm.semester" placeholder="请选择">
                <el-option label="上学期" value="1"></el-option>
                <el-option label="下学期" value="2"></el-option>
              </el-select>
            </template>
            <template v-else>{{ row.semesterName }}</template>
          </template>
        </el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="{ row }">
            <template v-if="row.edit || row.add">
              <el-date-picker
                size="mini"
                v-model="selData.date[0]"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </template>
            <template v-else>{{ row.startDate }}</template>
          </template>
        </el-table-column>
        <el-table-column label="结束日期">
          <template slot-scope="{ row }">
            <template v-if="row.edit || row.add">
              <el-date-picker
                size="mini"
                v-model="selData.date[1]"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </template>
            <template v-else>{{ row.endDate }}</template>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <div slot="reference" v-if="selData.id === scope.row.id">
              <el-button type="text" size="small" @click="updateTime(scope)">确定</el-button>
            </div>
            <div slot="reference" v-if="scope.row.add">
              <el-button type="text" size="small" @click="addSchoolDetail(scope)">确定</el-button>
            </div>
            <div v-else slot="reference">
              <el-button type="text" size="small" @click="clickHandler(scope)">修改</el-button>
              <el-button type="text" size="small" @click="clickDelHandler(scope)">删除</el-button>
            </div>
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
import selectMixin from '@/views/mixins/select.js'

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
  mixins: [selectMixin],
  data() {
    return {
      visible: false,
      searchValue: '',
      selectValue: '',
      selectOptions: [],
      params: {
        organId: '',
        queryContent: ''
      },
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
            width: '170'
          },
          {
            label: '计划类型',
            prop: 'typeName'
          },
          {
            label: '学校名称',
            prop: 'organName',
            width: '170'
          },
          {
            label: '专业名称',
            prop: 'specialtyName',
            width: '170'
          },
          {
            label: '层次',
            prop: 'levelLabel'
          },
          {
            label: '学年',
            prop: 'schoolYear'
          },
          {
            label: '学期',
            prop: 'semesterName'
          },
          {
            label: '学生入学学年',
            prop: 'stuSchoolYear'
          },
          {
            label: '学生入学学期',
            prop: 'stuSemester',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '上学期' : '下学期'
            }
          },
          {
            label: '状态',
            prop: 'enable',
            type: 'enums',
            enums: (value) => {
              return value ? '启用' : '禁用'
            }
          },
          {
            label: '学院',
            prop: 'collegeName'
          },
          {
            label: '课程清单',
            prop: '',
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
      rules: {
        schoolYear: [{ required: true, message: '请选择', trigger: 'blur' }],
        semester: [{ required: true, message: '请选择', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      addSchoolDetailForm: {
        schoolYear: '',
        semester: '',
        startDate: '',
        endDate: ''
      },
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
    addSemester() {
      if (
        this.schoolDetailData &&
        this.schoolDetailData[this.schoolDetailData.length - 1].add
      ) {
        return void '不能重复添加'
      }
      this.addSchoolDetailForm = {
        schoolYear: '',
        semester: '',
        startDate: '',
        endDate: ''
      }
      this.schoolDetailData.push({
        add: true
      })
    },
    async init() {
      this.params.queryContent = ''
      this.initSelectOptions()
      this.initPage()
      this.getTableData()
    },
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.getTeachingPlanList(params).then((res) => {
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
      api.listByCode({ code: '0015' }).then((res) => {
        this.levelOption = res.data.map((e) => {
          return {
            id: e.id,
            label: e.dictName,
            value: e.dictValue
          }
        })
      })
      api.listByCode({ code: '0014' }).then((res) => {
        this.schoolYearOptions = res.data.map((e) => {
          return {
            id: e.id,
            label: e.dictName,
            value: e.dictValue
          }
        })
      })
      api.listByCode({ code: '0023' }).then((res) => {
        this.typeOptions = res.data.map((e) => {
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
      this.params.organId = organId
      this.initPage()
      this.getTableData()
    },
    schoolDetail() {
      this.selData = {
        date: [],
        id: ''
      }
      const params = { pageCurrent: 1, pageSize: 100 }
      api.getSchoolDetail(params).then((res) => {
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
        organId: this.params.organId,
        levelOption: this.levelOption,
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
    openVisible() {
      this.$refs.form.resetFields()
      this.visible = true
    },
    addSchoolDetail() {
      if (this.selData.date[1] < this.selData.date[0]) {
        return this.$message.warning('开始日期必须大于结束日期!')
      }
      this.addSchoolDetailForm.startDate = this.selData.date[0]
      this.addSchoolDetailForm.endDate = this.selData.date[1]
      api.addSchoolDetail(this.addSchoolDetailForm).then((res) => {
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.visible = false
          this.addSchoolDetailForm = {
            schoolYear: '',
            semester: '',
            startDate: '',
            endDate: ''
          }
          this.$store.dispatch('getYearAndSemester')
          this.schoolDetail()
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    clickHandler({ row }) {
      row.edit = true
      // this.$forceUpdate()
      this.selData = {
        id: row.id,
        date: [row.startDate, row.endDate]
      }
      this.$forceUpdate()
    },
    clickDelHandler({ row }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delSchoolDetail({ id: row.id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.schoolDetail()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    updateTime() {
      if (!this.selData.date) {
        this.$message.warning('请选择时间范围')
        return
      }
      const params = {
        id: this.selData.id,
        startDate: this.selData.date[0],
        endDate: this.selData.date[1]
      }
      api.updateSchoolDetail(params).then((res) => {
        if (res.code === 200) {
          this.$message.success('更新成功!')
          this.schoolDetail()
          this.$store.dispatch('getYearAndSemester')
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
        tableData: this.$_cloneDeep(row),
        organId: this.params.organId,
        levelOption: this.levelOption,
        specialtyOptions: this.specialtyOptions,
        typeOptions: this.typeOptions,
        courseList: this.courseList
      }
    },
    handleCopy({ row }) {},
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
        api.deleteTeachingPlan({ id: row.id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
  margin: 0 20px 0;
  .demo-drawer__footer {
    /*text-align: center;*/
    position: absolute;
    z-index: 99;
    bottom: 0;
    left: 20px;
  }
  .item {
    margin-right: 16px;
    color: #a3aab3;
  }
}
.school-info-table {
  /deep/ .el-date-editor.el-input {
    width: 150px;
  }
  /deep/ .el-date-editor.el-input__inner {
    width: 150px;
  }
}
.icon-item {
  width: 100%;
  height: 40px;
  padding: 9px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
