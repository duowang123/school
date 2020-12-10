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
      <el-select @change="organChange(true)" placeholder="请选择" v-model="ruleForm.organId">
        <el-option
          v-for="item in schoolOrgansList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="论文计划名称" prop="paperPlanId">
      <el-select v-model="ruleForm.paperPlanId" placeholder="请选择">
        <el-option
          v-for="item in paperPlanList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="层次" prop="level">
      <el-select v-model="ruleForm.level" @change="levelChange" placeholder="请选择">
        <el-option
          v-for="item in levelOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="专业" prop="professionId">
      <el-select v-model="ruleForm.professionId" placeholder="请选择">
        <el-option
          v-for="item in specialtyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选课题目" >
      <el-input v-model="ruleForm.selectName"></el-input>
    </el-form-item>
    <el-form-item label="描述" >
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入备注内容"
        v-model="ruleForm.remark"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import * as api from '../../api'
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
      this.ruleForm.level = this.data.level || ''
      this.ruleForm.professionId = this.data.professionId || ''
      this.ruleForm.paperPlanId = this.data.paperPlanId || ''
      this.ruleForm.remark = this.data.remark || ''
      this.ruleForm.selectName = this.data.selectName || ''
      this.initProfessional()
      this.getCommonPage()
    }
  },
  computed: {
    levelOption() {
      return this.data.levelOption
    }
  },
  data() {
    return {
      paperPlanList: [],
      ruleForm: {
        id: '',
        level: '',
        paperPlanId: '',
        professionId: '',
        remark: '',
        selectName: '',
        organId: ''
      },
      rules: {
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        professionId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        level: [{ required: true, message: '请选择', trigger: 'change' }],
        paperPlanId: [{ required: true, message: '请选择', trigger: 'change' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }],
        selectName: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      specialtyOptions: []
    }
  },
  methods: {
    organChange() {
      this.getPaperPlan()
      this.initProfessional(true)
    },
    getPaperPlan() {
      if (!this.ruleForm.organId) {
        return false
      }
      api.commonPageRequest(
        { organId: this.ruleForm.organId },
        'paper_plan',
        'listByOrganId'
      )
        .then((res) => {
          this.paperPlanList = res.data.map((e) => {
            return {
              label: e.paperName,
              value: e.id
            }
          })
        })
    },
    initProfessional(init = true) {
      if (!this.ruleForm.organId || !this.ruleForm.level) {
        return false
      }
      const params = {
        organId: this.ruleForm.organId,
        level: this.ruleForm.level
      }
      api.listByOrganIdAndLevel(params).then((res) => {
        if (!res.data) {
          this.specialtyOptions = []
          this.ruleForm.professionId = null
          return
        }
        this.specialtyOptions = res.data.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        if (init) {
          this.ruleForm.professionId = this.data.professionId || ''
        } else {
          this.ruleForm.professionId = this.$_getValue(res.data, '0.id', '')
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
            ...this.ruleForm,
          }
          const responseCallback = (res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: (this.data.isAdd ? '添加' : '修改') + '成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: (this.data.isAdd ? '添加' : '修改') + '失败!'
              })
            }
            callBack(valid)
          }
          if (this.data.isAdd) {
            api
              .commonPageRequest(params, this.data.modelName, 'save')
              .then(responseCallback)
          } else {
            api
              .commonPageRequest(params, this.data.modelName, 'update')
              .then(responseCallback)
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
