<template>
  <div class="student-plan-right pad20">
    <el-form :model="form" ref="ruleForm" label-width="0" class="demo-ruleForm">
      <div class="basic">
        <div class="row">
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">学校</p>

              <el-select
                v-model="form.organId"
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
                v-model="form.schoolOrganId "
                filterable
                clearable
                v-if="showTeacher"
                lsSchool
                style="width:200px"
                @change="getTableData"
                placeholder="请选择教学点"
              >
                <el-option
                  v-for="item in organListAll"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48" style="width: 308px;">
            <div class="container">
              <p class="label">学年</p>
              <div style="display: flex">
                <el-select class="selectWidth" v-model="form.startYear" clearable placeholder="请选择">
                  <el-option
                    v-for="item in schoolYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div style="display: inline-block;height: 40px;line-height: 40px;margin: 0 5px">到</div>
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
                class="page-select"
                v-model="form.level"
                @change="levelChange"
                clearable
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
                class="page-select"
                style="width:308px"
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
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">学籍状态</p>
              <el-select class="page-select" style="width:200px" v-model="form.studentStatuss" placeholder="请选择">
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
              <el-button @click="handlerExport" type="primary">导出</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <el-table :data="tableData" style="width: 100%" :row-style="rowstyles">
      <el-table-column prop="organName" label="学校"></el-table-column>
      <el-table-column prop="schoolOrganName" label="教学点"></el-table-column>
      <el-table-column prop="schoolYear" label="学年" width="100"></el-table-column>
      <el-table-column prop="allPerson" label="总人数"></el-table-column>
      <el-table-column label="应缴费（学费）">
        <el-table-column prop="payablePersonNum" label="人数" width="80"></el-table-column>
        <el-table-column prop="payableMoney" label="总额"></el-table-column>
      </el-table-column>
      <el-table-column label="实缴费（学费）">
        <el-table-column prop="payPersonNum" label="人数" width="80"></el-table-column>
        <el-table-column prop="payMoney" label="总额"></el-table-column>
      </el-table-column>
      <el-table-column label="减免费（学费）">
        <el-table-column prop="salePersonNum" label="人数" width="80"></el-table-column>
        <el-table-column prop="saleMoney" label="总额"></el-table-column>
      </el-table-column>
      <el-table-column label="退费（学费）">
        <el-table-column prop="returnPersonNum" label="人数" width="80"></el-table-column>
        <el-table-column prop="returnMoney" label="总额"></el-table-column>
      </el-table-column>
      <el-table-column label="欠费（学费）">
        <el-table-column prop="owePersonNum" label="人数" width="80"></el-table-column>
        <el-table-column prop="oweMoney" label="总额">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.oweMoney}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as api from '../api'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  mixins: [download, selectMixin],
  data() {
    return {
      tableData: [],
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
      api.oweLogReport(params).then((res) => {
        this.tableData = this.formatData(res.data)
        console.log(res.data)
      })
    },
    // 处理表格需要转换的数据
    formatData(data) {
      return data
    },
    handlerExport() {
      const params = {
        ...this.form
      }
      this.download(
        params,
        '/course/student_pay_log/oweExport',
        'POST',
        '欠费统计',
        'xlsx'
      )
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
      width: 240px;
    }
    /deep/ .el-select {
      width: 256px;
    }
    /deep/ .el-select-dropdown {
      width: 256px;
    }
    /deep/ .el-input {
      width: 240px;
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
    right: 0px;
    bottom: 10px;
    display: inline-block;
    .el-button {
      width: 90px;
    }
  }
  /deep/ .el-form-item {
    display: inline-block;
    margin-bottom: 0 !important;
  }
  .page-select {
    width: 300px;
    /deep/ .el-input {
      width: 300px;
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

