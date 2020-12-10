<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handlerAdd">新增</el-button>
          <el-button type="primary" @click="exportExcel">导出</el-button>
          <el-button type="primary" @click="batchApprove" v-all>批量审核</el-button>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              v-model="params.organId"
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
              v-model="params.schoolOrganId"
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
            <el-select
              class="organ-select"
              filterable
              v-model="params.graduationStatus"
              placeholder="毕业结论"
            >
              <el-option
                v-for="item in resultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-model.trim="params.studentNoOrCertNo"
              prefix-icon="el-icon-search"
              @change="init"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table
          class="table"
          :tableConfig="tableConfig"
          :tableData="tableData"
          @handle-selection-change="handleSelectionChange"
          :colWidth="{ opear: '140px' }"
          @btnTxt="btnTxt"
        >
          <div slot-scope="{ scope }" style="width:200px">
            <span class="opr" @click="handleExamine(scope)" v-all>审核</span>
            <span class="opr" @click="handleAttr(scope)">详情</span>
            <!--          <span class="opr" @click="handleDelete(scope)">删除</span>-->
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
    <!--    <el-dialog title="新增" :close-on-click-modal="false" append-to-body :visible.sync="dialogVisible" width="900px">-->
    <!--      <component is="Add" ref="Add" :data="componentData" />-->
    <!--      <div v-show="isShowBtn" class="demo-drawer__footer">-->
    <!--        <el-button type="primary" @click="confirm">确 定</el-button>-->
    <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
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
import Examine from './examine'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Index',
  mixins: [download],
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
    Examine
  },
  mixins: [selectMixin],
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
      schoolYearOptions: [], // 学年
      semesterOptions: [], //学期
      statusOptions: [],
      resultList: [
        { value: '1', label: '通过' },
        { value: '2', label: '不通过' }
      ],
      selValue: [],
      params: {
        organId: '',
        studentNoOrCertNo: '',
        graduationStatus: '',
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
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        selection: {
          type: 'selection',
          width: '55'
        },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64'
        },
        columnConfig: [
          {
            label: '学校',
            prop: 'organName',
            width: '170'
          },
          {
            label: '学号',
            prop: 'studentNo',
            width: '120'
          },
          {
            label: '姓名',
            prop: 'realName'
          },
          {
            label: '性别',
            prop: 'sexLabel'
          },
          {
            label: '证件类型',
            prop: 'certTypeLabel'
          },
          {
            label: '证件号码',
            prop: 'certNo',
            width: '190'
          },
          {
            label: '层次',
            prop: 'levelLabel'
          },
          {
            label: '年级',
            prop: 'schoolYear'
          },
          {
            label: '专业',
            prop: 'professionName',
            width: '180'
          },
          {
            label: '联系电话',
            width: '150',
            prop: 'phone'
          },
          {
            label: '学籍状态',
            prop: 'studentStatusLabel'
          },
          {
            label: '课程学分',
            prop: 'allScore'
          },
          {
            label: '积累学分',
            prop: 'getScore'
          },
          {
            label: '学分审核',
            prop: 'creditStatusLabel',
            type: 'customStyle',
            callback: (val) => {
              return {
                color: val === '不通过' ? '#CF0000' : '#67C23A'
              }
            }
          },
          {
            label: '论文审核',
            prop: 'paperStatusLabel',
            type: 'customStyle',
            callback: (val) => {
              return {
                color: val === '不通过' ? '#CF0000' : '#67C23A'
              }
            }
          },
          {
            label: '学费缴纳',
            prop: 'oweMoney'
          },
          {
            label: '学费审核',
            prop: 'moneyStatusLabel',
            type: 'customStyle',
            callback: (val) => {
              return {
                color: val === '不通过' ? '#CF0000' : '#67C23A'
              }
            }
          },
          {
            label: '毕业审核结论',
            width: '120',
            prop: 'graduationStatusLabel',
            type: 'customStyle',
            callback: (val) => {
              return {
                color: val === '不通过' ? '#CF0000' : '#67C23A'
              }
            }
          },
          {
            label: '毕业登记表',
            width: '100',
            slot: {
              prop: 'formFile',
              type: 'btnTxt',
              txt: '查看'
            }
          },
          {
            label: '相片',
            slot: {
              prop: 'picture',
              type: 'btnTxt',
              txt: '查看'
            }
          },
          {
            label: '提交申请时间',
            width: '280',
            prop: ''
          },
          {
            label: '审核时间',
            width: '280',
            type: 'timeslot',
            value: (value) => {
              return (
                (value.approveStartDate || '--') +
                '-' +
                (value.approveEndDate || '--')
              )
            }
          },
          {
            label: '教学点',
            prop: 'schoolOrganName',
            width: '170'
          }
        ]
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '800px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      modelName: 'stu_graduate'
    }
  },
  async created() {
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
    }
  },
  methods: {
    getOrganId(item) {
      this.initPage()
      // this.initSelectOptions(true)
      this.getTableData({ organId: item.id })
    },
    handlerAdd() {
      this.dialogVisible = true
      this.title = '新增'
      this.width = '856px'
      this.componentName = 'Add'
      this.isShowBtn = true
      this.componentData = {
        organId: this.params.organId
      }
      this.$nextTick(() => {
        this.$refs.Add.init()
      })
    },
    exportExcel() {
      const params = {
        ...this.params,
        ...this.page
      }
      this.download(
        params,
        '/course/stu_graduate/export',
        'POST',
        '毕业学生申请',
        'xlsx'
      )
    },
    btnTxt(row, prop) {},
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
          { label: '创建人', key: 'createUserName' },
          { label: '更新时间', key: 'updateDate' },
          { label: '更新人', key: 'updateUserName' }
        ]
      }
    },
    batchApprove() {
      if (!this.selValue.length) {
        this.$message.error('请选择学生!')
        return false
      }
      this.title = '审核'
      this.dialogVisible = true
      this.componentName = 'Examine'
      this.width = '550px'
      this.isShowBtn = true
      this.componentData = {
        batch: true,
        ids: this.selValue,
        student: {}
      }
      this.$nextTick(() => {
        this.$refs.Examine.init()
      })
    },
    // 审核
    handleExamine({ row }) {
      this.title = '审核'
      this.dialogVisible = true
      this.componentName = 'Examine'
      this.width = '550px'
      this.isShowBtn = true
      this.componentData = {
        batch: false,
        student: row
      }
      this.$nextTick(() => {
        this.$refs.Examine.init()
      })
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData() {
      const params = {
        ...this.params,
        ...this.page
      }
      const res = await api.commonPageRequest(
        params,
        this.modelName,
        'approvePageList'
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
    handleSelectionChange(val) {
      this.selValue = val.map((e) => e.id)
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
