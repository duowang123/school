<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item >
          <el-input v-model.trim="params.queryContent" @change="getList" placeholder="机构名称"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="ctrl.loading" size="medium" :data="list" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="name" label="合作单位名称"></el-table-column>
        <el-table-column prop="realName" label="合作状态">
          <template slot-scope="scope">
            <div>{{scope.row.cooperationStuts === '1' ?  '招生' : '学籍教务管理'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="contactInfoS.0.name" label="联系人">
        </el-table-column>
        <el-table-column prop="contactInfoS.0.mobile" label="联系电话"></el-table-column>
        <el-table-column prop="contactInfoS.0.address" label="机构地址"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <div class="item">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleAttr(scope.row)">属性</el-button>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="handleDelete(scope.row)">确定
                  </el-button>
                </div>
                <el-button slot="reference" type="text" >删除</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-pagination
        background
        style="float: right;margin-top: 20px; margin-bottom: 22px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :page-sizes="[20, 50, 100, 200, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>
    <el-drawer
        title="详情"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="() => drawer = false">
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
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogVisible" width="70%">
      <div style="height: 500px">
        <Add ref="addRef" :organ="organ" :is-add="isAdd"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as api from '@/api/organ'
  import Add from './Add'
  export default {
    name: 'OrganManage',
    components: { Add },
    data() {
      return {
        dialogVisible: false,
        isAdd: true,
        organ: null,
        moreVisible: false,
        drawer: false,
        currentOrgan: {},
        organId: '1',
        params: {
          queryContent: ''
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
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.getList()
      },
      getList() {
        const params = {
          ...this.params,
          pageCurrent: this.page.pageCurrent,
          pageSize: this.page.pageSize
        }
        api.organPageList(params).then(res => {
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
        api.deleteOrgan({ id: organ.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.init()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
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
      ensureHandler() {
        this.$refs.addRef.save(valid => {
          if (valid) {
            this.dialogVisible = false
            this.init()
          }
        })
      },
      // 修改跳页面操作
      handleEdit(organ) {
        this.organ = organ
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
    }
  }
  .drawer-content {
    .content-row {
      margin: 24px;
      .title {
        height:24px;
        font-size:14px;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:24px;
      }
      .cont {
        height:24px;
        font-size:14px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:24px;
      }
    }
  }
</style>
