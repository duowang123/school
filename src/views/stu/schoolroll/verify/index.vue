<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="params.organId"
            clearable
            filterable
            placeholder="请选择合作单位"
          >
            <el-option v-for="item in organList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input placeholder="姓名/证件号码" v-model.trim="params.realname"></el-input>
        </div>
      </el-form>
    </div>
    <div>
      <el-table
        size="medium"
        :data="list"
        :header-cell-style="getRowClass"
        stripe
        style="width: 100%"
      >
        <el-table-column label width="24" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="studentNo" width="120" label="学号"></el-table-column>
        <el-table-column prop="realName" width="120" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="sex" label="合作单位"></el-table-column>
        <el-table-column prop="changeNum" label="异动次数"></el-table-column>
        <el-table-column prop="changeType" label="异动类型"></el-table-column>
        <el-table-column prop="changeReason" label="异动原因"></el-table-column>
        <el-table-column label="扫描件" align="center">
          <!-- changePictureUrl -->
          <template slot-scope="scope">
            <a class="column-preview" @click="previewClick(scope.row.changePictureUrl)">查看</a>
          </template>
        </el-table-column>
        <el-table-column prop="applicationDate" width="150" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="applicationUserName" width="120" label="申请人"></el-table-column>
        <el-table-column prop="approveStatus" label="审核结果"></el-table-column>
        <el-table-column prop="approveUserName" width="120" label="审核人"></el-table-column>
        <el-table-column prop="applicationDate" width="150" label="审核时间"></el-table-column>

        <el-table-column fixed="right" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <ul class="list-item-actions">
              <li class="opears">
                <!-- <i class="iconfont icon-details" @click="previewInfo(scope.row)"></i> -->
                <i class="iconfont icon-details" @click="previewProps(scope.row)"></i>
              </li>
            </ul>
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
  </div>
</template>
<script>
import * as api from '@/api/organ'

export default {
  name: 'StudentTransaction',
  data() {
    return {
      params: {
        organId: '',
        realname: ''
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      list: [],
      currentData: {},
      TransactionDrawer: false,
      organList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getTableData()
    },
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex === 0 ? 'background:#E0E8EF;color: #333333;' : ''
    },
    // 新增
    addTransaction() {
      this.TransactionDrawer = true
    },
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.verifyList(params).then(res => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
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
    previewProps(data) {
      this.currentData = data
      this.drawer = true
    },
    // 个人信息
    previewInfo(data) {
      this.detailInfo = data
      this.InfoDrawer = true
    },
    // 跳查看页面
    previewClick(urlData) {
      this.templateFile = urlData
      this.previewDrawer = true
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
  overflow: scroll;
  padding-right: 24px;
}
.drawer-footer {
  margin: 0 0 24px 24px;
  height: 72px;
  line-height: 72px;
}
.upload-icon {
  width: 200px;
  height: 108px;
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
  /deep/ .el-icon-warning-outline:before {
    color: #8c939d;
  }
  /deep/ .el-upload--picture-card {
    width: 200px;
    height: 108px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/.el-upload--picture-card i {
    font-size: 32px;
  }
}
.plan-detail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: #c0c0c0;
  color: #333;
  .content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 2px 0;
    .item-left {
      width: 35%;
      font-size: 14px;
      line-height: 14px;
    }
    .item-right {
      width: 65%;
      font-size: 14px;
      line-height: 14px;
    }
  }
}
.OEP-form-item {
  margin-bottom: 0;
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
.info-box {
  margin-right: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  .row-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    .row-left-box {
      border-bottom: 1px solid #ccc;
    }
    .cont-left {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
    }
  }
  .row-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    .row-right-box {
      display: flex;
      flex-direction: row;
    }
    .info-part {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .info-part-box {
        width: 50%;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
    }
    .cont-right {
      flex: 1;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .img-part {
      width: 170px;
      height: 245px;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      .upload-icon {
        width: 170px;
        height: 204px;
      }
    }
  }
  .title {
    width: 120px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #ccc;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
  }
  .row-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    border-bottom: 1px solid #ccc;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
