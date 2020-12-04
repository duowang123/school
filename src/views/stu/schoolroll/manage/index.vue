<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            @change="init()"
            v-model="params.schoolYear"
            clearable
            placeholder="请选择年级"
          >
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              @change="getOrganId()"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="organ-select"
            v-model="params.organId"
            filterable
            @change="getOrganId()"
            v-if="showSchool"
            clearable
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
            @change="getOrganId()"
            v-if="showTeacher"
            placeholder="请选择教学点"
          >
            <el-option
              v-for="item in organListAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="params.realNameOrcertNo"
            @keyup.enter.native="init"
            placeholder="姓名/证件号码/学号"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
        <template slot-scope="{ scope }">
          <div class="item">
            <el-button type="text" @click="handlerPreview(scope)">学籍信息</el-button>
            <el-button type="text" @click="handlerAttr(scope)">属性</el-button>
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
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      destroy-on-close
      :direction="direction"
      :wrapperClosable="false"
      class="drawer-content drawer-content-custom"
    >
      <component
        :is="componentName"
        :ref="componentName"
        :data="componentData"
        :dialogVisible.sync="dialogVisible"
      />
      <div v-show="isShowBtn" class="demo-drawer__footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '@/api/organ'
import search from '@/components/search'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import Info from './info'
import mixin from '../../../mixins/download'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'
export default {
  name: 'StudentManage',
  mixins: [mixin, selectMixin],
  components: {
    coursesTable,
    pagination,
    Attr,
    Info,
  },
  data(vm) {
    return {
      params: {
        organId: '',
        realNameOrcertNo: '',
        schoolYear: '',
        schoolOrganId: '',
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      tableData: [],
      tableConfig: {
        loading: false,
        // headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '50',
        },
        columnConfig: [
          {
            label: '考生号',
            prop: 'testNo',
            width: '120',
          },
          {
            label: '学号',
            prop: 'studentNo',
            width: '120',
          },
          {
            label: '姓名',
            prop: 'realName',
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '男' : '女'
            },
          },
          {
            label: '教学点',
            prop: 'schoolOrganName',
            width: '170',
          },
          {
            label: '证件类型',
            prop: 'certTypeLabel',
          },
          {
            label: '证件号码',
            prop: 'certNo',
            width: '170',
          },
          {
            label: '层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.levelList.filter((item) => item.dictValue === value)[0]
                .dictName
            },
          },
          {
            label: '年级',
            prop: 'schoolYear',
          },
          {
            label: '注册学校',
            prop: 'organName',
          },
          {
            label: '专业',
            prop: 'professionalName',
          },
          {
            label: '转专业',
            prop: 'enterTransfer',
            width: '120',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '是' : '否'
            },
          },
          {
            label: '联系电话',
            prop: 'mobile',
          },
          {
            label: '学籍状态',
            prop: 'studentStatus',
            type: 'enums',
            enums: (value) => {
              return vm.infoList.filter((item) => item.dictValue === value)[0]
                .dictName
            },
          },
          {
            label: '异动原因',
            prop: 'changeReason',
            type: 'enums',
            enums: (value) => {
              if (!value) return value
              const valueArr = value.split(',')
              const arr = vm.changeReasonList.filter((item) =>
                valueArr.includes(item.dictValue)
              )
              let str = ''
              if (arr.length) {
                arr.forEach((element) => {
                  str = str + element.dictName + ','
                })
              }
              return str.substring(0, str.length - 1)
            },
          },
        ],
      },
      levelList: [],
      changeReasonList: [],
      infoList: [],
      title: '',
      componentName: '',
      componentData: null,
      width: '600px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      organListAll: [],
      schoolOrgansListAll: [],
    }
  },
  computed: {
    ...mapGetters([
      'organList',
      'teacherList',
      'schoolOrgansList',
      'schoolYearOptions',
    ]),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
    isAll() {
      return this.$store.getters.userOrganId + '' === '1'
    },
    isSchool() {
      return (
        this.$store.getters.property && this.$store.getters.property === '1'
      )
    },
    isTeacher() {
      return (
        this.$store.getters.property && this.$store.getters.property === '2'
      )
    },
  },
  created() {
    const all = {
      id: '',
      name: '全部',
      oldName: '全部',
    }
    this.organListAll = [all, ...this.teacherList]
    this.schoolOrgansListAll = [all, ...this.schoolOrgansList]
    this.params.organId = this.organListAll[0].id
    this.params.schoolOrganId = this.schoolOrgansListAll[0].id
  },
  mounted() {
    setTimeout(async () => {
      const levelData = (await api.getSysDictList({ code: '0015' })) || {}
      const infoData = (await api.getSysDictList({ code: '0029' })) || {}
      const changeReasonData =
        (await api.getSysDictList({ code: '0022' })) || {}
      this.levelList = levelData.data || []
      this.infoList = infoData.data || []
      this.changeReasonList = changeReasonData.data || []
      this.init()
    }, 500)
  },
  methods: {
    exportExcel() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
      }
      this.download(
        params,
        '/course//student_roll/enter/export',
        'POST',
        '批量导出',
        'xls'
      )
    },
    async init() {
      await this.initPage()
      await this.getTableData()
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
      }
      api.studentRollList(params).then((res) => {
        this.tableData = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.init()
    },
    // 属性
    // 属性
    handlerAttr({ row }) {
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
          { label: '证件类型', key: 'certTypeLabel' },
          { label: '证件号码', key: 'certNo' },
          { label: '电话', key: 'mobile' },
        ],
      }
    },
    getOrganId() {
      this.getTableData()
    },
    handlerPreview({ row }) {
      this.componentData = {
        data: row,
        organId: this.params.organId,
      }
      this.title = ''
      this.componentName = 'Info'
      this.width = '1200px'
      this.isShowBtn = false
      this.dialogVisible = true
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
  },
}
</script>

<style lang="scss" scoped>
.student-plan-right {
  .user-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    .organ-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 16px;
      .organ-select {
        /deep/ .el-select {
          width: 256px;
        }
      }
    }
  }
}
.column-preview {
  height: 24px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #3f93db;
  line-height: 24px;
}
.student-plan-right /deep/ .el-drawer__wrapper /deep/ {
  .attrStyle /deep/ {
    margin: 24px;
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
  .demo-drawer__footer {
    text-align: center;
  }
}
</style>

<style lang="scss">
.drawer-content-custom /deep/ .el-drawer__body {
  overflow: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}
/*.el-select-dropdown__wrap {*/
/*  margin-bottom: 0 !important;*/
/*}*/
</style>
