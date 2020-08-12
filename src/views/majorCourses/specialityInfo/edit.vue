<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
    <el-form-item label="编号" prop="number">
      <el-input v-model="ruleForm.number"></el-input>
    </el-form-item>
    <el-form-item label="专业名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="所属学院" prop="school">
      <el-select v-model="ruleForm.school" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="层次" prop="layer">
      <el-select v-model="ruleForm.layer" placeholder="请选择">
        <el-option
          v-for="item in optionsLayer"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'Edit',
    props: {
      options: {
        type: Array,
        default: () => [
          { value: '0',
            label: '教育学院' },
          { value: '1',
            label: '工学院' },
          { value: '2',
            label: '理学院' },
          { value: '3',
            label: '历史学院' }
        ]
      },
      optionsLayer: {
        type: Array,
        default: () => [
          { value: '0',
            label: '大专' },
          { value: '1',
            label: '本科' }
        ]
      }
    },
    data() {
      return {
        ruleForm: {
          name: '',
          number: '',
          school: '',
          layer: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入专业名称', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          number: [
            { required: true, message: '请输入编号', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          school: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          layer: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      confirm() {
        let bool = false
        this.$refs.ruleForm.validate((valid) => {
          bool = valid
        });
        return bool
      }
    }
  }
</script>

<style scoped lang="scss">
.demo-ruleForm{
   padding: 0 20px;
 }
</style>
