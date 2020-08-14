<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item class="header-left">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-upload
            class="upload-demo"
            style="margin-left: 24px"
            :on-change="onFileChange"
            :auto-upload="false"
            :show-file-list="false"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button plain type="primary">导入</el-button>
          </el-upload>
          <el-button plain type="primary" style="margin-left: 24px">
            <a download :href="STATIC_BASE + '/static/录取模版.xls'">
              <i class="el-icon-download el-icon--left"></i>模板下载
            </a>
          </el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            filterable
            v-model="params.organId"
            @change="organChange"
            placeholder="请选择合作单位"
          >
            <el-option v-for="item in organList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input
            v-model.trim="params.realNameOrcertNo"
            @change="organChange"
            @keyup.enter.native="organChange"
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
        :header-cell-style="getRowClass"
        :data="list"
        stripe
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
        <el-table-column prop="certNo" width="190" label="身份证"></el-table-column>
        <el-table-column prop="organName" label="录取学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="schoolYear" label="年级"></el-table-column>
        <el-table-column label="报考层次">
          <template slot-scope="scope">
            <span>{{ showEnterLevel(scope.row.enterLevel) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="professionalName" width="120" label="报考专业"></el-table-column>
        <el-table-column label="考试方式">
          <template slot-scope="scope">
            <span>{{ showEnterLevel(scope.row.testType, 'testType') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学院审核">
          <template slot-scope="scope">
            <span>{{ showEnterLevel(scope.row.approveStatus, 'approveStatus') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop label="录取状态"> -->
        <!-- <template slot-scope="scope"> -->
        <!-- <span>已录取</span> -->
        <!-- </template> -->
        <!-- </el-table-column> -->
        <el-table-column label="注册状态">
          <template slot-scope="scope">
            <span>{{ scope.row.registerType ? registerTypeList.filter(item => item.dictValue === scope.row.registerType)[0].dictName : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <ul class="list-item-actions">
              <div class="item">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleAttr(scope.row)">属性</el-button>
                <el-button type="text" @click="handleVerify(scope.row)">审核</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </div>
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
    <el-drawer
      title="属性"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row">
          <div class="title">用户名</div>
          <div class="cont">{{ currentRow.realName }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近登录时间</div>
          <div class="cont">{{ currentRow.lastLoginDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近更新时间</div>
          <div class="cont">{{ currentRow.updateDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">更新人</div>
          <div class="cont">{{ currentRow.updateUserName }}</div>
        </div>
        <div class="content-row">
          <div class="title">创建人</div>
          <div class="cont">{{ currentRow.createUserName }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="dialogVisible" width="950px">
      <div style="height: 500px">
        <add-user-from
          ref="addUserFrom"
          :is-add="isAdd"
          :data="currentRow"
          :organId="params.organId"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <search :dialogVisible.sync="serachVisable" :organId="organId" @closeDia="closeDia" />
    <el-drawer
      :title="title"
      :visible.sync="dialogVerify"
      :size="width"
      :direction="direction"
      class="drawer-content drawer-content-custom"
    >
      <div class="drawer-container-box">
        <component :is="componentName" :ref="componentName" :data="componentData" />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVerify = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '../api'
import addUserFrom from './add'
import verify from './verify'
import { mapGetters } from 'vuex'
import { STATIC_BASE } from '@/constant/global'
import Search from '@/components/search'

export default {
  components: { addUserFrom, Search, verify },
  name: 'Apply',
  props: {
    organType: {
      type: Number,
      default: 1, // 总院： 1, 分院： 2
    },
  },
  data() {
    return {
      STATIC_BASE,
      isAdd: true,
      roles: [],
      dialogVisible: false,
      drawer: false,
      currentRow: {},
      studyOption: [],
      levelOption: [],
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
      params: {
        realNameOrcertNo: '',
        organId: '',
      },
      registerTypeList: [],
      serachVisable: false,
      title: '录取清单审核',
      componentName: '',
      componentData: null,
      width: '500px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVerify: false,
      changePictureUrl: '',
      rowData: {},
    }
  },
  computed: {
    ...mapGetters(['organList']),
  },
  created() {
    api.listByCode({ code: '0006' }).then((res) => {
      this.levelOption = res.data || []
    })
    api.listByCode({ code: '0009' }).then((res) => {
      this.studyOption = res.data || []
    })
    api.listByCode({ code: '0012' }).then((res) => {
      this.registerTypeList = res.data || []
    })
    this.params.organId = this.organList[0].value
    this.init()
  },
  methods: {
    showEnterLevel(value, key) {
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
        return this.studyOption.filter((item) => item.dictValue === value)[0]
          .dictName
      }
      return this.levelOption.filter((item) => item.dictValue === value)[0]
        .dictName
    },
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex === 0 ? 'background:#E0E8EF;color: #333333;' : ''
    },
    init() {
      this.initPage()
      this.getTableData()
    },
    handlerSearch() {
      this.serachVisable = true
    },
    closeDia(params) {
      this.initPage()
      this.getTableData(params)
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    organChange() {
      this.init()
    },
    getTableData(query) {
      const params = {
        organId: this.params.organId,
        realNameOrcertNo: this.params.realNameOrcertNo,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...query,
      }
      api.getStudentList(params).then((res) => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleAttr(data) {
      this.currentRow = data
      this.drawer = true
    },
    handleAdd() {
      this.isAdd = true
      this.currentRow = {}
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addUserFrom && this.$refs.addUserFrom.handlerData()
      })
    },
    //阻止upload的自己上传，进行再操作
    onFileChange(data) {
      const file = data.raw
      const param = new FormData()
      param.append('excelFile', file, file.name)
      api.stundentSignImport(param).then((res) => {
        this.$message.info(res.data)
        this.init()
      })
    },
    submit() {
      this.$refs.addUserFrom.validate((valid) => {
        console.log(valid)
        if (!valid) {
          return void '验证失败'
        }
        if (this.isAdd) {
          this.addSave()
        } else {
          this.updateSave()
        }
        this.init()
      })
    },
    addSave() {
      this.dialogVisible = false
    },
    updateSave() {
      this.dialogVisible = false
    },
    handleVerify(row) {
      // if (row.approveStatus !== '1')
        // return this.$message.warning('录取清单审核只能操作待审核的!')
      this.componentData = row
      this.componentName = 'verify'
      this.dialogVerify = true
    },
    // 修改跳页面操作
    handleEdit(user) {
      this.currentRow = user
      this.isAdd = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addUserFrom && this.$refs.addUserFrom.handlerData()
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.getTableData()
    },
    confirm() {
      this.$nextTick(() => {
        this.$refs[`${this.componentName}`].confirm((valid) => {
          this.dialogVerify = !valid
          if (valid) {
            this.init()
          }
        })
      })
    },
    handleDelete({ id }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.studentDelete({ id }).then((res) => {
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
    .header-left {
      /deep/ .el-form-item__content {
        display: flex;
      }
    }
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
      margin-right: 24px;
      /deep/ .el-select {
        width: 256px;
      }
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
