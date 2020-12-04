<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="batchDownloadImage">下载</el-button>
        </el-form-item>
        <div>
          <el-form-item class="select-width-240">
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
              v-model="params.schoolOrganId"
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
          </el-form-item>
          <el-form-item class="select-width-240">
            <el-select class="organ-select" v-model="params.schoolYear" clearable placeholder="学年">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click.native="getTableData"
                v-for="item in schoolYearOptions"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="select-width-240">
            <el-input
              v-model.trim="params.realNameOrcertNo"
              @keyup.enter.native="init"
              placeholder="姓名/证件号码/学号"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item> -->
          <!-- <div class="search-btn" @click="superSearch()"> -->
          <!-- <svg-icon icon-class="search" /> -->
          <!-- </div> -->
          <!-- </el-form-item> -->
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <el-scrollbar class="table" :style="{height:tableHeight}" :noresize="true">
        <div class="img-box-container" :loading="loading">
          <template v-if="photoData.length">
            <div class="img-box" v-for="(item, i) in photoData" :key="i">
              <div class="item-img-box">
                <img class="item-img" :src="showImg(item.pictureUrl1)" alt />
              </div>
              <div class="item-txt">
                <span>姓名：</span>
                <span>{{item.realName}}</span>
              </div>
              <div class="item-txt">
                <span>证件号码：</span>
                <span>{{item.certNo}}</span>
              </div>
              <div class="item-download" @click="downloadImg(item)">下载</div>
            </div>
          </template>
          <div v-else class="no-data">暂无数据</div>
        </div>
      </el-scrollbar>
      <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="page.pageCurrent"
        :pagination-config="paginationConfig"
      />
    </div>
  </div>
</template>
<script>
import * as api from '@/api/organ'
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
import pagination from '@/components/Table/pagination'
import { mapGetters } from 'vuex'
import mixin from '../../../mixins/download'
import heightMixin from '@/components/Table/heightMixin'
import selectMixin from '../../../mixins/select.js'

export default {
  components: {
    pagination,
  },
  mixins: [mixin, heightMixin, selectMixin],
  name: 'Photo',
  data() {
    return {
      params: {
        schoolYear: '',
        organId: '',
        realNameOrcertNo: '',
        schoolOrganId: ''
      },
      photoData: [],
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      componentName: '',
      dialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['organList', 'schoolYearOptions']),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200]
      }
    }
  },
  mounted() {
    setTimeout(async () => {
      this.$set(this.params, 'organId', this.organListAll[0].id)
      this.init()
    }, 500)
  },
  methods: {
    showImg(url) {
      return `${BASE_API}/course/${url}?token=${getToken()}`
    },
    async getOrganId(item) {
      await this.initPage()
      this.getTableData({ organId: item.id })
    },
    async init() {
      await this.initPage()
      this.getTableData()
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    organChange() {
      this.getTableData()
    },
    yearChange() {
      this.getTableData()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.init()
    },
    // 高级搜索
    superSearch() {
      this.dialogVisible = true
      this.componentName = 'search'
    },
    getTableData(query) {
      this.loading = true
      this.photoData = []
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...query,
      }
      api
        .studentImgInfo(params)
        .then((res) => {
          this.photoData = res.data.rows ? res.data.rows : []
          this.page.totalCount = res.data.totalCount
          this.page.totalPage = res.data.totalPage
          this.loading = false
        })
        .catch((err) => {
          this.photoData = []
          this.loading = false
        })
    },
    // 批量导出图片
    batchDownloadImage() {
      const params = {
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...this.params,
      }
      if (!params.schoolYear) return this.$message.error('学年不能为空!')
      this.download(
        params,
        '/course/student_picture/zip/download',
        'POST',
        '批量导出',
        'zip'
      )
    },
    // 单个图片下载
    downloadImg(item) {
      this.download(
        { id: item.id },
        '/course/student_picture/downloadImage',
        'POST',
        item.studentNo,
        'jpg'
      )
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
    background-color: #f3f5f7;
    .organ-select {
      /deep/ .el-select {
        width: 240px;
      }
    }
  }
}
.img-box-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .img-box {
    width: 275px;
    height: 250px;
    border: 1px solid #ececec;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: 'center';
    margin: 12px 24px 12px 0;
    padding: 16px 0 16px 16px;
    .item-img-box {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .item-img {
      text-align: center;
      width: 110px;
      height: 132px;
    }
    .item-txt {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #999999;
    }
    .item-download {
      font-size: 14px;
      width: 40px;
      height: 24px;
      line-height: 24px;
      background-color: #3f93db;
      color: #fff;
      text-align: center;
      margin-top: 10px;
      cursor: pointer;
    }
  }
  // .img-box:nth-of-type(5n) {
  // margin-right: 0;
  // }
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
.no-data {
  display: block;
  text-align: center;
  width: 100%;
  height: 500px;
  line-height: 500px;
  font-size: 30px;
  background: #fff;
  color: #cccccc;
}
</style>
