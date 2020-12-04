<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <!--          <el-button type="primary" @click="handlerAdd()">新增</el-button>-->
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
            <el-input
              v-model.trim="params.realNameOrcertNo"
              prefix-icon="el-icon-search"
              @change="init"
              placeholder="学号/证件号码/姓名"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table
          @btnAndLabel="btnAndLabel"
          @btnTxt="btnTxt"
          class="table"
          :tableConfig="tableConfig"
          :tableData="tableData"
          :colWidth="{ opear: '140px' }"
        >
          <div slot-scope="{ scope }" style="width:200px">
            <span class="opr" @click="handleEdit(scope)">编辑</span>
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
import Add from './add'
import ScanImage from '../scanImage'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Index',
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
    ScanImage,
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
      paperPlanList: [],
      levelOption: [],
      semesterOptions: [],
      resultStatusList: [],
      params: {
        organId: '',
        paperPlanId: '',
        realNameOrcertNo: '',
        schoolOrganId: '',
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
            label: '学号',
            prop: 'studentNo',
          },
          {
            label: '入学年级',
            prop: 'schoolYear',
          },
          {
            label: '入学学期',
            prop: 'semester',
            type: 'enums',
            enums: (value) => {
              return value ? (value === '1' ? '上学期' : '下学期') : '--'
            },
          },
          {
            label: '姓名',
            prop: 'realName',
          },
          {
            label: '层次',
            prop: 'levelName',
          },
          {
            label: '专业',
            prop: 'professionName',
          },
          {
            label: '选题',
            prop: 'selectName',
            width: '220',
          },
          {
            label: '指导老师',
            prop: 'guideTeacher',
          },
          {
            label: '提纲提交时间',
            width: '160',
            prop: 'outlineDate',
          },
          {
            label: '提纲',
            slot: {
              type: 'btnTxt',
              txt: '查看',
              prop: 'outlineUrl',
            },
          },
          {
            label: '初稿提交时间',
            width: '160',
            prop: 'firstDate',
          },
          {
            label: '初稿',
            slot: {
              type: 'btnTxt',
              txt: '查看',
              prop: 'firstUrl',
            },
          },
          {
            label: '初稿重复率',
            width: '100',
            prop: 'firstRemark',
          },
          {
            label: '初稿评语',
            prop: 'firstRemark',
          },
          {
            label: '初稿成绩',
            prop: 'firstResult',
          },
          {
            label: '终稿提交时间',
            width: '160',
            prop: 'lastDate',
          },
          {
            label: '终稿',
            slot: {
              type: 'btnTxt',
              txt: '查看',
              prop: 'lastUrl',
            },
          },
          {
            label: '终稿重复率',
            width: '100',
            prop: 'lastCheckResult',
            slot: {
              type: 'btnAndLabel',
              txt: '查看',
            },
          },
          {
            label: '终稿评语',
            prop: 'lastRemark',
          },
          {
            label: '终稿成绩',
            prop: 'lastResult',
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
      modelName: 'paper_write',
    }
  },
  created() {
    try {
      this.params.organId = this.organListAll[0].id
      this.params.schoolOrganId = this.schoolOrgansListAll[0].id
      // this.initSelectOptions()
      this.getTableData()
    } catch (err) {
      console.log(err)
      this.tableData = []
    }
  },
  watch: {
    dialogVisible(val) {
      val || (this.componentName = '')
    },
  },
  methods: {
    change(val) {
      if (val) this.initSelectOptions()
      this.init()
    },
    // 从字典中获取下拉框数据
    initSelectOptions(isRefresh = false) {
      if (!isRefresh) {
        api.listByCode({ code: '0040' }).then((res) => {
          this.resultStatusList = res.data.map((e) => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue,
            }
          })
        })
        api.listByCode({ code: '0024' }).then((res) => {
          this.semesterOptions = res.data.map((e) => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue,
            }
          })
        })
        api.listByCode({ code: '0006' }).then((res) => {
          this.levelOption = res.data.map((e) => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue,
            }
          })
        })
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
              value: e.id,
            }
          })
        })
    },
    getOrganId(item) {
      this.params.paperPlanId = ''
      this.initPage()
      this.initSelectOptions(true)
      this.getTableData({ organId: item.id })
    },
    async init() {
      this.initPage()
      this.getTableData()
    },
    btnTxt(row, prop) {
      window.location.href = this.$_getUrl(row[prop])
    },
    // 编辑
    handleEdit({ row }) {
      this.title = '编辑'
      this.dialogVisible = true
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.componentData = {
        ...row,
        isAdd: false,
        modelName: this.modelName,
        resultStatusList: this.resultStatusList,
      }
    },
    btnAndLabel(row) {
      console.log(row)
      this.title = '查看附件'
      this.isShowBtn = false
      this.componentData = row
      this.componentName = 'ScanImage'
      this.dialogVisible = true
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
          { label: '更新人', key: 'updateUserName' },
        ],
      }
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page,
      }
      const res = await api.commonPageRequest(
        params,
        this.modelName,
        'pageList'
      )
      this.tableData = res.data.rows || []
      this.page.totalCount = res.data.totalCount
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
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api
          .commonPageRequest({ id: row.id }, this.modelName, 'delete')
          .then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.initPage()
              this.getTableData()
            }
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
