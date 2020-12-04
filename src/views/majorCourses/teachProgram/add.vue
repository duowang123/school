<template>
  <div>
    <el-select
      :disabled="!isAll"
      clearable
      filterable
      placeholder="请选择学校"
      style="margin-left: 20px"
      v-model="ruleForm.organId"
    >
      <el-option
        :key="item.id"
        :label="item.name"
        :value="item.id"
        v-for="item in schoolOrgansList"
      ></el-option>
    </el-select>
    <el-form
      :model="ruleForm"
      :inline="true"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="top"
      class="demo-ruleForm"
    >
      <el-row :gutter="30">
        <el-col :span="13">
          <el-form-item label="计划名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请选择"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="类型" prop="type" :disabled="!data.isAdd">
            <el-select
              class="type"
              @change="planTypeChange"
              v-model="ruleForm.type"
              :disabled="!!this.tableData.length"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="13">
          <el-form-item label="层次">
            <el-select
              class="selectWidth"
              v-model="ruleForm.level"
              :disabled="ruleForm.type === '2'"
              placeholder="请选择"
            >
              <el-option
                v-for="item in levelOption"
                :key="item.value"
                @click.native="handlerLevel(item)"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态" prop="enable">
            <el-radio-group v-model="ruleForm.enable">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="专业" prop="specialtyId">
            <el-select
              v-model="ruleForm.specialtyId"
              placeholder="请选择"
              :disabled="ruleForm.type === '2'"
            >
              <el-option
                v-for="(item,index) in specialtyOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学年" prop="schoolYear">
            <el-select class="selectWidth" v-model="ruleForm.schoolYear" placeholder="请选择">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学期" prop="semester">
            <el-select class="selectWidth" v-model="ruleForm.semester" placeholder="请选择">
              <el-option
                v-for="item in semesterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="学生入学学年" prop="specialtyId">
            <el-select v-model="ruleForm.stuSchoolYear" placeholder="请选择">
              <el-option
                v-for="item in schoolYearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学生入学学期">
            <el-select class="selectWidth" v-model="ruleForm.stuSemester" placeholder="请选择">
              <el-option
                v-for="item in stuSemesterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="状态">
            <el-radio-group v-model="ruleForm.enable">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="add" @click="openCourseList">+ 添加</div>
    <courses-table
      class="table"
      :tableConfig="tableConfig"
      :colWidth="{ opear: '60px' }"
      :tableData="tableData"
      height="250"
    >
      <template slot-scope="{ scope }">
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <i class="iconfont icon-delete" @click="handleDelete(scope.$index)"></i>
        </el-tooltip>
      </template>
    </courses-table>
    <el-dialog
      title="课程列表"
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="dialogTableVisible"
      width="600px"
    >
      <el-input
        style="width: 250px; margin-left: 25px"
        @keydown.enter.native="getCourseList"
        placeholder="课程名称"
        v-model="search"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="getCourseList"></el-button>
      </el-input>
      <courses-table
        ref="coursesTableRef"
        class="table"
        @handle-selection-change="handleSelectionChange"
        height="400"
        :tableConfig="courseTableConfig"
        :colWidth="{ opear: '60px' }"
        :tableData="courseList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CoursesTable from '@/components/Table/coursesTable'
