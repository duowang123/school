<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addTransaction">新增</el-button>
          <el-upload
            style="display: inline-block; margin: 0 10px;"
            :on-change="onFileChange"
            :auto-upload="false"
            :show-file-list="false"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button plain type="primary">导入</el-button>
          </el-upload>
          <el-button plain type="primary" @click="handlerExport()">导出</el-button>
          <el-button plain type="primary">
            <a download :href="STATIC_BASE + '/static/缴费导入.xls'">
              <i class="el-icon-download el-icon--left"></i>模板下载
            </a>
          </el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="organId"
            filterable
            v-if="showSchool"
            @change="getTableData"
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
        :colWidth="{ opear: '100px' }"
      >
        <template slot-scope="{ scope }">
          <div class="item">
            <!--            <el-button type="text" @click="handleEdit(scope)">编辑</el-button>-->
            <el-button type="text" @click="handleAttr(scope)">详情</el-button>
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
import { STATIC_BASE } from '@/constant/global'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import organMixin from '@/views/mixins/organMixin'
import * as api from '../api'
import Add from './add'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'ManagePaylog',
  mixins: [organMixin, download, selectMixin],
  components: {
    coursesTable,
    pagination,
    Add,
    Attr
  },
  data() {
    const vm = this
    return {
      STATIC_BASE,
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
            label: '学号',
            prop: 'studentNo',
            width: '120'
          },
          {
            label: '姓名',
            prop: 'realName'
          },
          {
            label: '学生类型',
            prop: 'studentType'
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
            label: '缴费年度',
            prop: 'schoolYear'
          },
          {
            label: '实收金额',
            prop: 'payMoney'
          },
          {
            label: '缴费时间',
            prop: 'createDate'
          },
          {
            label: '缴费方式',
            prop: 'payType',
            type: 'enums',
            enums: (value) => {
              const arr = vm.payTypeOptions.filter(
                (item) => item.dictValue === value
              )
              return arr.length > 0 ? arr[0].dictName : '--'
            }
          },
          // {
          //   label: '状态',
          //   prop: 'studentStatus'
          // },
          // {
          //   label: '票据编号',
          //   prop: 'payNo'
          // },
          {
            label: '收费人',
            prop: 'receiveUser'
          },
          {
            label: '教学点',
            prop: 'schoolOrganName'
          }
        ]
      },
      levelOption: [],
      specialtyOptions: [],
      payTypeOptions: [],
      dialogVisible: false,
      title: '',
      width: '500px',
      componentName: '',
      changePictureUrl: '',
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
      this.title = '新增学费收费'
      this.componentName = 'Add'
      this.width = '450px'
      this.isShowBtn = true
      this.componentData = {
        isAdd: true,
        organId: this.organId,
        payTypeOptions: this.payTypeOptions
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
      api.getStudentPayLogList(params).then((res) => {
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
      api.listByCode({ code: '0031' }).then((res) => {
        this.payTypeOptions = res.data
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
    handleEdit({ row }) {},
    // 属性
    handleAttr({ row }) {
      this.title = '详情'
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
    handlerExport() {
      const params = {
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        organId: this.organId,
        ...this.params
      }
      this.download(
        params,
        '/course/student_pay_log/studentPayExport',
        'POST',
        '学生缴费信息',
        'xls'
      )
    },
    //阻止upload的自己上传，进行再操作
    onFileChange(data) {
      const file = data.raw
      const param = new FormData()
      param.append('excelFile', file, file.name)
      api.stundentPayLogImport(param).then((res) => {
        this.$message.info(res.data)
        this.init()
      })
    },
    // 查看
    btnTxt(row) {
      this.changePictureUrl = row.changePictureUrl
      this.dialogVisible = true
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
  /deep/ .el-drawer__body {
    padding-bottom: 80px;
    overflow-y: auto !important;
  }
  .demo-drawer__footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .el-button {
      float: left;
    }
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
