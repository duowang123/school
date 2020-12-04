<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              v-model="params.organId"
              filterable
              v-if="showSchool"
              @change="init"
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
              clearable
              v-if="showTeacher"
              lsSchool
              @change="init"
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
              v-model.trim="params.queryContent"
              prefix-icon="el-icon-search"
              @change="init"
              placeholder="查询内容"
              clearable
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table
          class="table"
          :tableConfig="tableConfig"
          :tableData="tableData"
          :colWidth="{ opear: '140px' }"
          @btnTxt="btnTxt"
        >
          <div slot-scope="{ scope }" style="width:200px">
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
    </div>
    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="drawerVisible"
      :size="width"
      :direction="direction"
      class="drawer-content drawer-content-custom"
    >
      <div class="drawer-container-box">
        <component :is="componentName" :ref="componentName" :data="componentData" />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="drawerVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import * as api from '../../api'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'FaceAuth',
  components: {
    coursesTable,
    pagination,
    Attr,
  },
  mixins: [selectMixin],
  computed: {
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
      testTypeList: [],
      params: {
        organId: '',
        queryContent: '',
        schoolOrganId: '',
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
            label: '姓名',
            prop: 'realName',
          },
          {
            label: '性别',
            prop: 'sex',
          },
          // {
          //   label: '学号',
          //   prop: 'realName'
          // },
          {
            label: '刷卡时间',
            prop: 'cardTime',
          },
          {
            label: '信息匹配',
            prop: 'compareResultText',
            type: 'customStyle',
            callback: (val) => {
              return {
                color: val !== '通过' ? '#CF0000' : '#67C23A',
              }
            },
          },
          {
            label: '图片采样',
            prop: 'courseDetails',
            slot: {
              type: 'btnTxt',
              txt: '查看',
            },
          },
          // {
          //   label: '错误原因',
          //   prop: 'errorReason'
          // }
        ],
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '552px',
      direction: 'rtl',
      isShowBtn: true,
      drawerVisible: false,
      dialogVisible: false,
      dialogImageUrl: '',
    }
  },
  async created() {
    try {
      this.params.organId = this.organListAll[0].id
      this.params.schoolOrganId = this.schoolOrgansListAll[0].id
      this.getTableData()
    } catch (err) {
      console.log(err)
      this.tableData = []
    }
  },
  watch: {
    drawerVisible(val) {
      val || (this.componentName = '')
    },
  },
  methods: {
    getOrganId(item) {
      this.initPage()
      this.getTableData({ organId: item.id })
    },
    // 编辑
    async init() {
      this.initPage()
      this.getTableData()
    },
    btnTxt(row) {
      const { id } = row
      api
        .getFacePic(id)
        .then((res) => {
          this.dialogVisible = true
          this.dialogImageUrl = 'data:image/jpg;base64,' + res.data
        })
        .catch((err) => {
          this.$message.error('图片获取失败!')
        })
    },
    // 属性
    handleAttr({ row }) {
      this.title = '属性'
      this.drawerVisible = true
      this.componentName = 'Attr'
      this.width = '450px'
      this.isShowBtn = false
      this.componentData = {
        data: row,
        keys: [
          { label: '姓名', key: 'realName' },
          { label: '性别', key: 'sex' },
          { label: '创建时间', key: 'createDate' },
          { label: '刷卡时间', key: 'cardTime' },
          // { label: '更新时间', key: 'updateDate' },
          // { label: '更新人', key: 'updateUserName' }
        ],
      }
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page,
      }
      const res = await api.facePageList(params)
      const data = res.data.rows || []
      const Type = {
        0: '对比不通过',
        1: '通过',
        2: '找不到人员信息',
      }
      this.tableData = data.map((e) => {
        e.compareResultText = Type[e.compareResult]
        return e
      })
      this.page.totalCount = res.data.totalCount
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
    },
    confirm() {
      this.$nextTick(() => {
        this.$refs[`${this.componentName}`].confirm((valid) => {
          this.drawerVisible = !valid
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
        api.deleteFace({ id: row.id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.initPage()
            this.getTableData()
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
    justify-content: flex-end;
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
