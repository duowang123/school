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
      <el-select @change="initProfessional(true)" placeholder="请选择" v-model="ruleForm.organId">
        <el-option
          v-for="item in schoolOrgansList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
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
    <el-form-item label="学期" prop="semester">
      <el-select v-model="ruleForm.semester" placeholder="请选择">
        <el-option
          v-for="item in semesterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="层次" prop="enterLevel">
      <el-select v-model="ruleForm.enterLevel" @change="levelChange" placeholder="请选择">
        <el-option
          v-for="item in levelOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="专业" prop="professional">
      <el-select v-model="ruleForm.professional" placeholder="请选择">
        <el-option
          v-for="item in specialtyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="费用/学分" prop="eachMoney">
      <el-input v-model="ruleForm.eachMoney"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  addCreditStandard,
  updateCreditStandard,
  listByOrganIdAndLevel
} from '../api'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'Add',
  props: {
    data: Object
  },
  mixins: [selectMixin],
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.organId = this.data.organId || ''
      this.ruleForm.eachMoney = this.data.eachMoney.toString() || ''
      // this.ruleForm.professional =
      //   (this.specialtyOptions.filter(s => this.data.professionalName === s.label) ||
      //     [])[0].value || ''
      this.ruleForm.enterLevel =
        (this.levelOption.filter((s) => this.data.enterLevel === s.value) ||
          [])[0].value || ''
      this.ruleForm.schoolYear = this.data.schoolYear
      this.ruleForm.semester = this.data.semester || ''
      this.initProfessional()
    }
  },
  data() {
    return {
      ruleForm: {
        id: '',
        professional: '',
        enterLevel: '',
        eachMoney: '',
        schoolYear: '',
        semester: '',
        organId: ''
      },
      rules: {
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        eachMoney: [
          { required: true, message: '请输入学分费用', trigger: 'blur' }
          // {
          //   pattern: /^[0-9]+([.]{1}[0-9]+){0,1}/,
          //   message: '请输入正确金额',
          //   trigger: 'blur'
          // }
        ],
        professional: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        enterLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
        semester: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      specialtyOptions: []
    }
  },
  computed: {
    ...mapGetters(['yearAndSemester']),
    schoolYearOptions() {
      return this.yearAndSemester.schoolYears
    },
    semesterOptions() {
      return this.yearAndSemester.semesterMap[this.ruleForm.schoolYear] || []
    },
    levelOption() {
      return this.data.levelOption
    }
  },
  methods: {
    initProfessional(init = true) {
      const params = {
        organId: this.ruleForm.organId,
        level: this.ruleForm.enterLevel
      }
      if (!this.ruleForm.organId || !this.ruleForm.enterLevel) { return void '' }
      // if () { return this.$message.warning('请先选择招生层次!') }
      listByOrganIdAndLevel(params).then((res) => {
        if (!res.data) {
          this.specialtyOptions = []
          this.ruleForm.professional = null
          return
        }
        this.specialtyOptions = res.data.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        if (init) {
          this.ruleForm.professional = this.data.professional || ''
        } else {
          this.ruleForm.professional = this.$_getValue(res.data, '0.id', '')
        }
      })
    },
    levelChange() {
      this.initProfessional(true)
    },
    confirm(callBack) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm
          }
          const responseCallback = (res) => {
            if (res.code === 200) {
              this.$message({ type: 'success', message: '添加成功!' })
            } else {
              this.$message({ type: 'error', message: '添加失败!' })
            }
            callBack(valid)
          }
          if (this.data.isAdd) {
            addCreditStandard(params).then(responseCallback)
          } else {
            updateCreditStandard(params).then(responseCallback)
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
