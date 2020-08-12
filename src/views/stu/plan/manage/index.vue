<template>
  <div class="student-plan-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <div>
          <el-form-item>
            <el-input
              v-model.trim="params.queryContent"
              prefix-icon="el-icon-search"
              @change="getTableData"
              placeholder="名称/学年"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="ctrl.loading"
        size="small"
        :data="list"
        :header-cell-style="getRowClass"
        stripe
        style="width: 100%"
      >
        <el-table-column label width="24" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="schoolYear" label="年级"></el-table-column>
        <el-table-column prop="semester" label="学期">
          <template slot-scope="scope">
            <span>{{ scope.row.semester ? (scope.row.semester === '1' ? '上学期': '下学期') : '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="招生开始日期"></el-table-column>
        <el-table-column prop="endTime" label="招生结束日期"></el-table-column>
        <el-table-column prop="updateUserId" label="更新人"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150">
          <template slot-scope="scope">
            <div class="item">
              <el-button type="text" @click="handleEdit(scope)">编辑</el-button>
              <el-button type="text" @click="handleAttr(scope)">属性</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label width="24" align="center"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      style="float: right;margin-top: 20px; margin-bottom: 22px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
    ></el-pagination>
    <el-drawer
      title="属性"
      :visible.sync="drawer"
      direction="rtl"
      size="288px"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row" style="margin-top: 0px">
          <div class="title">名称</div>
          <div class="cont">{{ currentData.name }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近更新时间</div>
          <div class="cont">{{ currentData.updateDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">更新人</div>
          <div class="cont">{{ currentData.updateUserId }}</div>
        </div>
        <div class="content-row">
          <div class="title">创建时间</div>
          <div class="cont">{{ currentData.createDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">创建人</div>
          <div class="cont">{{ currentData.createUserId }}</div>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      title="新增计划"
      ref="addDrawer"
      :visible.sync="addDrawer"
      direction="rtl"
      size="336px"
      :before-close="() => addDrawer = false"
    >
      <div class="drawer-content">
        <div class="content-container" style="margin-left: 24px">
          <el-form :rules="rules" :model="addData" ref="addForm" label-width="0">
            <div>
              <div class="row">
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      计划名称
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="name">
                      <el-input
                        class="form-item-input"
                        size="medium"
                        v-model="addData.name"
                        placeholder="请输入计划名称"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      年级
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="schoolYear">
                      <el-select
                        class="form-item-input"
                        v-model="addData.schoolYear"
                        size="medium"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in schoolYearOptions"
                          :key="item.dictValue"
                          :label="item.dictName"
                          size="medium"
                          :value="item.dictValue"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      招生开始时间
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="startTime">
                      <el-date-picker
                        class="form-item-input"
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="medium"
                        v-model="addData.startTime"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      招生结束时间
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="endTime">
                      <el-date-picker
                        class="form-item-input"
                        type="date"
                        size="medium"
                        value-format="yyyy-MM-dd"
                        v-model="addData.endTime"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="addDataSubmit()" :loading="addLoading">确 定</el-button>
          <el-button @click="$refs.addDrawer.closeDrawer()">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '../../api'
export default {
  name: 'PlanMange',
  data() {
    return {
      addLoading: false,
      drawer: false,
      addDrawer: false,
      isAdd: false,
      currentData: {},
      addData: {},
      schoolYearOptions: {},
      params: {
        queryContent: ''
      },
      list: [],
      ctrl: {
        loading: false
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        schoolYear: [
          { required: true, message: '请选择年级', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择招生开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择招生结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
    this.resetData()
  },
  methods: {
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex === 0 ? 'background:#E0E8EF;color: #333333;' : ''
    },
    resetData() {
      this.addData = {
        endTime: '',
        id: '',
        name: '',
        schoolYear: '',
        startTime: ''
      }
    },
    init() {
      this.getTableData()
      this.initOptions()
    },
    initOptions() {
      // 学年
      api.listByCode({ code: '0014' }).then(res => {
        this.schoolYearOptions = res.data
      })
    },
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.admissionList(params).then(res => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleAttr({ row }) {
      this.currentData = row
      this.drawer = true
    },
    handleAdd() {
      this.isAdd = true
      this.addDrawer = true
      this.resetData()
    },
    addDataSubmit() {
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          return void '验证失败'
        }
        if (this.addData.endTime < this.addData.startTime)
          return this.$message.warning(
            '招生计划开始日期不可以大于结束日期!'
          )
        if (this.isAdd) {
          this.addSave()
        } else {
          this.updateSave()
        }
      })
    },
    addSave() {
      this.addDrawer = false
      api.addPlan(this.addData).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '数据添加成功',
            type: 'success'
          })
          this.page.pageCurrent = 1
          this.getTableData()
        } else {
          this.$message({
            message: '数据添加失败',
            type: 'error'
          })
        }
      })
    },
    updateSave() {
      this.addDrawer = false
      api.AddmissionUpdate(this.addData).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '数据更新成功',
            type: 'success'
          })
          this.page.pageCurrent = 1
          this.getTableData()
        } else {
          this.$message({
            message: '数据更新失败',
            type: 'error'
          })
        }
      })
    },
    // 修改跳页面操作
    handleEdit({ row }) {
      this.isAdd = false
      this.addData = row
      this.addDrawer = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.init()
    },
    handleDelete({ id }) {
      api.deletePlan({ id }).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.student-plan-manage {
  .user-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .organ-select {
      margin-right: 24px;
      /deep/ .el-select {
        width: 256px;
      }
    }
  }
}
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .content-container {
    flex: 1;
  }
  .OEP-form-item {
    width: 100%;
    margin-right: 20px;
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .form-item-input {
      width: 288px;
    }
    /deep/ .el-input {
      width: 288px;
    }
  }
  .drawer-footer {
    margin-left: 24px;
    height: 72px;
    line-height: 72px;
  }
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
</style>
