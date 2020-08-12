<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="primary" plain>
            <a download :href="STATIC_BASE + '/static/2020X学期招生申请.docx'">
              <i class="el-icon-download el-icon--left"></i>申请模板下载
            </a>
          </el-button>
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
        @row-click="rowClick"
        size="medium"
        :data="list"
        :header-cell-style="getRowClass"
        stripe
        style="width: 100%"
      >
        <el-table-column label width="24" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="organName" width="170" label="合作单位名称"></el-table-column>
        <el-table-column prop="admissionPlanName" label="名称"></el-table-column>
        <el-table-column prop="schoolYear" label="年级"></el-table-column>
        <el-table-column prop="startTime" label="招生开始时间"></el-table-column>
        <el-table-column prop="endTime" label="招生结束时间"></el-table-column>
        <el-table-column label="申请文件" align="center">
          <template slot-scope="scope">
            <!-- <a download :href="scope.row.applyDocUrl">查看</a> -->
            <a class="column-preview" @click="previewClick(scope.row.applyDocUrl)">查看</a>
          </template>
        </el-table-column>
        <el-table-column label="审批状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.approveStatus === '1' ? '通过' : '不通过' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveTime" width="110" label="更新时间"></el-table-column>
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
      :page-size="page.pageSize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
    ></el-pagination>
    <el-drawer
      title="查看申请文件"
      :visible.sync="previewDrawer"
      ref="previewDrawer"
      direction="rtl"
      size="816px"
      :before-close="() => previewDrawer = false"
    >
      <div class="drawer-content">
        <img :src="templateFile" alt />
        <div class="flex-right">
          <el-button @click="$refs.previewDrawer.closeDrawer()">关闭</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      title="属性"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row" style="margin-top: 0px">
          <div class="title">名称</div>
          <div class="cont">{{ currentData.admissionPlanName }}</div>
        </div>
        <div class="content-row">
          <div class="title">更新时间</div>
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
      title="新增合作单位招生资格"
      ref="addDrawer"
      :visible.sync="addDrawer"
      direction="rtl"
      size="552px"
      :before-close="() => addDrawer = false"
    >
      <div class="drawer-content">
        <div class="content-container" style="margin-left: 24px">
          <el-form :rules="rules" :model="addData" ref="addForm" label-width="0">
            <div>
              <div class="row" style="display: flex">
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      合作单位名称
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="schoolYear">
                      <el-select
                        class="form-item-input"
                        v-model="addData.organId"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in organList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      招生计划
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="admissionPlanId">
                      <el-select
                        class="form-item-input"
                        v-model="addData.admissionPlanId"
                        @change="planChange"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in planList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="row" v-show="planDetail.schoolYear">
                <div class="plan-detail">
                  <div class="title">计划详情</div>
                  <div class="content">
                    <p class="item">
                      <span>学年</span>
                      <span>{{planDetail.schoolYear}}</span>
                    </p>
                    <p class="item">
                      <span>招生开始时间</span>
                      <span>{{planDetail.startTime}}</span>
                    </p>
                    <p class="item">
                      <span>招生结束时间</span>
                      <span>{{planDetail.endTime}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="upload-file">
                  <p class="title">
                    申请文件
                    <span class="required-icon">*</span>

                    <i class="el-icon-warning-outline el-icon--right"></i>
                  </p>
                  <Upload class="upload-icon" :url="addData.applyDocUrl" ref="imgList" />
                </div>
              </div>
              <div class="row" style="display: flex;flex-wrap:wrap">
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      申请日期
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="applyTime">
                      <el-date-picker
                        class="form-item-input"
                        type="date"
                        value-format="yyyy-MM-dd"
                        v-model="addData.applyTime"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                  </div>
                </div>
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      审批状态
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="approveStatus">
                      <el-select
                        class="form-item-input width168"
                        v-model="addData.approveStatus"
                        @change="planChange"
                        placeholder="请选择"
                      >
                        <el-option label="通过" value="1" />
                        <el-option label="不通过" value="0" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="OEP-form-item">
                  <div class="container">
                    <p class="label">
                      审批日期
                      <span class="required-icon">*</span>
                    </p>
                    <el-form-item prop="approveTime">
                      <el-date-picker
                        class="width240"
                        type="date"
                        value-format="yyyy-MM-dd"
                        v-model="addData.approveTime"
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
import { organPageList } from '../../../../api/organ'
import Upload from '@/components/ImgUpload'
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
import { STATIC_BASE } from '@/constant/global'

export default {
  name: 'PlanRight',
  components: {
    Upload
  },
  data() {
    return {
      STATIC_BASE,
      addLoading: false,
      drawer: false,
      addDrawer: false,
      previewDrawer: false,
      isAdd: false,
      planList: [], // 招生计划列表
      organList: [], // 机构列表
      planDetail: {}, // 招生计划详情
      fileList: [],
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
        organId: [
          { required: true, message: '请选择合作单位名称', trigger: 'blur' }
        ],
        admissionPlanId: [
          { required: true, message: '请选择招生计划', trigger: 'blur' }
        ],
        applyTime: [
          { required: true, message: '请选择申请日期', trigger: 'blur' }
        ],
        approveStatus: [
          { required: true, message: '请选择审批状态', trigger: 'blur' }
        ],
        approveTime: [
          { required: true, message: '请选择审批日期', trigger: 'blur' }
        ]
      },
      rowSelected: {},
      templateFile: ''
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
    rowClick(row, column) {
      this.rowSelected = row
    },
    // 跳查看页面
    previewClick(urlData) {
      this.templateFile = urlData
        ? `${BASE_API}/course/${urlData}?token=${getToken()}`
        : ''
      this.previewDrawer = true
    },
    resetData() {
      this.addData = {
        organId: '',
        admissionPlanId: '',
        applicant: '',
        applyDocUrl: '',
        applyTime: '',
        approveStatus: '1',
        approveTime: ''
      }
      this.fileList = []
    },
    init() {
      this.getTableData()
      this.initDataList()
      this.getPlanList()
      this.getOrganList()
    },
    initDataList() {
      // 学年
      api.listByCode({ code: '0014' }).then(res => {
        this.schoolYearOptions = res.data
      })
    },
    // 获取招生计划
    getPlanList() {
      const params = {
        pageCurrent: 1,
        pageSize: 100,
        queryContent: ''
      }
      api.admissionList(params).then(res => {
        this.planList = res.data.rows
      })
    },
    // 获取分院列表
    getOrganList() {
      const params = {
        pageCurrent: 1,
        pageSize: 100,
        queryContent: ''
      }
      organPageList(params).then(res => {
        this.organList = res.data.rows.map(e => {
          return { label: e.name, value: e.id }
        })
      })
    },
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.organQual(params).then(res => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    planChange() {
      this.planDetail =
        this.planList.filter(e => e.id === this.addData.admissionPlanId)[0] ||
        {}
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
        if (this.addData.applyTime < this.addData.approveTime)
          return this.$message.warning('招生资格申请日期不可以大于审批日期!')
        if (this.isAdd) {
          this.addSave()
        } else {
          this.updateSave()
        }
      })
    },
    async addSave() {
      const uploadRes = await this.$refs.imgList.upload()
      if (uploadRes.code !== 200) {
        this.$message('图片上传失败！')
        return false
      }
      this.addDrawer = false
      this.addData.applyDocUrl = uploadRes.data
      api.organAddQual(this.addData).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '数据更新成功',
            type: 'success'
          })
          this.init()
        } else {
          this.$message({
            message: '数据更新失败',
            type: 'error'
          })
        }
      })
    },
    updateSave() {
      this.addDrawer = false
      api.updatePlan(this.addData).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '数据更新成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '数据更新失败',
            type: 'error'
          })
        }
      })
    },
    async uploadFiles() {
      // 上传图片
      const ret = await this.$refs.imgList.upload()
      if (!ret) {
        this.$message({
          showClose: true,
          message: '图片上传失败',
          type: 'error'
        })
        return false
      }
      return this.fileList.join('&')
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
.student-plan-right {
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
  display: flex;
  flex-direction: column;
  height: 100%;
  > img {
    width: max-content;
  }
  .content-container {
    flex: 1;
  }
  .OEP-form-item {
    width: 260px;
    .el-form-item {
      margin-bottom: 0;
      /deep/ .width168 {
        width: 168px;
      }
      /deep/ .form-item-input {
        width: 240px;
        .el-input--suffix {
          width: 100%;
        }
      }
    }
  }
  .drawer-footer {
    margin: 0 0 24px 24px;
    height: 72px;
    line-height: 72px;
  }
  .flex-right {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-right: 24px;
  }
  .upload-icon {
    width: 240px;
    height: 168px;
  }
  .upload-file {
    margin-bottom: 20px;
    .title {
      height: 24px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #333333;
      line-height: 24px;
      margin: 0 0 8px 0;
    }
    .required-icon {
      width: 8px;
      height: 8px;
      line-height: 8px;
      color: #3f93db;
      margin-left: 4px;
    }
    /deep/ .el-icon-warning-outline:before {
      color: #8c939d;
    }
    /deep/ .el-upload--picture-card {
      width: 240px;
      height: 168px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/.el-upload--picture-card i {
      font-size: 32px;
    }
  }
  .plan-detail {
    margin-bottom: 24px;
    .title {
      height: 24px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
      margin-bottom: 8px;
    }
    .content {
      background: rgba(245, 247, 250, 1);
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      .item {
        width: 33%;
        display: flex;
        flex-direction: column;
        /*align-items: center;*/
        span {
          margin-left: 16px;
          margin-bottom: 8px;
        }
      }
    }
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
.width240 {
  width: 240px;
}
</style>
