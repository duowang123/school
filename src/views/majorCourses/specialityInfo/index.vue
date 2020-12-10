<template>
  <div class="situation">
    <Navigate
      :is-hide="{schoolInfo: true}"
      @add="handleAdd"
      @schoolInfo="schoolInfo"
      @search="search"
      @select="organChange"
      search-placeholder="名称/学院"
      :select-options="schoolOrgansListAll"
    />
    <div class="main-content-container">
      <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
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
    </div>
    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
    >
      <component
        :is="componentName"
        :ref="componentName"
        :schoolOrgansList="schoolOrgansList"
        :is-add="isAdd"
        :data="componentData"
      />
      <div v-show="isShowBtn" class="demo-drawer__footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// majorCourses/specialityInfo
import Navigate from '../components/navigate'
import CoursesTable from '@/components/Table/coursesTable'
import Pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import Add from './add'
import School from './school'
import * as api from '../api'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'SpecialityInfo',
  components: {
    Navigate,
    CoursesTable,
    Pagination,
    Add,
    School,
    Attr
  },
  mixins: [selectMixin],
  data() {
    return {
      searchValue: '',
      selectValue: '',
      selectOptions: [],
      organId: '',
      isAdd: true,
      params: {
        queryContent: ''
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      tableData: [],
      levelOption: [],
      tableConfig: {
        loading: false,
        // headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64'
        },
        columnConfig: [
          {
            label: '编号',
            prop: 'specialtyNo',
            width: '160'
          },
          {
            label: '专业名称',
            prop: 'name'
          },
          {
            label: '所属学院',
            prop: 'collegeName'
          },
          {
            label: '学校',
            prop: 'organName'
          },
          {
            label: '层次',
            prop: 'levelLabel'
          },
          {
            label: '学制',
            prop: 'schoolSystem'
          },
          {
            label: '更新人',
            prop: 'updateUserId'
          },
          {
            label: '更新时间',
            prop: 'updateDate'
          }
        ]
      },
      dialogVisible: false,
      moreVisible: false,
      title: '',
      componentName: '',
      componentData: null,
      width: '500px',
      direction: 'rtl',
      isShowBtn: true
    }
  },
  created() {
    this.organId = this.schoolOrgansListAll[0].id
    this.init()
  },
  computed: {
    ...mapGetters(['organList', 'schoolOrgansList']),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      val || (this.componentName = '')
    }
  },
  methods: {
    async init() {
      this.params.queryContent = ''
      this.initPage()
      this.getTableData()
      this.getLevelList()
    },
    getTableData() {
      const params = {
        ...this.params,
        organId: this.organId,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.specialtyList(params).then((res) => {
        this.tableData = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    // 处理表格需要转换的数据
    formatData(data) {
      return data
    },
    getLevelList() {
      api.listByCode({ code: '0015' }).then((res) => {
        this.levelOption = res.data
      })
    },
    initPage() {
      this.page.pageCurrent = 1
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
    // 新增
    handleAdd() {
      this.title = '新增专业'
      this.dialogVisible = true
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.isAdd = true
      this.componentData = {
        organId: this.organId,
        levelOption: this.levelOption
      }
    },
    // 学院信息
    schoolInfo() {
      this.title = '学院信息'
      this.dialogVisible = true
      this.componentName = 'School'
      this.width = '800px'
      this.isShowBtn = true
      this.componentData = {
        organId: this.organId
      }
    },
    confirm() {
      // this.tableConfig.loading = true
      this.$nextTick(() => {
        this.$refs[`${this.componentName}`].confirm((valid) => {
          this.dialogVisible = !valid
          if (valid) {
            this.init()
          }
        })
      })
    },
    // 编辑
    handleEdit({ row }) {
      this.title = '编辑专业'
      this.dialogVisible = true
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.isAdd = false
      this.componentData = {
        ...row,
        levelOption: this.levelOption
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
          { label: '专业名称', key: 'name' },
          { label: '所属学院', key: 'collegeName' },
          { label: '更新人', key: 'createUserId' },
          { label: '更新时间', key: 'updateDate' }
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
        api.deleteSpecialty({ id: row.id }).then((res) => {
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
  /*margin: 56px 24px 24px;*/
  /*position: absolute;*/
  /*top: 0;*/
  /*left: 0;*/
  /*right: 0;*/
  /*bottom: 0;*/
  /*background-color: #ffffff;*/
  box-shadow: 0 4px 8px 0 rgba(0, 11, 30, 0.08);
  margin: 0 20px 0;
  .table {
    .item {
      margin-right: 16px;
      color: #a3aab3;
    }
  }
  /*.demo-drawer__footer{*/
  /*  text-align: left;*/
  /*  position: absolute;*/
  /*  bottom: 0;*/
  /*}*/
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
