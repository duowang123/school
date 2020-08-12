<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="addTransaction">新增</el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select class="organ-select" v-model="organId" @change="organChange" filterable placeholder="请选择合作单位">
            <el-option
              v-for="item in organList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="organ-select" v-model="params.enterLevel" @change="levelChange" clearable filterable placeholder="请选择层次">
            <el-option
              v-for="item in levelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="organ-select" v-model="params.professional" @change="organChange" clearable filterable placeholder="请选择专业名称">
            <el-option
              v-for="item in specialtyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form>
    </div>
    <div>
      <courses-table
        class="table"
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
      >
        <template slot-scope="{ scope }">
          <div class="item">
            <el-button type="text" @click="handleEdit(scope)">编辑</el-button>
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
    name: 'StandardMajor',
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
          enterLevel: null,
          professional: null
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
              label: '学年',
              prop: 'schoolYear',
              width: '70'
            },
            {
              label: '层次',
              prop: 'enterLevel',
              type: 'enums',
              enums: value => {
                return vm.levelOption.filter(
                  item => item.value === value
                )[0].label
              }
            },
            {
              label: '专业名称',
              prop: 'professionalName'
            },
            {
              label: '所属学院',
              prop: 'organName'
            },
            {
              label: '学费标准',
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
        schoolYearOptions: [],
        levelOption: [],
        moneyTypeOptions: [],
        specialtyOptions: [],
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
      levelChange() {
        const params = {
          organId: this.organId,
          level: this.params.enterLevel
        }
        if (!this.params.enterLevel) {
          this.specialtyOptions = []
          this.params.professional = null
          this.getTableData()
          return
        }
        api.listByOrganIdAndLevel(params).then(res => {
          if (!res.data) {
            this.specialtyOptions = []
          } else {
            this.specialtyOptions = res.data.map(e => {
              return {
                label: e.name,
                value: e.id
              }
            })
          }
          this.params.professional = null
          this.getTableData()
        })
      },
      searchChange() {
        this.getList()
      },
      // 新增
      addTransaction() {
        this.dialogVisible = true
        this.title = '新增专业收费标准'
        this.componentName = 'Add'
        this.width = '450px'
        this.isShowBtn = true
        this.componentData = {
          isAdd: true,
          organId: this.organId,
          schoolYearOptions: this.schoolYearOptions,
          levelOption: this.levelOption,
          moneyTypeOptions: this.moneyTypeOptions
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
        api.getMajorStandardList(params).then(res => {
          this.tableData = this.formatData(res.data.rows)
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
        api.listByCode({code: '0006'}).then(res => {
          this.levelOption = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({code: '0014'}).then(res => {
          this.schoolYearOptions = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({code: '0025'}).then(res => {
          this.moneyTypeOptions = res.data
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
      handleEdit({row}) {
        this.title = '编辑专业收费标准'
        this.dialogVisible = true
        this.componentName = 'Add'
        this.width = '450px'
        this.isShowBtn = true
        this.componentData = {
          ...row,
          isAdd: false,
          schoolYearOptions: this.schoolYearOptions,
          levelOption: this.levelOption,
          moneyTypeOptions: this.moneyTypeOptions
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
            { label: '专业名称', key: 'professionalName' },
            { label: '最近更新时间', key: 'updateDate' },
            { label: '更新人', key: 'updateUserName' },
            { label: '创建时间', key: 'createDate' },
            { label: '创建人', key: 'createUserName' }
          ]
        }
      },
      // 查看
      btnTxt(row) {
        api.viewMajorStandard({ id: row.id }).then(res => {
          this.title = '其他费用'
          this.dialogVisible = true
          this.componentName = 'Attr'
          this.width = '450px'
          this.isShowBtn = false
          const moneyDetail = res.data.others.map(t => {
            return {
              moneyType: this.moneyTypeOptions.filter(item => item.dictValue === t.moneyType)[0].dictName,
              chargeMoney: t.chargeMoney
            }
          })
          this.componentData = {
            data: { ...row, moneyDetail: moneyDetail },
            keys: [
              { label: '学年', key: 'schoolYear' },
              { label: '其他费用', key: 'moneyDetail', isTable: true,
                tableConfig: [{ label: '费用类型', prop: 'moneyType' }, { label: '费用标准', prop: 'chargeMoney' }] }
            ]
          }
        })
        // this.componentData = {
        //   data: row,
        //   keys: [
        //     { label: '学号', key: 'studentNo' },
        //     { label: '姓名', key: 'realName' },
        //     { label: '其他费用', key: 'moneyDetail', isTable: true,
        //       tableConfig: [{ label: '费用类型', prop: 'moneyType' }, { label: '费用标准', prop: 'chargeMoney' }] }
        //   ]
        // }
      },
      handleDelete({ row }) {
        this.$confirm('是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteMajorStandard({ id: row.id }).then(res => {
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
    /deep/  .el-drawer__body {
      padding-bottom: 80px;
      overflow-y: auto !important;
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
