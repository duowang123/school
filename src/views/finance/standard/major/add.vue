<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <el-form-item label="学校" prop="organId">
        <el-select :disabled="!data.isAdd" @change="initProfessional(true)" placeholder="请选择" v-model="ruleForm.organId">
          <el-option
            v-for="item in schoolOrgansList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学年" prop="schoolYear">
        <el-select :disabled="!data.isAdd" class="selectWidth" placeholder="请选择" v-model="ruleForm.schoolYear">
          <el-option
            v-for="item in schoolYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生入学学年" prop="schoolYearIn">
        <el-select :disabled="!data.isAdd" placeholder="请选择" v-model="ruleForm.schoolYearIn">
          <el-option
            v-for="item in schoolYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="层次" prop="enterLevel">
        <el-select :disabled="!data.isAdd" @change="levelChange" placeholder="请选择" v-model="ruleForm.enterLevel">
          <el-option
            v-for="item in levelOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="professional">
        <el-select :disabled="!data.isAdd" placeholder="请选择" v-model="ruleForm.professional">
          <el-option
            v-for="item in specialtyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学费标准" prop="chargeMoney">
        <el-input v-model="ruleForm.chargeMoney"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="ruleForm.openStatus">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <p class="other-title">其他费用</p>
    <div class="add" @click="openFeeList">+ 添加</div>
    <courses-table
      height="250"
      class="table"
      :tableConfig="tableConfig"
      :tableData="ruleForm.others"
      :colWidth="{ opear: '100px' }"
    >
      <template slot-scope="{ scope }">
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <i class="iconfont icon-delete" @click="handleDelete(scope)"></i>
        </el-tooltip>
      </template>
    </courses-table>
    <el-dialog
      title="其他费用"
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="dialogAddVisible"
      width="400px"
    >
      <el-form
        :model="ruleAddForm"
        :rules="rulesAdd"
        ref="ruleAddForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="费用类型" prop="moneyType">
          <el-select class="selectWidth" v-model="ruleAddForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in moneyTypeOptions"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费标准" prop="chargeMoney">
          <el-input v-model="ruleAddForm.chargeMoney"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFee">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addMajorStandard,
  updateMajorStandard,
  listByOrganIdAndLevel,
  viewMajorStandard,
} from '../api'
import CoursesTable from '@/components/Table/coursesTable'
import selectMixin from '@/views/mixins/select.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Add',
  components: {
    CoursesTable,
  },
  mixins: [selectMixin],
  props: {
    data: Object,
  },
  created() {
    if (!this.data.isAdd) {
      this.ruleForm.id = this.data.id || ''
      this.ruleForm.organId = this.data.organId || ''
      this.ruleForm.chargeMoney = this.data.chargeMoney.toString() || ''
      // this.ruleForm.professional =
      //   (this.specialtyOptions.filter(s => this.data.professionalName === s.label) ||
      //     [])[0].value || ''
      this.ruleForm.enterLevel =
        (this.levelOption.filter((s) => this.data.enterLevel === s.value) ||
          [])[0].value || ''
      this.ruleForm.schoolYear = this.data.schoolYear
      this.initProfessional()
      this.initOtherFee()
    }
  },
  data() {
    const vm = this
    return {
      ruleForm: {
        id: '',
        organId: '',
        professional: '',
        enterLevel: '',
        chargeMoney: '',
        schoolYear: '',
        others: [],
        schoolYearIn: '',
        openStatus: 1,
      },
      rules: {
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        chargeMoney: [
          { required: true, message: '请输入学费标准', trigger: 'blur' },
          // {
          //   pattern: /^[0-9]+\.[0-9]+$/,
          //   message: '请输入正确金额',
          //   trigger: 'blur'
          // }
        ],
        schoolYearIn: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        professional: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        enterLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      specialtyOptions: [],
      tableData: [],
      tableConfig: {
        loading: false,
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64',
        },
        columnConfig: [
          {
            label: '费用类型',
            prop: 'moneyType',
            width: '100',
            type: 'enums',
            enums: (value) => {
              return vm.moneyTypeOptions.filter(
                (item) => item.dictValue === value
              )[0].dictName
            },
          },
          {
            label: '费用标准',
            prop: 'chargeMoney',
            width: '80',
          },
        ],
      },
      dialogAddVisible: false,
      ruleAddForm: {
        moneyType: null,
        chargeMoney: null,
      },
      rulesAdd: {
        chargeMoney: [
          { required: true, message: '请输入收费标准', trigger: 'blur' },
          // {
          //   pattern: /^[0-9]+\.[0-9]+$/,
          //   message: '请输入正确金额',
          //   trigger: 'blur'
          // }
        ],
        moneyType: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    }
  },
  computed: {
    ...mapGetters(['schoolYearOptions']),
    levelOption() {
      return this.data.levelOption
    },
    moneyTypeOptions() {
      return this.data.moneyTypeOptions
    },
  },
  watch: {
    dialogAddVisible(val) {
      this.ruleAddForm = {
        moneyType: null,
        chargeMoney: null,
      }
    },
  },
  methods: {
    initOtherFee() {
      viewMajorStandard({ id: this.data.id }).then((res) => {
        this.ruleForm.others = res.data.others
      })
    },
    addFee() {
      this.$refs.ruleAddForm.validate((valid) => {
        if (valid) {
          this.ruleForm.others.push(this.ruleAddForm)
          this.dialogAddVisible = false
        }
      })
    },
    openFeeList() {
      this.dialogAddVisible = true
    },
    handleDelete(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log(row.$index)
          this.ruleForm.others.splice(row.$index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    initProfessional(init = true) {
      const params = {
        organId: this.ruleForm.organId,
        level: this.ruleForm.enterLevel,
      }
      if (!this.ruleForm.organId || !this.ruleForm.enterLevel) {
        return void ''
      }
      listByOrganIdAndLevel(params).then((res) => {
        if (!res.data) {
          this.specialtyOptions = []
          this.ruleForm.professional = null
          return
        }
        this.specialtyOptions = res.data.map((e) => {
          return {
            label: e.name,
            value: e.id,
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
            ...this.ruleForm,
            organId: this.ruleForm.organId,
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
            addMajorStandard(params).then(responseCallback)
          } else {
            updateMajorStandard(params).then(responseCallback)
          }
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.demo-ruleForm {
  padding: 0 20px;
}
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
.other-title {
  margin-left: 25px;
  font-size: 13px;
  font-weight: bold;
}
.table {
  margin: 10px 25px;
  width: calc(100% - 50px);
}
</style>
