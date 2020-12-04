<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <!--           <el-button type="primary" @click="handlerAdd()">新增</el-button>-->
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
            <el-select
              class="organ-select"
              v-model="params.schoolOrganId"
              filterable
              v-if="showTeacher"
              clearable
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
              v-model="params.defencePlanId"
              placeholder="答辩计划"
              @change="init"
              clearable
            >
              <el-option
                v-for="item in defencePlanList"
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
          class="table"
          :tableConfig="tableConfig"
          :tableData="tableData"
          :colWidth="{ opear: '120px' }"
        >
          <div slot-scope="{ scope }" style="width:200px">
            <span class="opr" @click="handleEdit(scope)">编辑</span>
            <span class="opr" @click="handleAttr(scope)">详情</span>
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
import Add from './add.vue'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Index',
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
  },
  mixins: [download, selectMixin],
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
      defencePlanList: [],
      semesterOptions: [],
      levelOption: [],
      defenceTypeList: [],
      defenceStatusList: [],
      resultStatusList: [],
      params: {
        organId: '',
        defencePlanId: '',
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
              const arr = vm.semesterOptions.filter(
                (item) => item.value === value
              )
              return arr.length > 0 ? arr[0].label : '--'
            },
          },
          {
            label: '姓名',
            prop: 'realName',
          },
          {
            label: '层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              const arr = vm.levelOption.filter((item) => item.value === value)
              return arr.length > 0 ? arr[0].label : '--'
            },
          },
          {
            label: '专业',
            prop: 'professional',
          },
          {
            label: '论文选题',
            prop: 'selectName',
            width: '280',
          },
          {
            label: '是否答辩',
            prop: 'defenceStatus',
            type: 'enums',
            enums: (value) => {
              const arr = vm.defenceStatusList.filter(
                (item) => item.value === value
              )
              return arr.length > 0 ? arr[0].label : '--'
            },
          },
          {
            label: '答辩方式',
            prop: 'defenceType',
            type: 'enums',
            enums: (value) => {
              const arr = vm.defenceTypeList.filter(
                (item) => item.value === value
              )
              return arr.length > 0 ? arr[0].label : '--'
            },
          },
          {
            label: '答辩时间',
            width: '150',
            prop: 'defenceDate',
          },
          {
            label: '答辩评语',
            prop: 'defenceRemark',
          },
          {
            label: '答辩成绩',
            prop: 'defenceResult',
            type: 'enums',
            enums: (value) => {
              const arr = vm.resultStatusList.filter(
                (item) => item.value === value
              )
              return arr.length > 0 ? arr[0].label : '--'
            },
          },
          {
            label: '答辩老师',
            prop: 'defenceTeacher',
          },
          {
            label: '批改时间',
            width: '150',
            prop: 'correctDate',
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
      modelName: 'paper_defence_student',
    }
  },
  async created() {
    try {
      this.params.organId = this.organListAll[0].id
      this.params.schoolOrganId = this.schoolOrgansListAll[0].id
      this.initSelectOptions()
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
    // 从字典中获取下拉框数据
    initSelectOptions(isRefresh = false) {
      if (!isRefresh) {
        api.listByCode({ code: '0039' }).then((res) => {
          this.defenceTypeList = res.data.map((e) => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue,
            }
          })
        })
        api.listByCode({ code: '0040' }).then((res) => {
          this.resultStatusList = res.data.map((e) => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue,
            }
          })
        })
        api.listByCode({ code: '0042' }).then((res) => {
          this.defenceStatusList = res.data.map((e) => {
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
        api.listByCode({ code: '0024' }).then((res) => {
          this.semesterOptions = res.data.map((e) => {
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
          { organId: this.params.organId, pageSize: 100, pageCurrent: 1 },
          'paper_defence_plan',
          'pageList'
        )
        .then((res) => {
          this.defencePlanList = res.data.rows.map((e) => {
            return {
              label: e.planName,
              value: e.id,
            }
          })
        })
    },
    handlerExport() {
      const params = {
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...this.params,
      }
      this.download(
        params,
        '/course/paper_defence_student/defenceStudentExport',
        'POST',
        '学生答辩信息',
        'xls'
      )
    },
    getOrganId(item) {
      this.initPage()
      this.initSelectOptions(true)
      this.getTableData({ organId: item.id })
    },
    handleEdit({ row }) {
      this.dialogVisible = true
      this.title = '编辑'
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.componentData = {
        ...row,
        isAdd: false,
        modelName: this.modelName,
        organId: this.params.organId,
        defenceStatusList: this.defenceStatusList,
        defenceTypeList: this.defenceTypeList,
        resultStatusList: this.resultStatusList,
      }
    },
    async init() {
      this.initPage()
      this.getTableData()
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
        'defencePageList'
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