import {
  addTeachingPlan,
  updateTeachingPlan,
  getCourseByTeachingPlan,
  specialtyOptions,
  courseListByTeachPlan
} from '../api'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Add',
  components: {
    CoursesTable
  },
  mixins: [selectMixin],
  props: {
    data: Object
  },
  data() {
    const selectChange = [
      { required: true, message: '请选择', trigger: 'change' }
    ]
    const specialtyValid = (rule, val, callback) => {
      if (this.ruleForm.type === '2' || val) {
        callback()
      } else {
        callback(new Error('请选择'))
      }
    }
    return {
      courseList: [],
      ruleForm: {
        id: '',
        type: '',
        name: '',
        semester: '',
        schoolYear: '',
        specialtyId: '',
        stuSchoolYear: '',
        stuSemester: '',
        level: '',
        organId: '',
        enable: true
      },
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        enable: [{ required: true, message: '请选择', trigger: 'blur' }],
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ],
        type: selectChange,
        specialtyId: [{ validator: specialtyValid, trigger: 'blur' }],
        semester: selectChange,
        schoolYear: selectChange,
        level: selectChange
      },
      tableData: [],
      tempTableData: [],
      tableConfig: {
        loading: false,
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '60'
        },
        columnConfig: [
          {
            label: '学分',
            prop: 'courseCredit',
            width: ''
          },
          {
            label: '课程类型',
            prop: 'courseTypeLabel',
            width: ''
          },
          {
            label: '课程名称',
            prop: 'courseName',
            width: '350'
          }
        ]
      },
      courseTableConfig: {
        height: 400,
        loading: false,
        isHideOperation: true,
        selection: {
          type: 'selection',
          width: '55'
        },
        columnConfig: [
          {
            label: '课程名称',
            prop: 'courseName',
            width: '175'
          },
          {
            label: '课程类型',
            prop: 'courseTypeLabel',
            width: ''
          },
          {
            label: '学分',
            prop: 'courseCredit',
            width: ''
          }
        ]
      },
      dialogTableVisible: false,
      search: '',
      specialtyOptions: []
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['yearAndSemester']),
    schoolYearOptions() {
      return this.yearAndSemester.schoolYears
    },
    semesterOptions() {
      return this.yearAndSemester.semesterMap[this.ruleForm.schoolYear] || []
    },
    stuSemesterOptions() {
      return this.yearAndSemester.semesterMap[this.ruleForm.stuSchoolYear] || []
    },
    // specialtyOptions() {
    // return this.data.specialtyOptions
    // },
    levelOption() {
      return this.data.levelOption
    },
    typeOptions() {
      return this.data.typeOptions
    }
  },
  methods: {
    init() {
      if (this.data.tableData) {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = this.data.tableData[key]
        }
        this.ruleForm.enable =
          this.ruleForm.enable === undefined ? true : this.ruleForm.enable
        this.ruleForm.semester = this.data.tableData.semester
        this.ruleForm.type = this.data.tableData.typeId
        if (!this.data.isAdd) {
          getCourseByTeachingPlan(this.data.tableData.id).then((res) => {
            this.tableData = res.data.courseInfoList || []
          })
        }
        if (this.ruleForm.level) {
          specialtyOptions({
            organId: this.ruleForm.organId,
            level: this.ruleForm.level
          }).then((res) => {
            this.specialtyOptions = res.data || []
          })
        }
      }
      this.ruleForm.organId = this.ruleForm.organId || this.schoolOrgansList[0].id
    },
    planTypeChange(val) {
      if (val === '2') {
        this.ruleForm.specialtyId = ''
        this.ruleForm.level = ''
      }
    },
    handlerLevel(item) {
      specialtyOptions({
        organId: this.ruleForm.organId,
        level: this.ruleForm.level
      }).then((res) => {
        this.specialtyOptions = res.data || []
        this.ruleForm.specialtyId = ''
      })
    },
    confirm(callBack) {
      if (!this.tableData.length) {
        this.$message.info('请选择课程')
        callBack(false)
        return false
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            courseIds: this.tableData.map((e) => e.courseId || e.id)
          }
          const responseCallback = (res) => {
            const msg = this.data.isAdd ? '添加' : '数据更新'
            if (res.code === 200) {
              this.$message({ type: 'success', message: msg + '成功!' })
            } else {
              this.$message({ type: 'error', message: msg + '失败!' })
            }
            callBack(valid)
          }
          if (this.data.isAdd) {
            addTeachingPlan(params).then(responseCallback)
          } else {
            updateTeachingPlan(params).then(responseCallback)
          }
        }
      })
    },
    handleDelete(index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
      })
    },
    openCourseList() {
      if (!this.ruleForm.type) {
        this.$message.warning('请先选择计划类型！')
        return false
      }
      if (this.ruleForm.type === '1' && !this.ruleForm.specialtyId) {
        this.$message.warning('请选择专业！')
        return false
      }
      this.getCourseList()
      this.courseTableConfig.loading = true
      this.dialogTableVisible = true
    },
    getCourseList() {
      const params = {
        queryContent: this.search,
        organId: this.ruleForm.organId,
        specialtyId: this.ruleForm.specialtyId || '',
        teachPlanType: this.ruleForm.type || ''
      }
      courseListByTeachPlan(params).then((res) => {
        this.courseList = res.data.map((e) => {
          e.courseId = e.id
          return e
        })
        const selIds = this.tableData.map((e) => e.courseId)
        const selData = res.data.filter((e) => selIds.includes(e.courseId))
        this.courseTableConfig.loading = false
        setTimeout(() => {
          this.$refs.coursesTableRef.toggleRowSelection(selData, true)
        }, 700)
      })
    },
    handleSelectionChange(val) {
      this.tempTableData = val
    },
    addCourse() {
      this.dialogTableVisible = false
      this.tableData = this.tempTableData
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  width: 100%;
  height: 32px;
  font-weight: 500;
  color: rgba(63, 147, 219, 1);
  line-height: 32px;
  cursor: pointer;
  user-select: none;
  text-align: right;
  padding-right: 25px;
}
.table {
  margin: 25px;
  width: calc(100% - 50px);
}
.demo-ruleForm {
  padding: 0 20px;
}
/deep/ .el-form {
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: 100%;
      .el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
.icon-delete {
  color: #a3aab3;
}
</style>
