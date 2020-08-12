<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-upload
            class="upload-demo"
            style="margin-left: 24px; display: inline-flex;"
            :on-change="onFileChange"
            :auto-upload="false"
            :show-file-list="false"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button plain type="primary">导入</el-button>
          </el-upload>
          <!-- <el-button type="primary" @click="exportExcel">导出Excel</el-button> -->
          <el-button plain type="primary" style="margin-left: 24px">
            <a download :href="STATIC_BASE + '/static/报名清单.xls'">
              <i class="el-icon-download el-icon--left"></i>模板下载
            </a>
          </el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="organId"
            filterable
            @change="organChange"
            placeholder="请选择合作单位"
          >
            <el-option v-for="item in organList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input
            v-model.trim="params.realNameOrcertNo"
            @change="getTableData"
            @keyup.enter.native="getTableData"
            placeholder="姓名/身份证号"
          ></el-input>
          <el-button
            type="primary"
            style="height: 40px;margin-left: 10px"
            @click="handlerSearch"
          >高级搜索</el-button>
        </div>
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="ctrl.loading"
        size="medium"
        :data="list"
        stripe
        :header-cell-style="getRowClass"
        style="width: 100%"
      >
        <el-table-column label width="24" align="center"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column prop="testNo" label="考生号"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.sex === '1' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="certNo" width="190" label="身份证号"></el-table-column>
        <el-table-column prop="organName" label="报考一志愿学校" width="200"></el-table-column>
        <el-table-column prop="professionalName" label="报考一志愿专业"></el-table-column>
        <el-table-column prop="organName2" label="报考二志愿学校" width="200"></el-table-column>
        <el-table-column prop="professionalName2" label="报考二志愿专业"></el-table-column>
        <el-table-column prop="schoolYear" label="年级"></el-table-column>
        <el-table-column label="报考层次">
          <template slot-scope="scope">
            <span>{{ showEnterLevel(scope.row.enterLevel) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="考试方式">
          <template slot-scope="scope">
            <span>{{ showText(scope.row.testType, 'testType') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学院审核">
          <template slot-scope="scope">
            <span>{{ showText(scope.row.approveStatus, 'approveStatus') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="注册状态"> -->
          <!-- <template slot-scope="scope"> -->
            <!-- <span>{{ scope.row.registerType ? registerTypeList.filter(item => item.dictValue === scope.row.registerType)[0].dictName : '' }}</span> -->
          <!-- </template> -->
        <!-- </el-table-column> -->
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150">
          <template slot-scope="scope">
            <div class="item">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleAttr(scope.row)">属性</el-button>
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
      title="属性"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row">
          <div class="title">考生号</div>
          <div class="cont">{{ currentData.testNo }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近更新时间</div>
          <div class="cont">{{ currentData.updateDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">更新人</div>
          <div class="cont">{{ currentData.updateUserName }}</div>
        </div>
        <div class="content-row">
          <div class="title">创建人</div>
          <div class="cont">{{ currentData.createUserName }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="dialogVisible" width="950px">
      <div style="height: 550px">
        <!-- <add-user-from ref="addUserFrom" :is-add="isAdd" :user="addUser" organ-id="1"/> -->
        <add ref="addFrom" :data="currentData" :organId="organId" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('addFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <search :dialogVisible.sync="serachVisable" @closeDia="closeDia" />
  </div>
</template>
<script>
import * as api from '../api'
import Add from './add'
import { mapGetters } from 'vuex'
import { STATIC_BASE } from '@/constant/global'
import Search from '@/components/search'

export default {
  components: { Add, Search },
  name: 'Admit',
  props: {
    organType: {
      type: Number,
      default: 1, // 总院： 1, 分院： 2
    },
  },
  data() {
    return {
      isAdd: true,
      roles: [],
      STATIC_BASE,
      levelOption: [],
      dialogVisible: false,
      addUser: {},
      drawer: false,
      currentData: {},
      organId: '1',
      params: {
        realNameOrcertNo: '',
      },
      list: [],
      map: {},
      formData: {},
      lecturerExt: {},
      ctrl: {
        loading: false,
        dialogVisible: false,
        proportionDialogVisible: false,
        viewVisible: false,
      },
      opts: {
        statusIdList: [],
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      visible: '',
      testTypeList: [],
      approveStatusList: [],
      registerTypeList: [],
      serachVisable: false
    }
  },
  computed: {
    ...mapGetters(['organList']),
  },
  async created() {
    api.listByCode({ code: '0006' }).then((res) => {
      this.levelOption = res.data.map((e) => {
        return {
          id: e.id,
          label: e.dictName,
          value: e.dictValue,
        }
      })
    })
    this.registerTypeList =
      ((await api.listByCode({ code: '0012' })) || {}).data || []
    this.testTypeList =
      ((await api.listByCode({ code: '0009' })) || {}).data || []
    this.init()
  },
  methods: {
    handlerSearch() {
      this.serachVisable = true
    },
    onFileChange(data) {
      const file = data.raw
      const param = new FormData()
      param.append('excelFile', file, file.name)
      api.importStudentFile(param).then((res) => {
        this.$message.info(res.data)
        this.getTableData()
      })
    },
    closeDia(params) {
      this.initPageCurrent()
      this.getTableData(params)
    },
    showText(value, key) {
      if (key === 'approveStatus') {
        if (value === '1') {
          return '审核'
        } else if (value === '2') {
          return '合格'
        } else if (value === '3') {
          return '待定'
        } else {
          return '不通过'
        }
      }
      if (key === 'testType') {
        if (!value) return value
        return this.testTypeList.filter((item) => item.dictValue === value)[0]
          .dictName
      }
    },
    showEnterLevel(value) {
      return this.levelOption.filter((item) => item.value === value)[0].label
    },
    resetUser() {
      this.addUser = {
        organId: '1',
        address: '',
        email: '',
        job: '',
        mobile: '',
        phone: '',
        pictureUrl: '',
        realName: '', // 姓名
        record: '', // 学历
        roleId: '',
        sex: '1',
        title: '',
        university: '',
        userName: '' // 用户名
      }
    },
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex === 0 ? 'background:#E0E8EF;color: #333333;' : ''
    },
    // 搜索
    searchBtn() {},
    async init() {
      await this.getOrganList()
      await this.initPageCurrent()
      this.getTableData()
    },
    async getOrganList() {
      this.organId = this.organList[0].value
    },
    initPageCurrent() {
      this.page.pageCurrent = 1
    },
    organChange() {
      this.getTableData()
    },
    getTableData(query) {
      const params = {
        organId: this.organId,
        realNameOrcertNo: this.params.realNameOrcertNo,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...query,
      }
      api.studentSignList(params).then((res) => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    exportExcel() {
      const params = {
        organId: this.organId,
        realNameOrcertNo: this.params.realNameOrcertNo,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
      }
      api.exportExcelByStudentSign(params).then((res) => {
        if (res.code === 200) {
          this.$message.success('导出成功')
        }
      })
    },
    handleAttr(data) {
      this.currentData = data
      this.drawer = true
    },
    handleAdd() {
      this.currentData = {}
      this.isAdd = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addFrom && this.$refs.addFrom.handlerData()
      })
    },
    submit(ref) {
      this.$refs[ref].validate((valid) => {
        this.dialogVisible = !valid
        if (valid) {
          this.init()
        }
      })
    },
    addSave() {
      this.dialogVisible = false
    },
    updateSave() {
      this.dialogVisible = false
    },
    // 修改跳页面操作
    handleEdit(user) {
      this.addUser = this.resetUser()
      this.currentData = user
      this.addUser = user
      this.isAdd = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addFrom && this.$refs.addFrom.handlerData()
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.page.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      // console.log(`当前页: ${val}`)
      this.getTableData()
    },
    handleDelete({ id }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.deleteStudentSign({ id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.init()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.headquarters-user-manage {
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
  }
}
.drawer-content {
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
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.iconfont {
  margin-right: 10px;
}
</style>
