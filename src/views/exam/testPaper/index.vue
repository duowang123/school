<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handlerAdd()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              v-model="params.organId"
              filterable
              clearable
              @change="init"
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in schoolOrgansListAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model.trim="params.queryContent"
              prefix-icon="el-icon-search"
              @change="init"
              placeholder="试卷"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
          <div slot-scope="{ scope }" style="width:200px">
            <span class="opr" @click="handleEdit(scope)">编辑</span>
            <span
              class="opr"
              @click="handleIsEnable(scope.row)"
            >{{scope.row.isEnable ? '禁用': '启用' }}</span>
            <span class="opr" @click="handleAttr(scope)">详情</span>
            <span class="opr" @click="handleDelete(scope)">删除</span>
          </div>
        </courses-table>
        <pagination
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :currentPage="page.pageCurrent"
          :pagination-config="paginationConfig"
        />
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
      class="drawer-content drawer-content-custom"
    >
      <div class="drawer-container-box">
        <component :is="componentName" :ref="componentName" :data="componentData" />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogAdd" width="950px">
      <component
        :is="componentName"
        :ref="componentName"
        :organId="params.organId"
        :id="id"
        :data="componentData"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
        <el-button type="primary" @click="preview()">预览</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import Add from './add.vue'
import * as api from '../api'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'StudentTransaction',
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
  },
  mixins: [selectMixin],
  computed: {
    ...mapGetters(['organList']),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
  },
  data(vm) {
    return {
      courseTypeList: [],
      noTestTypeList: [],
      levelList: [],
      id: null,
      params: {
        organId: '',
        queryContent: '',
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      addData: {},
      currentData: {},
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64',
        },
        columnConfig: [
          {
            label: '学校名称',
            prop: 'organName',
          },
          {
            label: '试卷编号',
            prop: 'paperNo',
          },
          {
            label: '试卷名称',
            prop: 'paperName',
          },
          {
            label: '层次',
            prop: 'levelLabel',
          },
          {
            label: '专业',
            prop: 'specialtyName',
          },
          {
            label: '课程',
            prop: 'courseName',
          },
          {
            label: '总分',
            prop: 'totalScore',
          },
          {
            label: '题目数',
            prop: 'itemNum',
          },
          {
            label: '考试时长',
            prop: 'finishTime',
          },
          {
            label: '试卷状态',
            prop: 'isEnable',
            type: 'enums',
            enums: (value) => {
              // 审核状态，1待审批，2通过，3不通过
              if (value) {
                return '启用'
              } else {
                return '禁用'
              }
            },
          },
        ],
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '552px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      dialogAdd: false,
    }
  },
  async created() {
    try {
      this.params.organId = this.schoolOrgansListAll[0].id
      this.getTableData()
    } catch (err) {
      console.log(err)
      this.tableData = []
    }
  },

  methods: {
    getOrganId(item) {
      this.initPage()
      this.getTableData({ organId: item.id })
    },
    handlerAdd() {
      this.id = null
      this.title = '新增'
      this.componentName = 'add'
      this.dialogAdd = true
      this.$nextTick(() => {
        this.$refs[`${this.componentName}`] &&
          this.$refs[`${this.componentName}`].open()
      })
    },
    async init() {
      this.initPage()
      this.getTableData()
    },
    handleIsEnable({ id, isEnable }) {
      const fn = () => {
        api
          .examPaperEnable({
            id,
            isEnable: !isEnable,
          })
          .then((res) => {
            if (isEnable) {
              this.$message.success('试卷禁用成功!')
            } else {
              this.$message.success('试卷启用成功!')
            }
            this.init()
          })
      }
      if (isEnable) {
        this.$confirm('是否继续禁用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          fn()
        })
      } else {
        fn()
      }
    },
    handleEdit({ row }) {
      this.id = row.id
      this.title = '编辑'
      this.componentName = 'add'
      this.dialogAdd = true
      this.$nextTick(() => {
        this.$refs[`${this.componentName}`] &&
          this.$refs[`${this.componentName}`].open()
      })
    },
    // 属性
    handleAttr({ row }) {
      delete row.id
      this.title = '属性'
      this.dialogVisible = true
      this.componentName = 'Attr'
      this.width = '450px'
      this.isShowBtn = false
      this.componentData = {
        data: row,
        keys: [
          { label: '试卷编号', key: 'paperNo' },
          { label: '试卷名称', key: 'paperName' },
          { label: '创建时间', key: 'createDate' },
          { label: '创建人', key: 'createUserId' },
          { label: '更新人', key: 'updateUserId' },
          { label: '更新时间', key: 'updateDate' },
        ],
      }
    },
    add() {
      this.tableData.push(...userInfo)
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page,
      }
      const res = await api.examPaperInfoList(params)
      this.tableData = res.data.rows || []
      this.page.totalCount = res.data.totalCount
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
    },
    preview() {
      this.$refs[`${this.componentName}`].preview()
    },
    confirm() {
      this.$nextTick(() => {
        this.$refs[`${this.componentName}`].confirm((valid) => {
          this.dialogAdd = !valid
          if (valid) {
            this.init()
          }
        })
      })
    },
    // 删除
    handleDelete({ row }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api.examPaperDelete({ id: row.id }).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.init()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.student-plan-right {
  .user-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .organ-box {
      display: flex;
      justify-content: flex-end;
    }
    /deep/ .el-form .el-input,
    .el-form .el-select,
    .el-form .el-textarea {
      width: 240px !important;
    }
    /deep/ .el-select {
      width: 256px !important;
    }
    /deep/ .el-select-dropdown {
      width: 256px !important;
    }
    /deep/ .el-input {
      width: 240px !important;
    }
    .organ-select {
      /deep/ .el-select {
        width: 256px;
      }
    }
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
.student-plan-right /deep/ .el-drawer__wrapper /deep/ {
  .attrStyle /deep/ {
    margin: 24px 24px 0 24px;
    .title {
      height: 24px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 24px;
    }
    .cont {
      height: 24px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
    }
  }
}
.search-btn {
  cursor: pointer;
  margin-left: 20px;
}
.opr {
  color: #3f93db;
  cursor: pointer;
  display: inline-flex;
  margin-right: 5px;
}
</style>
<style lang="scss">
.drawer-content-custom /deep/ .el-drawer__body {
  overflow: auto;
  overflow-x: hidden;
}
</style>
