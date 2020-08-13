<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handlerAdd()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              filterable
              v-model="params.organId"
              placeholder="请选择合作单位"
            >
              <el-option
                v-for="item in organList"
                :key="item.id"
                @click.native="getOrganId(item)"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model.trim="params.queryContent"
              prefix-icon="el-icon-search"
              @change="init"
              placeholder="题目"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
        <div slot-scope="{ scope }" style="width:200px">
          <span class="opr" @click="handleEdit(scope)">编辑</span>
          <span class="opr" @click="handleAttr(scope)">详情</span>
          <span class="opr" @click="handleDelete(scope)">删除</span>
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
    <add
      :dialogAdd.sync="dialogAdd"
      :type="type"
      :id="id"
      :organId="params.organId"
      v-if="dialogAdd"
      @updateTable="updateTable"
    />
  </div>
</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import * as api from '../api'
import { mapGetters } from 'vuex'
import Add from './add.vue'

export default {
  name: 'StudentTransaction',
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
  },
  computed: {
    ...mapGetters(['organList']),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
  },
  data(vm) {
    return {
      courseTypeList: [],
      noTestTypeList: [],
      levelList: [],
      id: '',
      type: '',
      params: {
        organId: '',
        queryContent: '',
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      addData: {},
      currentData: {},
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64',
        },
        columnConfig: [
          {
            label: '层次',
            prop: 'levelLabel',
          },
          {
            label: '专业',
            prop: 'specialtyName',
          },
          {
            label: '课程',
            prop: 'courseName',
          },
          {
            label: '题型',
            prop: 'typeLabel',
          },
          {
            label: '题干',
            prop: 'stem',
            type: 'html',
          },
          {
            label: '难度',
            prop: 'difficulty',
          },
          {
            label: '分数',
            prop: 'score',
          },
        ],
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '552px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      dialogAdd: false,
    }
  },
  async created() {
    try {
      this.params.organId = this.organList[0].id
      this.getTableData()
    } catch (err) {
      console.log(err)
      this.tableData = []
    }
  },

  methods: {
    updateTable() {
      this.init()
    },
    handleEdit({ row }) {
      this.id = row.id
      this.type == 'edit'
      this.dialogAdd = true
    },
    getOrganId(item) {
      this.initPage()
      this.getTableData({ organId: item.id })
    },
    handlerAdd() {
      this.type == 'add'
      this.id = ''
      this.dialogAdd = true
    },
    init() {
      this.tableData = []
      this.initPage()
      this.getTableData()
    },
    // 属性
    handleAttr({ row }) {
      delete row.id
      this.title = '属性'
      this.dialogVisible = true
      this.componentName = 'Attr'
      this.width = '450px'
      this.isShowBtn = false
      this.componentData = {
        data: row,
        keys: [
          { label: '题干', key: 'stem', type: 'html' },
          { label: '题型', key: 'typeLabel' },
          { label: '创建时间', key: 'createDate' },
          { label: '创建人', key: 'createUserId' },
          { label: '更新人', key: 'updateUserId' },
          { label: '更新时间', key: 'updateDate' },
        ],
      }
    },
    add() {
      this.tableData.push(...userInfo)
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page,
      }
      const res = await api.examQuestion(params)
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
    // 删除
    handleDelete({ row }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.examQuestionDelete({ id: row.id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.init()
          }
        })
      })
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getTableData()
    },
  },
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
