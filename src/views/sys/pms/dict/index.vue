<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <el-button
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.form.dialog = true; isAdd = true">新增</el-button>
          </div>
          <!--工具栏-->
<!--          <div class="head-container">-->
<!--            &lt;!&ndash; 搜索 &ndash;&gt;-->
<!--            <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>-->
<!--            <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">-->
<!--              <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
<!--            </el-select>-->
<!--            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>-->
<!--          </div>-->
          <!--表格渲染-->
          <el-table height="600px" v-loading="loading" :data="data" size="small" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="id" label="ID"/>
            <el-table-column prop="dictName" label="字典名称"/>
            <el-table-column prop="dictValue" label="字典值"/>
<!--            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述"/>-->
            <el-table-column label="操作" width="130px" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
<!--          <el-pagination-->
<!--            :total="total"-->
<!--            :current-page="page + 1"-->
<!--            style="margin-top: 8px;"-->
<!--            layout="total, prev, pager, next, sizes"-->
<!--            @size-change="sizeChange"-->
<!--            @current-change="pageChange"/>-->
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail.$refs.form.dialog = true; $refs.dictDetail.isAdd = true">新增</el-button>
          </div>
          <dictDetail ref="dictDetail" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { del } from './api'
import initData from '../mixins/initData'
import dictDetail from '../dictDetail/index'
import eForm from './form'
export default {
  name: 'Dict',
  components: { dictDetail, eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = '/system/sys_dict/dictList'
      // const sort = 'id,desc'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.data = []
        this.$refs.dictDetail.dictName = ''
      }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del({ id }).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.dictName = val.dictName
        this.$refs.dictDetail.dictValue = val.dictValue
        this.$refs.dictDetail.parentId = val.parentId || ''
        this.$refs.dictDetail.init()
      }
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        dictName: data.dictName,
        dictValue: data.dictValue,
        parentId: data.parentId,
        sort: data.sort
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
