<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <!--          <el-button type="primary" @click="addTransaction">新增</el-button>-->
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="organId"
            filterable
            v-if="showSchool"
            clearable
            @change="getTableData"
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
            v-model="params.schoolOrganId "
            filterable
            v-if="showTeacher"
            lsSchool
            clearable
            @change="getTableData"
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
            @change="organChange"
            placeholder="姓名/证件号码/学号"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table
        class="table"
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colWidth="{ opear: '90px' }"
      >
        <template slot-scope="{ scope }">
          <div class="item">
            <!--            <el-button type="text" @click="handleEdit(scope)">编辑</el-button>-->
            <el-button type="text" @click="handleAttr(scope)">属性</el-button>
            <!--            <el-button type="text" @click="handleDelete(scope)">删除</el-button>-->
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
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import ImgList from '@/components/ImgList'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import organMixin from '@/views/mixins/organMixin'
import selectMixin from '@/views/mixins/select.js'
import * as api from '../api'

export default {
  name: 'ManagePayable',
  mixins: [organMixin, selectMixin],
  components: {
    ImgList,
    coursesTable,
    pagination,
    Attr
  },
  data() {
    const vm = this
    return {
      params: {
        realNameOrcertNo: '',
        schoolOrganId: ''
      },
      organId: '',
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '50'
        },
        columnConfig: [
          {
            label: '学校',
            prop: 'organName'
          },
          {
            label: '学籍状态',
            prop: 'studentStatus',
            type: 'enums',
            enums: (value) => {
              return vm.studentStatusOptions.filter(
                (item) => item.dictValue === value
              )[0].dictName
            }
          },
          {
            label: '学年',
            prop: 'schoolYear'
          },
          {
            label: '学号',
            prop: 'studentNo'
          },
          {
            label: '姓名',
            prop: 'realName'
          },
          {
            label: '层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.levelOption.filter((item) => item.value === value)[0]
                .label
            }
          },
          {
            label: '专业',
            prop: 'professionalName'
          },
          {
            label: '学生类型',
            prop: 'studentType'
          },
          {
            label: '学费',
            prop: 'chargeMoney'
          },
          {
            label: '其他费用',
            prop: 'moneyDetail',
            width: '96',
            slot: {
              type: 'btnTxt',
              txt: '查看'
            }
          },
          {
            label: '总费用',
            prop: 'allMoney'
          }
        ]
      },
      levelOption: [],
      specialtyOptions: [],
      moneyTypeOptions: [],
      studentStatusOptions: [],
      dialogVisible: false,
      title: '',
      width: '500px',
      componentName: '',
      componentData: {},
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
    this.organId = this.organListAll[0].id
    this.params.schoolOrganId = this.schoolOrgansListAll[0].id
    this.initSelectOptions()
  },
  computed: {
    // ...mapGetters(['organList']),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200]
      }
    }
  },
  methods: {
    searchChange() {
      this.getList()
    },
    // 新增
    addTransaction() {
      this.dialogVisible = true
      this.title = '新增学分收费标准'
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.componentData = {
        isAdd: true,
        organId: this.organId,
        specialtyOptions: this.specialtyOptions,
        levelOption: this.levelOption
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
    getTableData() {
      const params = {
        ...this.params,
        organId: this.organId,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.getStudentPayAbleList(params).then((res) => {
        this.tableData = this.formatData(res.data.rows)
        this.tableData.forEach((obj) => {
          obj.studentType = '网教'
        })
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
      api.listByCode({ code: '0006' }).then((res) => {
        this.levelOption = res.data.map((e) => {
          return {
            id: e.id,
            label: e.dictName,
            value: e.dictValue
          }
        })
      })
      api.listByCode({ code: '0025' }).then((res) => {
        this.moneyTypeOptions = res.data
      })
      api.listByCode({ code: '0029' }).then((res) => {
        this.studentStatusOptions = res.data
      })
    },
    organChange() {
      this.getTableData()
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
    handleEdit({ row }) {
      this.title = '编辑学分收费标准'
      this.dialogVisible = true
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.componentData = {
        ...row,
        isAdd: false,
        specialtyOptions: this.specialtyOptions,
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
          { label: '学号', key: 'studentNo' },
          { label: '姓名', key: 'realName' },
          { label: '创建时间', key: 'createDate' },
          { label: '创建人', key: 'createUserName' }
        ]
      }
    },
    // 查看
    btnTxt(row) {
      // this.key += 1
      this.title = '其他费用'
      this.dialogVisible = true
      this.componentName = 'Attr'
      this.width = '450px'
      this.isShowBtn = false
      console.log(row.moneyDetail)
      console.log(typeof row.moneyDetail)
      let moneyDetailObj = null
      if (typeof row.moneyDetail === 'string') {
        moneyDetailObj = JSON.parse(row.moneyDetail)
      } else {
        moneyDetailObj = row.moneyDetail
      }
      const moneyDetail = moneyDetailObj.map((t) => {
        return {
          moneyType: this.moneyTypeOptions.filter(
            (item) => item.dictValue === t.moneyType
          )[0].dictName,
          chargeMoney: t.chargeMoney
        }
      })
      this.componentData = {
        data: Object.assign(row, {
          moneyDetail: moneyDetail
        }),
        keys: [
          { label: '学号', key: 'studentNo' },
          { label: '姓名', key: 'realName' },
          {
            label: '其他费用',
            key: 'moneyDetail',
            isTable: true,
            tableConfig: [
              { label: '费用类型', prop: 'moneyType' },
              { label: '费用标准', prop: 'chargeMoney' }
            ]
          }
        ]
      }
    },
    handleDelete({ row }) {
      // this.$confirm('是否继续删除?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   api.deleteCreditStandard({ id: row.id }).then(res => {
      //     if (res.code === 200) {
      //       this.$message({
      //         message: '删除成功',
      //         type: 'success'
      //       })
      //       this.init()
      //     } else {
      //       this.$message({
      //         message: '删除失败',
      //         type: 'error'
      //       })
      //     }
      //   })
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
.student-plan-right {
  .user-form {
    padding-bottom: 16px;
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
    .organ-select {
      /deep/ .el-select {
        width: 256px;
      }
    }
  }
  .demo-drawer__footer {
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
