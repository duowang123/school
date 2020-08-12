<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <!-- <el-button type="primary">导出</el-button> -->
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
              v-for="item in schoolYearList"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictValue"
            ></el-option>
          </el-select>
          <el-select class="organ-select" filterable v-model="params.organId" placeholder="请选择合作单位">
            <el-option
              v-for="item in organList"
              :key="item.id"
              @click.native="init"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="params.realNameOrcertNo"
            @keyup.enter.native="init"
            placeholder="姓名/身份证号/学号"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'StudentManage',
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
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
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
            label: '身份证号',
            prop: 'certNo',
            width: '210'
          },
          {
            label: '层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.levelList.filter((item) => item.dictValue === value)[0]
                .dictName
            }
          },
          {
            label: '年级',
            prop: 'schoolYear'
          },
          {
            label: '报考学校',
            prop: 'organName'
          },
          {
            label: '专业',
            prop: 'professionalName',
            width: '200'
          },
          {
            label: '联系电话',
            prop: 'mobile',
            width: '170px',
          },
          {
            label: '学籍状态',
            prop: 'studentStatus',
            width: '120px',
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
            width: '170px',
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
      schoolYearList: [],
      infoList: [],
      title: '',
      componentName: '',
      componentData: null,
      width: '600px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
    }
  },
  computed: {
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
    ...mapGetters(['organList']),
  },
  mounted() {
    setTimeout(async () => {
      this.$set(this.params, 'organId', this.organList[0].id)
      const levelData = (await api.getSysDictList({ code: '0015' })) || {}
      const infoData = (await api.getSysDictList({ code: '0029' })) || {}
      const schoolYearData = (await api.getSysDictList({ code: '0014' })) || {}
      const changeReasonData =
        (await api.getSysDictList({ code: '0022' })) || {}
      this.levelList = levelData.data || []
      this.infoList = infoData.data || []
      this.changeReasonList = changeReasonData.data || []
      this.schoolYearList = schoolYearData.data || []
      this.init()
    }, 500)
  },
  methods: {
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
          { label: '身份证', key: 'certNo' },
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
      margin-bottom: 24px;
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
