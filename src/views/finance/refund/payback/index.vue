<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="addTransaction">新增</el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select class="organ-select" v-model="organId" @change="organChange"  filterable placeholder="请选择合作单位">
            <el-option
              v-for="item in organList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model.trim="params.realNameOrcertNo" @change="organChange" placeholder="姓名/身份证号/学号"></el-input>
        </div>
      </el-form>
    </div>
    <div>
      <courses-table
        class="table"
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colWidth="{ opear: '100px' }"
      >
        <template slot-scope="{ scope }">
          <div class="item">
            <el-button type="text" @click="handleAttr(scope)">属性</el-button>
            <el-button type="text" @click="handleDelete(scope)">删除</el-button>
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
    <el-drawer :title="title" :visible.sync="dialogVisible" :size="width" :direction="direction">
      <component :is="componentName" :ref="componentName" :data="componentData"/>
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
  import * as api from '../api'
  import Add from './add'

  export default {
    name: 'RefundPayback',
    mixins: [organMixin],
    components: {
      ImgList,
      coursesTable,
      pagination,
      Add,
      Attr
    },
    data() {
      const vm = this
      return {
        params: {
          realNameOrcertNo: ''
        },
        page: {
          pageCurrent: 1,
          pageSize: 10,
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
              prop: 'studentNo'
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
              label: '专业',
              prop: 'professional'
            },
            {
              label: '层次',
              prop: 'enterLevel',
              type: 'enums',
              enums: value => {
                return vm.levelOption.filter(
                  item => item.dictValue === value
                )[0].dictName
              }
            },
            {
              label: '缴费年度',
              prop: 'payYear'
            },
            {
              label: '退费项目',
              prop: 'returnType',
              type: 'enums',
              enums: value => {
                return vm.returnTypeList.filter(
                  item => item.dictValue === value
                )[0].dictName
              }
            },
            {
              label: '退费金额',
              prop: 'returnMoney'
            },
            {
              label: '退费时间',
              prop: 'createDate'
            },
            {
              label: '说明',
              prop: 'remark'
            }
          ]
        },
        levelOption: [],
        returnTypeList: [],
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
        this.title = '新增退费'
        this.componentName = 'Add'
        this.width = '450px'
        this.isShowBtn = true
        this.componentData = {
          isAdd: true,
          organId: this.organId,
          returnTypeOptions: this.returnTypeList
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
        api.getStudentPaybackList(params).then(res => {
          this.tableData = this.formatData(res.data.rows)
          this.tableData.forEach(obj => {
            obj.studentType = '网教'
          })
          console.log(this.tableData)
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
        api.listByCode({ code: '0026' }).then(res => {
          this.returnTypeList = res.data
        })
        api.listByCode({ code: '0006' }).then(res => {
          this.levelOption = res.data
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
        this.title = '编辑退费查询'
        this.dialogVisible = true
        this.componentName = 'Add'
        this.width = '450px'
        this.isShowBtn = true
        this.componentData = {
          ...row,
          isAdd: false,
          schoolYearOptions: this.schoolYearOptions,
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
            { label: '创建人', key: 'createUserName' },
            { label: '更新时间', key: 'updateDate' },
            { label: '更新人', key: 'updateUserName' }
          ]
        }
      },
      // 查看
      btnTxt(row) {
        this.title = '其他费用'
        this.dialogVisible = true
        this.componentName = 'Attr'
        this.width = '450px'
        this.isShowBtn = false
        this.componentData = {
          data: row,
          keys: [
            { label: '学号', key: 'studentNo' },
            { label: '姓名', key: 'realName' },
          ]
        }
      },
      handleDelete({ row }) {
        this.$confirm('是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteStudentPayback({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.init()
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        });
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
    .demo-drawer__footer{
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
