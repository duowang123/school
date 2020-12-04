<template>
  <div class="schoolStyle">
    <el-select class="organ-select" v-model="organId" @change="getSchoolList" placeholder="请选择">
      <el-option
        v-for="item in schoolOrgansList"
        :key="item.value"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <div class="add" @click="handleAdd">+ 添加</div>
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
        <el-button v-else type="text" @click="handleEdit(scope)">编辑</el-button>
        <el-button type="text" @click="handleDelete(scope)">删除</el-button>
      </template>
    </courses-table>
  </div>
</template>

<script>
import CoursesTable from '@/components/Table/coursesTable'
import * as api from '../api'
import { mapGetters } from 'vuex'
export default {
  name: 'School',
  components: {
    CoursesTable
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    schoolOrgansList: {
      type: Array
    }
  },
  data(vm) {
    return {
      selectableOrganList: [],
      organId: '',
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
            label: '编号',
            prop: 'collegeNo',
            slot: {
              type: 'edit'
            }
          },
          {
            label: '学院名称',
            prop: 'name',
            // width: '200',
            slot: {
              type: 'edit'
            }
          }
          // {
          //   label: '学校',
          //   prop: '',
          //   width: '200',
          //   options: this.schoolOrgansList,
          //   slot: {
          //     type: 'edit',
          //     fieldType: 'select'
          //   }
          // }
        ]
      },
      tableData: []
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['organList', 'schoolOrgansList'])
  },
  methods: {
    init() {
      this.selectableOrganList = this.$_organFilter(this.organList)
      this.organId = this.data.organId || this.selectableOrganList[0].value
      this.getSchoolList()
    },
    getSchoolList() {
      api.schoolList(this.organId).then((res) => {
        this.tableData = res.data.rows || []
      })
    },
    handleDelete({ row, $index }) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const delData = this.tableData.splice($index, 1)[0] || {}
          api.deleteSchool({ id: delData.id }).then((res) => {
            if (res.code === 200) {
              this.$message({ type: 'success', message: '删除成功!' })
              this.getSchoolList()
            } else {
              this.$message({ type: 'error', message: '删除失败!' })
            }
          })
        })
        .catch(() => {})
    },
    handleAdd() {
      this.tableData.push({
        collegeNo: '',
        name: ''
      })
      this.tableConfig.edit.push(this.tableData.length - 1)
      this.isAdd = true
    },
    handleEdit({ $index }) {
      this.isAdd = false
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
      this.tableConfig.edit = this.tableConfig.edit.filter((i) => i !== $index)
      const params = { ...row }
      params.organId = this.organId
      const resCallBack = (res) => {
        if (res.code === 200) {
          this.$message({ type: 'success', message: '数据保存成功!' })
        } else {
          this.$message({ type: 'error', message: '数据保存失败!' })
        }
        this.getSchoolList()
      }
      if (this.isAdd) {
        api.addSchool(params).then(resCallBack)
      } else {
        api.updateSchool(params).then(resCallBack)
      }
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
    color: rgba(63, 147, 219, 1);
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
