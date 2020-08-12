<template>
  <div>
    <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" label-position="top" class="demo-ruleForm">
      <el-row :gutter="30">
        <el-col :span="13">
          <el-form-item label="计划名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请选择"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="类型" prop="type">
            <el-select class="type" v-model="ruleForm.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="13">
          <el-form-item label="专业" prop="specialtyId">
            <el-select v-model="ruleForm.specialtyId" placeholder="请选择">
              <el-option
                v-for="item in specialtyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="层次" prop="level">
            <el-select class="selectWidth" v-model="ruleForm.level" placeholder="请选择">
              <el-option
                v-for="item in levelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
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
                :value="item.value">
              </el-option>
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
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <courses-table
      class="table"
      :tableConfig="tableConfig"
      :colWidth="{ opear: '60px' }"
      :tableData="tableData">
      <template slot-scope="{ scope }">
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <i class="iconfont icon-delete" @click="handleDelete(scope.$index)"></i>
        </el-tooltip>
      </template>
    </courses-table>
    <div class="add" @click="openCourseList">+ 添加</div>
    <el-dialog title="课程列表" :close-on-click-modal="false" append-to-body :visible.sync="dialogTableVisible" width="600px">
      <courses-table
        ref="coursesTableRef"
        class="table"
        @handle-selection-change="handleSelectionChange"
        :tableConfig="courseTableConfig"
        :colWidth="{ opear: '60px' }"
        :tableData="courseList">
      </courses-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import CoursesTable from '@/components/Table/coursesTable'
  import { addTeachingPlan, updateTeachingPlan, getCourseByTeachingPlan } from '../api'

  export default {
    name: 'Add',
    components: {
      CoursesTable
    },
    props: {
      data: Object
    },
    data() {
      const selectChange = [{ required: true, message: '请选择', trigger: 'change' }]
      return {
        ruleForm: {
          id: '',
          type: '',
          name: '',
          specialtyId: '',
          schoolYear: '',
          semester: '',
          level: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入计划名称', trigger: 'blur' }
          ],
          planName: [
            { required: true, message: '请输入计划名称', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          type: selectChange,
          specialtyId: selectChange,
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
              label: '课程名称',
              prop: 'courseName',
              width: '350'
            }
          ]
        },
        courseTableConfig: {
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
        dialogTableVisible: false
      }
    },
    created() {
      if (this.data.tableData) {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = this.data.tableData[key]
        }
        this.ruleForm.semester = this.data.tableData.semesterId
        this.ruleForm.type = this.data.tableData.typeId
        if (!this.data.isAdd) {
          getCourseByTeachingPlan(this.data.tableData.id).then(res => {
            this.tableData = res.data.courseInfoList || []
          })
        }
      }
    },
    computed: {
      schoolYearOptions() {
        return this.data.schoolYearOptions
      },
      semesterOptions() {
        return this.data.semesterOptions
      },
      specialtyOptions() {
        return this.data.specialtyOptions
      },
      levelOption() {
        return this.data.levelOption
      },
      typeOptions() {
        return this.data.typeOptions
      },
      courseList() {
        return this.data.courseList
      }
    },
    methods: {
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
              organId: this.data.organId,
              courseIds: this.tableData.map(e => (e.courseId || e.id))
            }
            const responseCallback = res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '添加成功!' })
              } else {
                this.$message({ type: 'error', message: '添加失败!' })
              }
              callBack(valid)
            }
            if (this.data.isAdd) {
              addTeachingPlan(params).then(responseCallback)
            } else {
              updateTeachingPlan(params).then(responseCallback)
            }
          }
        });
      },
      handleDelete(index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1)
        })
      },
      openCourseList() {
        this.dialogTableVisible = true
        this.$nextTick(() => {
          this.$refs.coursesTableRef.toggleRowSelection(this.tableData)
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
    margin-left: 25px;
    width:49px;
    height:32px;
    font-weight:500;
    color:rgba(63,147,219,1);
    line-height:32px;
    cursor: pointer;
    user-select:none;
  }
  .table {
    margin: 25px;
    width: calc(100% - 50px);
  }
  .demo-ruleForm{
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
    color: #A3AAB3;
  }
</style>
