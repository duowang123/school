<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-upload
            class="upload-demo"
            style="margin-left: 16px; display: inline-flex;"
            :on-change="onFileChange"
            :auto-upload="false"
            :show-file-list="false"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button plain type="primary">导入</el-button>
          </el-upload>
          <el-button plain type="primary" @click="exportExcel" style="margin-left: 16px">导出Excel</el-button>
          <el-button plain type="primary" style="margin-left: 16px">
            <a download :href="STATIC_BASE + '/static/报名清单.xls'">
              <i class="el-icon-download el-icon--left"></i>模板下载
            </a>
          </el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-if="showSchool"
            clearable
            filterable
            v-model="params.organId"
            @change="organChange"
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
            @change="organChange"
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
            @change="getTableData"
            @keyup.enter.native="getTableData"
            placeholder="姓名/证件号码"
          ></el-input>
          <el-button
            type="primary"
            style="height: 40px;margin-left: 16px"
            @click="handlerSearch"
          >高级搜索</el-button>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table
        class="table"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colWidth="{ opear: '140px' }"
      >
        <div slot-scope="{ scope }" style="width:200px">
          <el-button class="opr" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button class="opr" type="text" @click="handleAttr(scope.row)">详情</el-button>
          <el-button class="opr" type="text" v-all @click="handleDelete(scope.row)">删除</el-button>
        </div>
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
      title="属性"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row">
          <div class="title">考生号</div>
          <div class="cont">{{ currentData.testNo }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近更新时间</div>
          <div class="cont">{{ currentData.updateDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">更新人</div>
          <div class="cont">{{ currentData.updateUserName }}</div>
        </div>
        <div class="content-row">
          <div class="title">创建人</div>
          <div class="cont">{{ currentData.createUserName }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="dialogVisible" width="950px">
      <div style="height: 550px">
        <!-- <add-user-from ref="addUserFrom" :is-add="isAdd" :user="addUser" organ-id="1"/> -->
        <add ref="addFrom" :data="currentData" :organId="params.organId" :is-add="isAdd" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('addFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <search :dialogVisible.sync="serachVisable" :organId="params.organId" @closeDia="closeDia" />
  </div>
</template>
<script>
import * as api from '../api'
import Add from './add'
import { mapGetters } from 'vuex'
import { STATIC_BASE } from '@/constant/global'
import Search from '@/components/search'
import mixin from '../../../mixins/download'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import tableMixin from '@/components/Table/tableMixin'
import selectMixin from '../../../mixins/select.js'

export default {
  components: {
    Add,
    Search,
    coursesTable,
    pagination
  },
  mixins: [mixin, tableMixin, selectMixin],
  name: 'Admit',
  props: {
    organType: {
      type: Number,
      default: 1 // 总院： 1, 分院： 2
    }
  },
  data() {
    const vm = this
    return {
      isAdd: true,
      roles: [],
      STATIC_BASE,
      levelOption: [],
      dialogVisible: false,
      addUser: {},
      drawer: false,
      currentData: {},
      params: {
        organId: '',
        realNameOrcertNo: '',
        schoolOrganId: ''
      },
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
            label: '考生号',
            prop: 'testNo',
            width: 200
          },
          {
            label: '姓名',
            prop: 'realName'
          },
          {
            label: '教学点',
            prop: 'schoolOrganName',
            width: '170'
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '男' : '女'
            }
          },
          {
            label: '证件类型',
            prop: 'certTypeLabel'
          },
          {
            label: '证件号码',
            prop: 'certNo',
            width: '160'
          },
          {
            label: '报考一志愿学校',
            prop: 'organName',
            width: '160'
          },
          {
            label: '报考一志愿专业',
            prop: 'professionalName',
            width: '160'
          },
          {
            label: '报考一志愿学制',
            prop: 'schoolSystem'
          },
          {
            label: '报考二志愿学校',
            prop: 'organName2',
            width: '160'
          },
          {
            label: '报考二志愿专业',
            prop: 'professionalName2',
            width: '160'
          },
          {
            label: '报考二志愿学制',
            prop: 'schoolSystem2'
          },
          {
            label: '年级',
            prop: 'schoolYear'
          },
          {
            label: '报考层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.showEnterLevel(value)
            }
          },
          {
            label: '考试方式',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.showText(value, 'testType')
            }
          },
          {
            label: '学院审核',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.showText(value, 'approveStatus')
            }
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      },
      tableData: [],
      map: {},
      formData: {},
      lecturerExt: {},
      ctrl: {
        loading: false,
        dialogVisible: false,
        proportionDialogVisible: false,
        viewVisible: false
      },
      opts: {
        statusIdList: []
      },
      visible: '',
      testTypeList: [],
      approveStatusList: [],
      registerTypeList: [],
      serachVisable: false
    }
  },
  computed: {
    ...mapGetters(['organList', 'teacherList', 'schoolOrgansList'])
  },
  async created() {
    api.listByCode({ code: '0006' }).then((res) => {
      this.levelOption = res.data.map((e) => {
        return {
          id: e.id,
          label: e.dictName,
          value: e.dictValue
        }
      })
    })
    this.registerTypeList =
      ((await api.listByCode({ code: '0012' })) || {}).data || []
    this.testTypeList =
      ((await api.listByCode({ code: '0009' })) || {}).data || []
    this.init()
  },
  methods: {
    handlerSearch() {
      this.serachVisable = true
    },
    onFileChange(data) {
      const file = data.raw
      const param = new FormData()
      param.append('excelFile', file, file.name)
      api.stundentSignImport(param).then((res) => {
        this.$message.info(res.data)
        this.getTableData()
      })
    },
    closeDia(params) {
      this.initPageCurrent()
      this.getTableData(params)
    },
    showText(value, key) {
      if (key === 'approveStatus') {
        if (value === '1') {
          return '未审核'
        } else if (value === '2') {
          return '合格'
        } else if (value === '3') {
          return '待定'
        } else {
          return '不通过'
        }
      }
      if (key === 'testType') {
        if (!value) return value
        return this.testTypeList.filter((item) => item.dictValue === value)[0]
          .dictName
      }
    },
    showEnterLevel(value = '') {
      if (!value || !Array.isArray(this.levelOption)) return value
      return this.levelOption.filter((item) => item.value === value)[0].label
    },
    resetUser() {
      this.addUser = {
        organId: '',
        address: '',
        email: '',
        job: '',
        mobile: '',
        phone: '',
        pictureUrl: '',
        realName: '', // 姓名
        record: '', // 学历
        roleId: '',
        sex: '1',
        title: '',
        university: '',
        userName: '' // 用户名
      }
    },
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex === 0 ? 'background:#E0E8EF;color: #333333;' : ''
    },
    // 搜索
    searchBtn() {},
    init() {
      this.initPageCurrent()
      this.getTableData()
    },
    initPageCurrent() {
      this.page.pageCurrent = 1
    },
    organChange() {
      this.getTableData()
    },
    getTableData(query) {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...query
      }
      api.studentSignList(params).then((res) => {
        this.tableData = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    exportExcel() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      this.download(
        params,
        '/course/studentSign/enter/export',
        'POST',
        '批量导出',
        'xlsx'
      )
    },
    handleAttr(data) {
      this.currentData = data
      this.drawer = true
    },
    handleAdd() {
      this.currentData = {}
      this.isAdd = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addFrom && this.$refs.addFrom.handlerData()
      })
    },
    submit(ref) {
      this.$refs[ref].validate((valid) => {
        this.dialogVisible = !valid
        if (valid) {
          this.init()
        }
      })
    },
    addSave() {
      this.dialogVisible = false
    },
    updateSave() {
      this.dialogVisible = false
    },
    // 修改跳页面操作
    handleEdit(user) {
      this.addUser = this.resetUser()
      this.currentData = this.$_cloneDeep(user)
      this.addUser = this.$_cloneDeep(user)
      this.isAdd = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addFrom && this.$refs.addFrom.handlerData()
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.page.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      // console.log(`当前页: ${val}`)
      this.getTableData()
    },
    handleDelete({ id }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteStudentSign({ id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.init()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headquarters-user-manage {
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
  }
}
.drawer-content {
  .content-row {
    margin: 0 24px 24px 24px;
    .title {
      height: 24px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
      line-height: 24px;
    }
    .cont {
      height: 24px;
      font-size: 14px;
      font-weight: 500;
      line-height: 24px;
      font-family: PingFangSC, PingFangSC-Medium;
      text-align: left;
      color: #333333;
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
.iconfont {
  margin-right: 10px;
}
</style>
