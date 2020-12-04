<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="primary" @click="hanlderExport()">导出</el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="params.organId"
            filterable
            v-if="showSchool"
            clearable
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
          <el-select
            class="organ-select"
            @change="getTableData"
            v-model="params.schoolYear"
            clearable
            placeholder="年级"
          >
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in schoolYearOptions"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="params.queryContent"
            @change="getTableData"
            @keyup.enter.native="getTableData"
            placeholder="姓名/证件号码"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table
        class="table"
        :tableConfig="tableConfig"
        @btnTxt="btnTxt"
        :tableData="tableData"
        :colWidth="{ opear: '140px' }"
      >
        <div slot-scope="{ scope }" style="width:200px">
          <el-button class="opr" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button class="opr" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
      :wrapperClosable="false"
      class="drawer-content drawer-content-custom"
    >
      <div class="drawer-container-box">
        <component
          :is="componentName"
          :ref="componentName"
          :data="componentData"
          :isEdit="isEdit"
          :dialogVisible.sync="dialogVisible"
        />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '../api'
import Add from './add'
import { mapGetters } from 'vuex'
import { STATIC_BASE } from '@/constant/global'
import mixin from '../../../mixins/download'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import tableMixin from '@/components/Table/tableMixin'
import scantext from './scantext'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select'

export default {
  components: {
    Add,
    coursesTable,
    pagination,
    scantext
  },
  mixins: [mixin, tableMixin, download, selectMixin],
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
      isEdit: true,
      params: {
        queryContent: '',
        schoolOrganId: '',
        organId: '',
        schoolYear: ''
      },
      tableConfig: {
        loading: false,
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
            label: '性别',
            prop: 'sex',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '男' : '女'
            }
          },
          {
            label: '录取学校',
            prop: 'organName',
            width: '170'
          },
          {
            label: '显示层次',
            prop: 'levelLabel',
            width: '170'
          },
          {
            label: '专业信息',
            prop: 'specialtyName',
            width: '170'
          },
          {
            label: '教学点',
            prop: 'schoolOrganName',
            width: '160'
          },
          {
            label: '异动类型',
            prop: 'changeType',
            type: 'enums',
            enums: (value) => {
              const arr = vm.changeTypeList.filter(
                (item) => item.dictValue === value
              )
              return arr.length ? arr[0].dictName : value
            }
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
            }
          },
          {
            label: '扫描件',
            prop: '',
            slot: {
              type: 'btnTxt',
              txt: '查看'
            }
          },
          {
            label: '申请时间',
            prop: 'applicationDate',
            width: '160'
          },
          {
            label: '申请人',
            prop: 'applicationUserName',
            width: '160'
          },
          {
            label: '审核人',
            prop: 'approveUserName',
            width: '120'
          },
          {
            label: '审核时间',
            prop: 'approveDate',
            width: '160px'
          }
        ]
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '600px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      tableData: [],
      organListAll: [],
      schoolOrgansListAll: [],
      changeReasonList: [],
      changeTypeList: []
    }
  },
  computed: {
    ...mapGetters([
      'schoolYearOptions',
      'organList',
      'userOrganId'
    ])
  },
  async created() {
    api.getSysDictList({ code: '0021' }).then((res) => {
      this.changeTypeList = res.data || []
    })
    api.getSysDictList({ code: '0022' }).then((res) => {
      this.changeReasonList = res.data || []
    })
    const all = {
      id: '',
      name: '全部',
      oldName: '全部'
    }
    this.organListAll = [all, ...this.teacherList]
    this.schoolOrgansListAll = [all, ...this.schoolOrgansList]
    this.params.organId = this.organListAll[0].id
    this.params.schoolOrganId = this.schoolOrgansListAll[0].id
    this.init()
  },
  methods: {
    // 查看
    btnTxt(row) {
      this.isShowBtn = false
      this.componentData = row
      this.componentName = 'scantext'
      this.dialogVisible = true
    },
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
      api.registerChange(params).then((res) => {
        this.tableData = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleAdd() {
      this.title = '新增'
      this.isEdit = false
      this.isShowBtn = true
      this.componentData = {}
      this.dialogVisible = true
      this.componentName = 'add'
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
    // 修改跳页面操作
    handleEdit(row) {
      this.title = '编辑'
      this.isEdit = true
      this.isShowBtn = true
      this.componentData = this.$_cloneDeep(row)
      this.componentName = 'add'
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.getTableData()
    },
    handleDelete({ id }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.registerChangeDelete({ id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.init()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    hanlderExport() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      } // TODO
      this.download(
        params,
        '/course/register_change/export',
        'POST',
        '注册前异动',
        'xls'
      )
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
