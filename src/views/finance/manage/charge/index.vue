<template>
  <div class="student-plan-right pad20">
    <el-form :model="form" ref="ruleForm" label-width="0" class="demo-ruleForm">
      <div class="basic">
        <div class="row">
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">学校</p>
              <el-select
                v-model="params.organId"
                filterable
                style="width:200px"
                v-if="showSchool"
                clearable
                @change="getTableData"
                placeholder="请选择学校"
              >
                <el-option
                  v-for="item in schoolOrgansListAll"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">教学点</p>
              <el-select
                @change="getTableData"
                filterable
                lsSchool
                placeholder="请选择教学点"
                style="width:200px"
                v-if="showTeacher"
                clearable
                v-model="params.schoolOrganId "
              >
                <el-option
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  v-for="item in organListAll"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">学年</p>
              <div>
                <el-select class="selectWidth" v-model="form.startYear" clearable placeholder="请选择">
                  <el-option
                    v-for="item in schoolYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select class="selectWidth" v-model="form.endYear" clearable placeholder="请选择">
                  <el-option
                    v-for="item in schoolYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="OEP-form-item select-width-200 margin_r_48">
            <div class="container">
              <p class="label">层次</p>
              <el-select
                v-model="form.level"
                clearable
                @change="levelChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">专业</p>
              <el-select
                v-model="form.professional"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in specialtyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div v-if="false" class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">统计时间段</p>
              <div>
                <el-date-picker
                  class="selectWidth"
                  v-model="form.startTime"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
                <el-date-picker
                  class="selectWidth"
                  v-model="form.endTime"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <div class="OEP-form-item select-width-200 margin_r_48">
            <div class="container">
              <p class="label">学籍状态</p>
              <el-select placeholder="请选择" v-model="form.studentStatuss">
                <el-option
                  v-for="item in studentStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="btn-width-100">
            <div class="btn-container">
              <el-button @click="getTableData" type="primary">查询</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <el-table :data="tableData" style="width: 100%" :row-style="rowstyles">
      <el-table-column prop="organName" label="合作单位"></el-table-column>
      <el-table-column prop="schoolYear" label="学年" width="100"></el-table-column>
      <el-table-column label="收费分缴费方式统计（学费）">
        <el-table-column label="现金" width="80">
          <el-table-column prop="cashPersonNumPay" label="人数" width="80"></el-table-column>
          <el-table-column prop="cashAllPay" label="总数" width="80"></el-table-column>
        </el-table-column>
        <el-table-column label="汇款">
          <el-table-column prop="transferPersonNumPay" label="人数" width="80"></el-table-column>
          <el-table-column prop="transferAllPay" label="总数" width="80"></el-table-column>
        </el-table-column>
        <el-table-column prop="name" label="网上缴费" width="80">
          <el-table-column prop="linePersonNumPay" label="人数" width="80"></el-table-column>
          <el-table-column prop="lineAllPay" label="总数" width="80"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="收费总计（学费）">
        <el-table-column prop="allPersonNumPay" label="总人数" width="80"></el-table-column>
        <el-table-column prop="allMoneyPay" label="实收金额"></el-table-column>
      </el-table-column>
      <el-table-column label="退费分缴费方式统计（学费）">
        <el-table-column label="现金">
          <el-table-column prop="cashPersonNumReturn" label="人数" width="80"></el-table-column>
          <el-table-column prop="cashAllReturn" label="总数"></el-table-column>
        </el-table-column>
        <el-table-column label="汇款">
          <el-table-column prop="transferPersonNumReturn" label="人数" width="80"></el-table-column>
          <el-table-column prop="transferAllReturn" label="总数"></el-table-column>
        </el-table-column>
        <el-table-column prop="name" label="网上缴费">
          <el-table-column prop="linePersonNumReturn" label="人数" width="80"></el-table-column>
          <el-table-column prop="lineAllReturn" label="总数"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="退费总计（学费）">
        <el-table-column prop="allPersonNumReturn" label="总人数" width="80"></el-table-column>
        <el-table-column prop="allMoneyReturn" label="退费金额"></el-table-column>
      </el-table-column>
      <el-table-column label="实收总计">
        <el-table-column prop="allPay" label="实收总计"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as api from '../api'
import selectMixin from '@/views/mixins/select.js'
import { mapGetters } from "vuex";
export default {
  name: 'Index',
  mixins: [selectMixin],
  data() {
    return {
      tableData: [],
      params: {
        queryContent: null
      },
      form: {
        organId: null,
        startYear: null,
        endYear: null,
        level: null,
        professional: null,
        startTime: null,
        endTime: null,
        studentStatuss: null,
        schoolOrganId: ''
      },
      organList: [],
      levelOptions: [],
      specialtyOptions: [],
      studentStatusOptions: []
    }
  },
  created() {
    this.params.organId = this.organListAll[0].id
    this.params.schoolOrganId = this.schoolOrgansListAll[0].id
    this.initSelectOptions()
    this.getTableData()
  },
  computed: {
    ...mapGetters(['schoolYearOptions']),
    rowstyles() {
      return {
        height: '48px'
      }
    }
  },
  methods: {
    levelChange() {
      const params = {
        organId: this.form.organId,
        level: this.form.level
      }
      if (!this.form.level) return this.$message.warning('请先选择层次!')
      api.listByOrganIdAndLevel(params).then((res) => {
        if (!res.data) {
          this.specialtyOptions = []
          this.form.professional = null
          return
        }
        this.specialtyOptions = res.data.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        this.form.professional = this.$_getValue(res.data, '0.id', '')
      })
    },
    getTableData() {
      const params = Object.assign({}, this.form)
      params.studentStatuss = params.studentStatuss
        ? [params.studentStatuss]
        : []
      api.payLogReport(params).then((res) => {
        this.tableData = this.formatData(res.data)
        console.log(res.data)
      })
    },
    // 处理表格需要转换的数据
    formatData(data) {
      return data
    },
    // 从字典中获取下拉框数据
    initSelectOptions() {
      api.getOrgan({ name: '' }).then((res) => {
        this.organList = res.data.list
        this.form.organId = this.$_getValue(res.data, 'list.0.id', '')
      })
      api.listByCode({ code: '0006' }).then((res) => {
        this.levelOptions = res.data.map((e) => {
          return {
            id: e.id,
            label: e.dictName,
            value: e.dictValue
          }
        })
      })
      api.listByCode({ code: '0029' }).then((res) => {
        this.studentStatusOptions = res.data.map((e) => {
          return {
            id: e.id,
            label: e.dictName,
            value: e.dictValue
          }
        })
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
      /deep/ .el-select {
        width: 256px;
      }
    }
  }
  /deep/ .el-drawer__body {
    padding-bottom: 80px;
    overflow-y: auto !important;
  }
  .demo-drawer__footer {
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
  /deep/ .OEP-form-item {
    margin-bottom: 10px;
    &.select-width-200 {
      width: 220px;
    }
  }
  .row {
    position: relative;
  }
  .btn-width-100 {
    position: absolute;
    right: 0;
    bottom: 10px;
    display: inline-block;
    .el-button {
      width: 120px;
    }
  }
  /deep/ .el-form-item {
    display: inline-block;
    margin-bottom: 0 !important;
  }
  .page-select {
    width: 200px !important;
    /deep/ .el-input {
      width: 200px !important;
      overflow: hidden;
    }
  }
  .selectWidth {
    width: 140px !important;
    /deep/ .el-input {
      width: 140px !important;
      overflow: hidden;
    }
  }
}
.iconfont {
  margin-right: 10px;
}
</style>

