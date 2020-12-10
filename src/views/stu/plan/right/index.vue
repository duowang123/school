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
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content-container">
      <el-scrollbar class="table" :style="{height:tableHeight}" :noresize="true">
        <el-table
          v-loading="ctrl.loading"
          size="medium"
          :data="list"
          :header-cell-style="getRowClass"
          stripe
          style="width: 100%"
        >
          <el-table-column width="14" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="organName" label="学校"></el-table-column>
          <el-table-column label="机构性质">
            <template slot-scope="scope">
              <span>{{ scope.row.property === '1' ? '学校' : '教学点' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="招生资格" align="center">
            <template slot-scope="scope">
              <span
                :style="{color: $_getColor(scope.row.approveStatus === '1' ? 'greed' : 'red')}"
              >{{ scope.row.approveStatus === '1' ? '开启' : '关闭' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateUserId" label="更新人"></el-table-column>
          <el-table-column prop="updateDate" label="更新时间"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <div class="item">
                <el-button type="text" v-all @click="handleEdit(scope)">审核</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="24" align="center"></el-table-column>
        </el-table>
      </el-scrollbar>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
      ></el-pagination>
    </div>
    <el-drawer
      title="资格审核"
      ref="drawer"
      :visible.sync="drawer"
      :wrapperClosable="false"
      direction="rtl"
      size="552px"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div>
          <div class="title">学校{{currentData.organName}}</div>
        </div>
        <div>
          <div style="margin: 15px 0" class="title">招生资格</div>
          <div>
            <el-radio-group v-model="rightEnable">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="updateSave()" :loading="addLoading">确 定</el-button>
          <el-button @click="$refs.drawer.closeDrawer()">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '../../api'
import Upload from '@/components/ImgUpload'
import { STATIC_BASE } from '@/constant/global'
import { mapGetters } from 'vuex'
import heightMixin from '@/components/Table/heightMixin'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'PlanRight',
  mixins: [heightMixin, selectMixin],
  components: {
    Upload,
  },
  data() {
    return {
      STATIC_BASE,
      addLoading: false,
      drawer: false,
      isAdd: false,
      fileList: [],
      currentData: {},
      rightEnable: '0',
      schoolYearOptions: {},
      params: {
        queryContent: '',
        organId: '',
      },
      list: [],
      ctrl: {
        loading: false,
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      rowSelected: {},
      templateFile: '',
    }
  },
  created() {
    this.params.organId = this.organListAll[0].id
    this.init()
  },
  methods: {
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex === 0 ? 'background:#E0E8EF;color: #333333;' : ''
    },
    init() {
      this.getTableData()
      // this.getOrganList()
    },
    // 获取分院列表
    // getOrganList() {
    //   const params = {
    //     pageCurrent: 1,
    //     pageSize: 100,
    //     queryContent: ''
    //   }
    //   organPageList(params).then(res => {
    //     this.organList = res.data.rows.map(e => {
    //       return { label: e.name, value: e.id }
    //     })
    //   })
    // },
    getOrganId(id) {
      this.params.queryContent = id
      this.initPage()
      this.getTableData()
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
      }
      api.organQual(params).then((res) => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    updateSave() {
      const params = {
        id: this.currentData.id,
        approveStatus: this.rightEnable,
      }
      api.updatePlan(params).then((res) => {
        if (res.code === 200) {
          this.drawer = false
          this.$message({
            message: '数据更新成功',
            type: 'success',
          })
          this.getTableData()
        } else {
          this.$message({
            message: '数据更新失败',
            type: 'error',
          })
        }
      })
    },
    // 修改跳页面操作
    handleEdit({ row }) {
      this.drawer = true
      this.currentData = row
      this.rightEnable = row.approveStatus
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.init()
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
    background-color: #f3f5f7;
    .organ-select {
      /*margin-right: 24px;*/
      /deep/ .el-select {
        width: 256px;
      }
    }
  }
}
.column-preview {
  height: 24px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #3f93db;
  line-height: 24px;
}
.drawer-content {
  padding: 0 24px;
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #666666;
    line-height: 26px;
  }
  .drawer-footer {
    /*margin: 0 0 24px 24px;*/
    position: absolute;
    bottom: 50px;
    height: 72px;
    line-height: 72px;
  }
}

.icon-item {
  width: 100%;
  height: 40px;
  padding: 9px 16px;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.iconfont {
  margin-right: 10px;
}
.width240 {
  width: 240px;
}
</style>
