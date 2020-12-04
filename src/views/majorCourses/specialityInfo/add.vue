<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
    label-position="top"
  >
    <el-form-item label="学校" prop="organId">
      <el-select @change="getSchoolList" filterable placeholder="请选择" v-model="ruleForm.organId">
        <el-option
          :key="index"
          :label="item.name"
          :value="item.id"
          v-for="(item,index) in schoolOrgansList"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="编号" prop="specialtyNo">
      <el-input v-model="ruleForm.specialtyNo"></el-input>
    </el-form-item>
    <el-form-item label="专业名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="所属学院">
      <!--    <el-form-item label="所属学院" prop="collegeId">-->
      <el-select v-model="ruleForm.collegeId" placeholder="请选择">
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item.id"
          v-for="item in schoolOption"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学校" prop="level">
      <el-select v-model="ruleForm.level" placeholder="请选择">
        <el-option
          v-for="(item,index) in schoolOrgansList"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="层次" prop="level">
      <el-select v-model="ruleForm.level" placeholder="请选择">
        <el-option
          v-for="item in levelOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学制" prop="schoolSystem">
      <el-select v-model="ruleForm.schoolSystem" placeholder="请选择">
        <el-option v-for="item in educationalSystemList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { addSpecialty, updateSpecialty, schoolList } from '../api'
import { mapGetters } from 'vuex'
export default {
  name: 'Add',
  props: {
    data: Object,
    isAdd: Boolean
  },
  mounted() {
    this.ruleForm.id = this.data.id || ''
    this.ruleForm.name = this.data.name || ''
    this.ruleForm.organId = this.data.organId || ''
    this.ruleForm.specialtyNo = this.data.specialtyNo || ''
    this.ruleForm.schoolSystem = this.data.schoolSystem || ''
    this.ruleForm.collegeId = this.data.collegeId
    this.ruleForm.level = this.data.level
    this.getSchoolList()
  },
  data() {
    return {
      schoolOption: [],
      ruleForm: {
        id: '',
        organId: '',
        name: '',
        specialtyNo: '',
        collegeId: '',
        level: '',
        schoolSystem: ''
      },
      educationalSystemList: ['2.5', '3', '5'],
      rules: {
        organId: [{ required: true, message: '请选择', trigger: 'blur' }],
        name: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
        specialtyNo: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        collegeId: [{ required: true, message: '请选择', trigger: 'change' }],
        level: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolSystem: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    levelOption() {
      return this.$_getValue(this.data, 'levelOption', []).map((e) => {
        return {
          value: e.dictValue,
          label: e.dictName
        }
      })
    },
    ...mapGetters(['schoolOrgansList'])
  },
  methods: {
    getSchoolList() {
      if (this.ruleForm.organId) {
        schoolList(this.ruleForm.organId).then(res => {
          this.schoolOption = res.data.rows || []
        })
      }
    },
    confirm(callBack) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = this.ruleForm
          if (this.isAdd) {
            addSpecialty(params).then((res) => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '添加成功!' })
              } else {
                this.$message({ type: 'error', message: '添加失败!' })
              }
              callBack(valid)
            })
          } else {
            updateSpecialty(params).then((res) => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '更新成功!' })
              } else {
                this.$message({ type: 'error', message: '更新失败!' })
              }
              callBack(valid)
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.demo-ruleForm {
  padding: 0 20px;
}
</style>
