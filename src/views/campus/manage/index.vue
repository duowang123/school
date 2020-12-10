<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="primary" @click="handlerExport()">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model.trim="params.organId"
            @change="organChange"
            clearable
            filterable
            placeholder="请选择"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in organListAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            prefix-icon="el-icon-search"
            v-model.trim="params.queryContent"
            @change="getList"
            placeholder="单位名称"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content-container">
      <div>
        <el-scrollbar class="table" :style="{height:tableHeight}" :noresize="true">
          <el-table
            :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
            v-loading="ctrl.loading"
            size="medium"
            :data="list"
            stripe
            border
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="合作单位名称"></el-table-column>
            <el-table-column prop="realName" label="合作状态">
              <template slot-scope="scope">
                <div>{{scope.row.cooperationStuts === '1' ? '招生' : '学籍教务管理'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="contactInfoS.0.name" label="联系人"></el-table-column>
            <el-table-column prop="contactInfoS.0.mobile" label="联系电话"></el-table-column>
            <el-table-column prop="contactInfoS.0.address" label="机构地址"></el-table-column>
            <el-table-column prop="property" label="机构性质">
              <template slot-scope="scope">
                <div>{{scope.row.property === '1' ? '学校' : '教学点'}}</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="220">
              <template slot-scope="scope">
                <div class="item">
                  <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="text" @click="handleRelevance(scope.row)" v-all>关联机构</el-button>
                  <el-button type="text" @click="handleAttr(scope.row)">属性</el-button>
                  <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :page-sizes="[20, 50, 100, 200, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
      ></el-pagination>
    </div>
    <el-drawer
      title="详情"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row">
          <div class="title">合作单位名称</div>
          <div class="cont">{{ currentOrgan.name }}</div>
        </div>
        <div class="content-row">
          <div class="title">合作状态</div>
          <div class="cont">{{ currentOrgan.cooperationStuts === '1' ? '招生' : '学籍教务管理' }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div style="height: 500px">
        <Add ref="addRef" :organ="organ" :is-add="isAdd" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureHandler">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="关联机构"
      :close-on-click-modal="false"
      :visible.sync="isRelevanceVisable"
      width="60%"
    >
      <div v-if="relevanceData.length">
        <el-transfer
          v-model="relevanceDataValue"
          :titles="['可选机构', '关联机构']"
          :button-texts="['到左边', '到右边']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :right-default-checked="rightChecked"
          :data="relevanceData"
          ref="transfer"
        >
          <span slot-scope="{ option }">
            <span class="label" :title="option.label">{{ option.label }}</span>
            <el-select v-model="option.value" placeholder="请选择">
              <el-option
                v-for="item in option.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRelevanceVisable = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关联机构"
      :close-on-click-modal="false"
      :visible.sync="isSchoolVisable"
      width="600px"
    >
      <el-table
        :data="schoolData"
        border
        :show-header="false"
        style="width: 100%"
        :row-style="{padding:'8px 12px', height: '50px'}"
      >
        <el-table-column prop="organName" label></el-table-column>
        <el-table-column label align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.showStatus  === '1' ? 'eye' : ''" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSchoolVisable = false">取 消</el-button>
        <el-button type="primary" @click="isSchoolVisable = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as api from '@/api/organ'
import Add from './Add'
import heightMixin from '@/components/Table/heightMixin'
import { mapGetters } from 'vuex'
import download from '@/views/mixins/download'

export default {
  name: 'OrganManage',
  mixins: [heightMixin, download],
  components: { Add },
  inject: ['appMainStyle'],
  data() {
    return {
      dialogVisible: false,
      rightChecked: [],
      isAdd: true,
      organ: null,
      moreVisible: false,
      drawer: false,
      currentOrgan: {},
      params: {
        queryContent: '',
        organId: '',
      },
      list: [],
      map: {},
      title: '新增合作单位',
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
      isRelevanceVisable: false,
      openIsShow: false,
      relevanceData: [],
      relevanceDataValue: [],
      isSchoolVisable: false,
      schoolData: [],
    }
  },
  computed: {
    ...mapGetters(['organList', 'schoolList']),
  },
  created() {
    this.init()
  },
  methods: {
    save() {
      const rightChecked = this.$refs.transfer.rightChecked
      if (rightChecked.length) {
        const selectArr = this.relevanceData.filter((item) =>
          rightChecked.includes(item.key)
        )
        const organAuthInfos = selectArr.map((item) => {
          return {
            showStatus: item.value,
            teachId: item.key,
          }
        })
        const params = {
          schoolId: this.currentOrgan.id,
          organAuthInfos,
        }
        api
          .getAuth(params)
          .then((res) => {
            if (res.code === 200) {
              this.isRelevanceVisable = false
              this.$message.success('保存成功!')
            } else {
              this.$message.warning('保存失败!')
            }
          })
          .catch((err) => {
            this.$message.warning('保存失败!')
          })
      } else {
        return this.$message.warning('请选择关联机构!')
      }
    },
    init() {
      this.getList()
    },
    getList() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
      }
      api.organPageList(params).then((res) => {
        this.list = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleAttr(data) {
      this.currentOrgan = data
      this.drawer = true
    },
    handleDelete(organ) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.deleteOrgan({ id: organ.id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.init()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
            })
          }
        })
      })
    },
    handleAdd() {
      this.$refs.addRef && this.$refs.addRef.clearValidate()
      this.dialogVisible = true
      this.organ = null
      this.isAdd = true
      this.title = '新增合作单位'
      setTimeout(() => {
        this.$refs.addRef.init()
      })
    },
    handlerExport() {
      const params = {
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...this.params,
      }
      // TODO
      this.download(
        params,
        '/system/sys_organ/export',
        'POST',
        '合作单位',
        'xlsx'
      )
    },
    ensureHandler() {
      this.$refs.addRef.save((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.$nextTick(() => {
            this.$store.dispatch('updateOrganList')
            this.init()
          })
        }
      })
    },
    // 修改跳页面操作
    handleEdit(organ) {
      this.organ = this.$_cloneDeep(organ)
      this.dialogVisible = true
      this.isAdd = false
      this.$refs.addRef && this.$refs.addRef.clearValidate()
      this.title = '编辑合作单位'
      setTimeout(() => {
        this.$refs.addRef.init()
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.page.pageSize = val
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      // console.log(`当前页: ${val}`)
    },
    confirmData() {
      this.openIsShow = false
    },
    getshowStatus(organAuthInfos, id) {
      const arr = organAuthInfos.filter((item) => item.organId === id) || []
      return arr.length ? arr[0].showStatus || '1' : '1'
    },
    handleRelevance(row) {
      this.$nextTick(() => {
        //  property 1.教学 2 学校
        this.currentOrgan = row
        const { property, id, contactInfoS } = row
        if (property === '1') {
          api.getAuthList({ schoolId: id }).then((res) => {
            const organAuthInfos = res.data.organAuthInfos || []
            const relevanceData = res.data.sysOrganChileRESQS || []
            // 可选列表
            this.relevanceData =
              res.data.sysOrganChileRESQS && res.data.sysOrganChileRESQS.length
                ? res.data.sysOrganChileRESQS.map((item) => {
                    return {
                      label: item.name,
                      disabled: false,
                      key: item.id,
                      value: organAuthInfos.length
                        ? this.getshowStatus(organAuthInfos, item.id)
                        : item.showStatus || '1',
                      options: [
                        {
                          label: '可见',
                          value: '1',
                        },
                        {
                          label: '不可见',
                          value: '2',
                        },
                      ],
                    }
                  })
                : []
            if (organAuthInfos.length) {
              this.rightChecked = organAuthInfos.map((item) => item.organId)
              this.relevanceDataValue = organAuthInfos.map(
                (item) => item.organId
              )
            }
            this.isRelevanceVisable = true
          })
        } else {
          api
            .getTeachAuthList({
              teachId: this.currentOrgan.id,
            })
            .then((res) => {
              this.schoolData = res.data
              this.isSchoolVisable = true
            })
        }
      })
    },
    organChange() {
      this.getList()
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
  }
}
.drawer-content {
  .content-row {
    margin: 24px;
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
.el-transfer /deep/ .el-transfer-panel:nth-of-type(1) .el-select {
  display: none;
}
.el-transfer /deep/ .el-transfer-panel {
  width: 300px;
  .el-transfer-panel__item {
    height: 35px;
    line-height: 35px;
  }
}
.el-transfer /deep/ .el-transfer-panel .el-select {
  width: 100px;
  margin-left: 10px;
  vertical-align: super;
  input {
    line-height: 30px;
    height: 30px;
  }
}
.label {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
