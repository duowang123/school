<template>
  <div class="schoolStyle">
    <div>
      <el-button :disabled="!data.organId" @click="handleAdd" class="add" style="float:left" type="text">+ 添加</el-button>
      <el-select
        v-model="data.organId"
        @change="init"
        placeholder="请选择"
        style="float:right;width:300px;margin-bottom: 15px;"
      >
        <el-option
          v-for="item in schoolOrgansListAll"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>

    <courses-table
      class="table"
      :tableConfig="tableConfig"
      :tableData="tableData"
      :colWidth="{opear: '100px'}"
    >
      <template slot-scope="{ scope }">
        <el-button
          v-if="tableConfig.edit.includes(scope.$index)"
          type="text"
          @click="handleConfirm(scope)"
        >确认</el-button>
        <!-- <el-button v-else type="text" @click="handleEdit(scope)">编辑</el-button> -->
        <el-button type="text" @click="handleDelete(scope)">删除</el-button>
      </template>
    </courses-table>
  </div>
</template>

<script>
import CoursesTable from '@/components/Table/coursesTable'
import * as api from '../../api.js'
import selectMixin from '@/views/mixins/select.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Plan',
  components: {
    CoursesTable
  },
  mixins: [selectMixin],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableConfig: {
        loading: false,
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64'
        },
        edit: [],
        columnConfig: [
          {
            label: '学校',
            prop: 'organName',
            width: 150
          },
          {
            label: '考试计划',
            prop: 'planName',
            width: 150,
            slot: {
              type: 'edit',
              fieldType: 'input'
            }
          },
          {
            label: '学年',
            prop: 'schoolYear',
            slot: {
              type: 'edit',
              fieldType: 'select'
            },
            options: []
          },
          {
            label: '学期',
            prop: 'semester',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '上学期' : '下学期'
            },
            slot: {
              type: 'edit',
              fieldType: 'select'
            },
            options: this.semesterOptions
          },
          {
            label: '学生入学学年',
            prop: 'schoolYearIn',
            slot: {
              type: 'edit',
              fieldType: 'select'
            },
            options: []
          },
          {
            label: '学生入学学期',
            prop: 'semesterIn',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '上学期' : '下学期'
            },
            slot: {
              type: 'edit',
              fieldType: 'select'
            },
            options: this.inSemesterOptions
          },
          {
            label: '开始日期',
            prop: 'startDate',
            width: '170',
            slot: {
              type: 'edit',
              fieldType: 'datetime'
            }
          },
          {
            label: '结束日期',
            prop: 'endDate',
            width: '170',
            slot: {
              type: 'edit',
              fieldType: 'datetime'
            }
          }
        ]
      },
      tableData: [],
      curEditData: {
        planName: '',
        schoolYear: '',
        semester: '',
        schoolYearIn: '',
        semesterIn: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  computed: {
    ...mapGetters(['yearAndSemester']),
    schoolYearOptions() {
      return this.yearAndSemester.schoolYears
    },
    semesterOptions() {
      return this.yearAndSemester.semesterMap[this.curEditData.schoolYear] || []
    },
    inSemesterOptions() {
      return this.yearAndSemester.semesterMap[this.curEditData.schoolYearIn] || []
    }
  },
  created() {
    this.init()
    const schoolYear_idx = this.tableConfig.columnConfig.findIndex(
      (t) => t.prop === 'schoolYear'
    )
    const schoolYearInIdx = this.tableConfig.columnConfig.findIndex(
      (t) => t.prop === 'schoolYearIn'
    )
    this.tableConfig.columnConfig[schoolYear_idx].options = this.schoolYearOptions
    this.tableConfig.columnConfig[schoolYearInIdx].options = this.schoolYearOptions
  },
  watch: {
    'curEditData.schoolYear'(val) {
      this.tableConfig.columnConfig.forEach(item => {
        if (item.prop === 'semester') {
          item.options = this.yearAndSemester.semesterMap[val]
        }
      })
    },
    'curEditData.schoolYearIn'(val) {
      this.tableConfig.columnConfig.forEach(item => {
        if (item.prop === 'semesterIn') {
          item.options = this.yearAndSemester.semesterMap[val]
        }
      })
    }
  },
  methods: {
    init() {
      this.getPlanInfoList()
    },
    getPlanInfoList() {
      api.getExamPlanList({ organId: this.data.organId }).then((res) => {
        this.tableData = res.data || []
      })
    },
    handleDelete({ row, $index }) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row)
          if (row.hasOwnProperty('id')) {
            api.deleteExamPlan({ id: row.id }).then((res) => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '删除成功!' })
                this.tableData.splice($index, 1)[0]
                this.getPlanInfoList()
              } else {
                this.$message({ type: 'error', message: '删除失败!' })
              }
            })
          } else {
            this.tableData.splice($index, 1)[0]
          }
        })
        .catch(() => {})
    },
    handleAdd() {
      this.tableData.push(this.curEditData)
      this.tableConfig.edit.push(this.tableData.length - 1)
    },
    handleEdit({ $index }) {
      this.tableConfig.edit.push($index)
    },
    handleConfirm({ row, $index }) {
      for (const val of Object.values(row)) {
        if (!val) {
          return this.$message({
            type: 'info',
            message: '请填写完成'
          })
        }
      }
      if (!this.$dayjs(row.endDate).isAfter(this.$dayjs(row.startDate))) {
        return this.$message({
          type: 'info',
          message: '结束时间需大于开始时间'
        })
      }
      this.tableConfig.edit = this.tableConfig.edit.filter((i) => i !== $index)
      row.startDate = this.$dayjs(row.startDate).format('YYYY-MM-DD HH:mm:ss')
      row.endDate = this.$dayjs(row.endDate).format('YYYY-MM-DD HH:mm:ss')
      const params = { ...row }
      params.organId = this.data.organId
      api
        .addExamPlan(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message({ type: 'success', message: '添加成功!' })
          } else {
            this.$message({ type: 'error', message: '添加失败!' })
          }
          this.init()
        })
        .catch(() => {
          this.init()
        })
    },
    confirm(callback) {
      callback(true)
    }
  }
}
</script>

<style scoped lang="scss">
.schoolStyle {
  padding: 0 20px;
  .add {
    width: 49px;
    height: 32px;
    font-weight: 500;
    /*color: rgba(63, 147, 219, 1);*/
    line-height: 32px;
    cursor: pointer;
    user-select: none;
  }
  .item {
    margin-right: 16px;
    font-size: 16px;
  }
  .table {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .icon-delete {
    color: #a3aab3;
  }
}
</style>
