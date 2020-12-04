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
          <el-button plain type="primary" @click="exportExcel" style="margin-left: 16px">导出Excel</el-button>
          <el-button plain type="primary" style="margin-left: 16px">
            <a download :href="STATIC_BASE + '/static/录取模版.xls'">
              <i class="el-icon-download el-icon--left"></i>模板下载
            </a>
          </el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="params.schoolYear"
            filterable
            @change="organChange"
            placeholder="请选择年级"
          >
            <el-option
              v-for="item in schoolYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="organ-select"
            v-model="params.organId"
            filterable
            v-if="showSchool"
            clearable
            @change="organChange"
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
            v-if="showTeacher"
            lsSchool
            clearable
            @change="organChange"
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
            v-model.trim="params.realNameOrcertNo"
            @change="organChange"
            @keyup.enter.native="organChange"
            placeholder="姓名/证件号码/学号"
          ></el-input>
          <el-button
            type="primary"
            style="height: 40px;margin-left: 10px"
            @click="handlerSearch"
          >高级搜索</el-button>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <el-scrollbar :noresize="true" :style="{ height:tableHeight }">
        <el-table
          :data="list"
          :header-cell-style="getRowClass"
          :row-style="{height: '48px'}"
          class="table"
          v-loading="ctrl.loading"
        >
          <el-table-column align="center" width="24"></el-table-column>
          <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="考生号" prop="testNo" width="200"></el-table-column>
          <el-table-column label="学号" prop="studentNo" width="200"></el-table-column>
          <el-table-column label="姓名" prop="realName"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span>{{ scope.row.sex === '1' ? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="教学点" prop="schoolOrganName"></el-table-column>
          <el-table-column label="证件类型" prop="certTypeLabel"></el-table-column>
          <el-table-column label="证件号码" prop="certNo" width="190"></el-table-column>
          <el-table-column label="录取学校" prop="organName" show-overflow-tooltip width="170"></el-table-column>
          <el-table-column label="年级" prop="schoolYear"></el-table-column>
          <el-table-column label="报考层次">
            <template slot-scope="scope">
              <span>{{ showEnterLevel(scope.row.enterLevel) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报考专业" prop="professionalName" width="120"></el-table-column>
          <el-table-column label="学制" prop="schoolSystem" width="60"></el-table-column>
          <el-table-column label="冲突单位" prop="conflictUnit"></el-table-column>
          <!-- <el-table-column label="考试方式"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <span>{{ showEnterLevel(scope.row.testType, 'testType') }}</span> -->
          <!-- </template> -->
          <!-- </el-table-column> -->
          <el-table-column label="审核结果">
            <template slot-scope="scope">
              <span>{{ showEnterLevel(scope.row. registerType, ' registerType') }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop label="录取状态"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <span>已录取</span> -->
          <!-- </template> -->
          <!-- </el-table-column> -->
          <!-- <el-table-column label="注册状态"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <span>{{ scope.row.registerType ? registerTypeList.filter(item => item.dictValue === scope.row.registerType)[0].dictName : '' }}</span> -->
          <!-- </template> -->
          <!-- </el-table-column> -->
          <el-table-column align="center" fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <ul class="list-item-actions">
                <li class="item">
                  <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
                  <el-button @click="handleAttr(scope.row)" type="text">属性</el-button>
                  <el-button @click="handleVerify(scope.row)" type="text">审核</el-button>
                  <el-button @click="handleResetPWD(scope.row)" type="text">重置密码</el-button>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column align="center" width="24"></el-table-column>
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
      :wrapperClosable="false"
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
    <search :dialogVisible.sync="serachVisable" :organId="params.organId" @closeDia="closeDia" />
    <el-drawer
      :wrapperClosable="false"
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
import mixin from '../../../mixins/download'
import selectMixin from '../../../mixins/select.js'
import heightMixin from '@/components/Table/heightMixin'

export default {
  components: { addUserFrom, Search, verify },
  name: 'Apply',
  mixins: [mixin, heightMixin, selectMixin],
  props: {
    organType: {
      type: Number,
      default: 1 // 总院： 1, 分院： 2
    }
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
      registerTypeList: [],
      levelOption: [],
      list: [],
      map: {},
      formData: {},
      lecturerExt: {},
      ctrl: {
        loading: false,
        dialogVisible: false,
        proportionDialogVisible: false,
        viewVisible: false
      },
      opts: {
        statusIdList: []
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      params: {
        realNameOrcertNo: '',
        organId: '',
        schoolOrganId: '',
        schoolYear: ''
      },
      serachVisable: false,
      title: '录取清单审核',
      componentName: '',
      componentData: null,
      width: '500px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVerify: false,
      changePictureUrl: '',
      rowData: {}
    }
  },
  computed: {
    ...mapGetters(['organList', 'yearAndSemester']),
    schoolYearOptions() {
      return this.yearAndSemester.schoolYears
    }
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
    this.init()
  },
  methods: {
    exportExcel() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      this.download(
        params,
        '/course/student/enter/export',
        'POST',
        '批量导出',
        'xls'
      )
    },
    showEnterLevel(value, key) {
      if (key === ' registerType') {
        if (!value) return value
        return this.registerTypeList.filter(
          (item) => item.dictValue === value
        )[0].dictName
        // if (value === '1') {
        //   return '注册'
        // } else if (value === '2') {
        //   return '休学'
        // } else if (value === '3') {
        //   return '退学'
        // } else {
        //   return ''
        // }
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
    closeDia() {
      this.initPage()
      this.getTableData()
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    organChange() {
      this.init()
    },
    getTableData() {
      const params = {
        ...this.params,
        realNameOrcertNo: this.params.realNameOrcertNo,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
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
      api.importStudentFile(param).then((res) => {
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
      this.componentData = this.$_cloneDeep(row)
      this.componentName = 'verify'
      this.dialogVerify = true
    },
    // 修改跳页面操作
    handleEdit(user) {
      this.currentRow = this.$_cloneDeep(user)
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
    handleResetPWD({ certNo, studentNo, realName }) {
      this.$confirm(
        '重置密码后为<strong>“xsl+身份证后6位”</strong>，是否继续密码重置？',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const params = {
          certNo,
          studentNo,
          name: realName
        }
        api.resetStuPWD(params).then((res) => {
          if (res.code === 200) {
            this.$message.success('密码重置成功')
            this.init()
          } else {
            this.$message.error('密码重置失败')
          }
        })
      })
    }
  }
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
      // margin-right: 24px;
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
