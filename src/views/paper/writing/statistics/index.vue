<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handlerExport()">导出</el-button>
        </el-form-item>
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              v-model="params.organId"
              filterable
              v-if="showSchool"
              clearable
              @change="change"
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in schoolOrgansListAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              class="organ-select"
              v-model="params.schoolOrganId"
              filterable
              clearable
              v-if="showTeacher"
              lsSchool
              @change="init"
              placeholder="请选择教学点"
            >
              <el-option
                v-for="item in organListAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              class="organ-select"
              filterable
              v-model="params.paperPlanId"
              placeholder="论文计划"
              @change="init"
              clearable
            >
              <el-option
                v-for="item in paperPlanList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table
          class="table"
          :tableConfig="tableConfig"
          :tableData="tableData"
          :colWidth="{ opear: '140px' }"
        ></courses-table>
        <pagination
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :currentPage="page.pageCurrent"
          :pagination-config="paginationConfig"
        />
      </div>
    </div>
    <el-drawer
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
      :wrapperClosable="false"
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
  </div>
</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import * as api from '../../api'
import { mapGetters } from 'vuex'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Index',
  components: {
    coursesTable,
    pagination,
    Attr
  },
  mixins: [download, selectMixin],
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
  data(vm) {
    return {
      paperPlanList: [],
      levelOption: [],
      semesterOptions: [],
      params: {
        organId: '',
        paperPlanId: '',
        realNameOrcertNo: '',
        schoolOrganId: ''
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      addData: {},
      currentData: {},
      tableData: [],
      tableConfig: {
        loading: false,
        isHideOperation: true,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64'
        },
        columnConfig: [
          {
            label: '学校',
            prop: 'organName'
          },
          {
            label: '教学点',
            prop: 'schoolOrganName'
          },
          {
            label: '论文计划',
            prop: 'planName'
          },
          {
            label: '已选题人数',
            prop: 'selectNum'
          },
          {
            label: '未选题人数',
            prop: 'notSelectNum'
          },
          {
            label: '已提交提纲人数',
            prop: 'outlineNum'
          },
          {
            label: '未提交提纲人数',
            prop: 'notOutlineNum'
          },
          {
            label: '已提交初稿人数',
            prop: 'firstNum'
          },
          {
            label: '未提交初稿人数',
            prop: 'notFirstNum'
          },
          {
            label: '已提交终稿人数',
            prop: 'lastNum'
          },
          {
            label: '未提交终稿人数',
            prop: 'notLastNum'
          }
        ]
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '552px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      modelName: 'paper_write'
    }
  },
  async created() {
    try {
      this.getPaperPlan()
      this.getTableData()
    } catch (err) {
      console.log(err)
      this.tableData = []
    }
  },
  watch: {
    dialogVisible(val) {
      val || (this.componentName = '')
    }
  },
  methods: {
    change() {
      this.getPaperPlan()
      this.init()
    },
    getPaperPlan() {
      if (!this.params.organId) {
        return false
      }
      api
        .commonPageRequest(
          { organId: this.params.organId },
          'paper_plan',
          'listByOrganId'
        )
        .then((res) => {
          this.paperPlanList = res.data.map((e) => {
            return {
              label: e.paperName,
              value: e.id
            }
          })
        })
    },
    getOrganId(item) {
      this.params.paperPlanId = ''
      this.initPage()
      this.getPaperPlan(true)
      this.getTableData({ organId: item.id })
    },
    async init() {
      this.initPage()
      this.getTableData()
    },
    // 导出
    handlerExport() {
      // const params = {
      //   pageCurrent: this.page.pageCurrent,
      //   pageSize: this.page.pageSize,
      //   ...this.params
      // }
      // this.download(
      //   params,
      //   '/course/exam/export',
      //   'POST',
      //   '学生考试安排',
      //   'xlsx'
      // )
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
          { label: '学号', key: 'studentNo' },
          { label: '姓名', key: 'realName' },
          { label: '创建时间', key: 'createDate' },
          { label: '创建人', key: 'createUserName' },
          { label: '更新时间', key: 'updateDate' },
          { label: '更新人', key: 'updateUserName' }
        ]
      }
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params
      }
      const res = await api.commonPageRequest(
        params,
        this.modelName,
        'reportList'
      )
      this.tableData = res.data || []
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
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
    // 删除
    handleDelete({ row }) {
      // this.$confirm('是否继续删除?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   api.commonPageRequest({ id: row.id }, this.modelName, 'delete').then((res) => {
      //     if (res.code === 200) {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       })
      //       this.initPage()
      //       this.getTableData()
      //     }
      //   })
      // })
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getTableData()
    }
  }
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
