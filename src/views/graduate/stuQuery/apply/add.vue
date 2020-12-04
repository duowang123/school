<template>
  <div class="graduate-query-plan-add attrStyle">
    <div class="search-box">
      <div class="item" style="width: 120px">
        <el-select v-model="params.schoolYear" clearable placeholder="请选择学年">
          <el-option
            v-for="item in schoolYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item" style="width: 120px">
        <el-select v-model="params.enterLevel" clearable @change="levelChange" placeholder="请选择层次">
          <el-option
            v-for="item in enterLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-select v-model="params.enterMajor" clearable placeholder="请选择专业">
          <el-option
            v-for="item in professionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-input clearable placeholder="学号/姓名/证件号码" v-model="params.studentNoOrCertNo"></el-input>
      </div>
      <el-button type="primary" @click="search()">查询</el-button>
    </div>
    <div>
      <courses-table
        ref="coursesTableRef"
        class="table"
        @handle-selection-change="handleSelectionChange"
        :tableConfig="tableConfig"
        :colWidth="{ opear: '60px' }"
        :tableData="tableData"
      />
      <pagination
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :currentPage="page.pageCurrent"
          :pagination-config="paginationConfig"
      />
    </div>
  </div>
</template>

<script>
  import * as api from '../../api'
  import coursesTable from '@/components/Table/coursesTable'
  import pagination from '@/components/Table/pagination'
  import { mapGetters } from 'vuex'

  const student_Status = {
    1: '在籍',
    2: '休学',
    3: '退学',
    4: '毕业',
  }

  export default {
    components: {
      coursesTable,
      pagination
    },
    name: 'Add',
    props: {
      data: Object
    },
    watch: {

    },
    data() {
      return {
        tableData: [],
        selValue: [],
        tableConfig: {
          height: 650,
          loading: false,
          isHideOperation: true,
          selection: {
            type: 'selection',
            width: '55'
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
              prop: 'certNo'
            },
            {
              label: '学籍状态',
              prop: 'studentStatus',
              type: 'enums',
              enums: (value) => {
                return student_Status[value]
              }
            }
          ]
        },
        enterLevelOptions: [],
        professionOptions: [], //专业
        params: {
          schoolYear: '',
          enterLevel: '',
          enterMajor: '',
          realNameOrcertNo: ''
        },
        page: {
          pageCurrent: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        },
        modelName: 'stu_graduate'
      }
    },
    computed: {
      ...mapGetters(['schoolYearOptions']),
      paginationConfig() {
        return {
          total: this.page.totalCount,
          pageSize: this.page.pageSize,
          pageSizes: [20, 50, 100, 200]
        }
      }
    },
    created() {
      this.initSelectOptions()
    },
    methods: {
      search() {
        this.init()
      },
      handleSelectionChange(val) {
        this.selValue = val.map(e => e.id)
      },
      init() {
        this.initPage()
        this.getTableData()
      },
      async getTableData() {
        const params = {
          ...this.params,
          ...this.page,
          ...{
            organId: this.data.organId
          }
        }
        api.graduatePageList(params).then(res => {
          this.tableData = res.data.rows || []
          this.page.totalCount = res.data.totalCount
        })
      },
      handleSizeChange(val) {
        this.page.pageSize = val
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.page.pageCurrent = val
        this.init()
      },
      initPage() {
        this.page.pageCurrent = 1
      },
      // 从字典中获取下拉框数据
      initSelectOptions(isRefresh = false) {
        if (!isRefresh) {
          api.listByCode({ code: '0006' }).then(res => {
            this.enterLevelOptions = res.data.map(e => {
              return {
                id: e.id,
                label: e.dictName,
                value: e.dictValue
              }
            })
          })
          api.listByCode({ code: '0015' }).then(res => {
            this.enterMajorlOptions = res.data.map(e => {
              return {
                id: e.id,
                label: e.dictName,
                value: e.dictValue
              }
            })
          })
        }
      },
      levelChange() {
        this.initProfessional(false)
      },
      initProfessional(init = true) {
        const params = {
          organId: this.data.organId,
          level: this.params.enterLevel
        }
        if (!this.params.enterLevel)
          return this.$message.warning('请先选择招生层次!')
        api.listByOrganIdAndLevel(params).then(res => {
          if (!res.data) {
            this.specialtyOptions = []
            this.params.enterMajor = null
            return
          }
          this.professionOptions = res.data.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          })
          if (init) {
            this.params.enterMajor = this.data.professional || ''
          } else {
            this.params.enterMajor = this.$_getValue(res.data, '0.id', '')
          }
        })
      },
      confirm(callBack) {
        const params = {
          organId: this.data.organId,
          studentIds: this.selValue
        }
        api.graduateSave(params).then(res => {
          if (res.code === 200) {
            callBack(true)
          } else {
            this.$message({ type: 'error', message: '新增失败!' })
          }
        })
        // return
        // this.$refs.ruleForm.validate(valid => {
        //   if (valid) {
        //     const params = {
        //       ...this.ruleForm,
        //       organId: this.data.organId
        //     }
        //     const responseCallback = res => {
        //       if (res.code === 200) {
        //         this.$message({ type: 'success', message: (this.data.isAdd ? '添加' : '修改') + '成功!' })
        //       } else {
        //         this.$message({ type: 'error', message: (this.data.isAdd ? '添加' : '修改') + '失败!' })
        //       }
        //       callBack(valid)
        //     }
        //     if (this.data.isAdd) {
        //       api.commonPageRequest(params, this.data.modelName, 'save').then(responseCallback)
        //     } else {
        //       api.commonPageRequest(params, this.data.modelName, 'update').then(responseCallback)
        //     }
        //   }
        // })
      }
    }
  }
</script>

<style scoped lang="scss">
  .graduate-query-plan-add {
    padding: 0 24px;
    .search-box {
      display: flex;
      margin-bottom: 15px;
      .item {
        margin-right: 15px;
      }
    }
    .search-btn {
      cursor: pointer;
      width: 50px;
      background-color: #e6e6e6;
      border-radius: 5px;
      text-align: center;
      line-height: 40px;
      margin-left: 20px;
    }
  }
</style>
