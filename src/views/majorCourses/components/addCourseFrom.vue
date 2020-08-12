<template>
  <div class="course-info-from">
    <div class="info-form">
      <el-row :gutter="20">
        <!--    <el-col :span="24">-->
        <!--      <p class="title">基本信息 <span>（基本信息均需填写！）</span></p>-->
        <!--    </el-col>-->
        <el-col :span="20">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="true" class="demo-ruleForm" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程名称" prop="courseName">
                  <el-input v-model="ruleForm.courseName" placeholder="请选择课程名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="课程编号" prop="courseNo">
                  <el-input v-model="ruleForm.courseNo" placeholder="请选择课程编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="课程学分" prop="courseCredit">
                  <el-input-number v-model="ruleForm.courseCredit"  placeholder="请选择课程学分" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="课程类型" prop="courseType">
                  <el-select v-model="ruleForm.courseType" placeholder="请选择课程类型">
                    <el-option
                        v-for="item in courseTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="4">
                <el-form-item label="计分模式" prop="scoringModel">
                  <el-select v-model="ruleForm.scoringModel" placeholder="请选择计分模式">
                    <el-option
                        v-for="item in scoringModelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="考试模式" prop="examMode">
                  <el-select v-model="ruleForm.examMode" placeholder="请选择考试模式">
                    <el-option
                        v-for="item in examModeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="课程时数" prop="courseHours">
                  <el-input-number v-model="ruleForm.courseHours" placeholder="请选择课程时数" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="考试方式" prop="examType">
                  <el-select v-model="ruleForm.examType" placeholder="请选择考试方式">
                    <el-option
                        v-for="item in examTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授课方式" prop="teachingMethod">
                  <el-select v-model="ruleForm.teachingMethod" placeholder="请选择授课方式">
                    <el-option
                        v-for="item in teachingMethodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="" prop="percentCompleted">
                  课程学习
                  <el-input style="width: 150px;" placeholder="请输入" v-model.number="ruleForm.percentCompleted" />
                  % 总时间视为完成学习
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="4">
          <p class="uploadTitle">课程封面</p>
          <Upload ref="upload" :url="data.courseLogoUrl"/>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button @click="$emit('close')">关闭</el-button>
    </div>
  </div>
</template>

<script>
  import Upload from '@/components/ImgUpload'
  import { addCourse, updateCourse } from '../api'

  export default {
    name: 'AddCourseFrom',
    props: {
      courseTypeOptions: Array,
      scoringModelOptions: Array,
      examModeOptions: Array,
      examTypeOptions: Array,
      teachingMethodOptions: Array,
      data: {
        type: Object,
        default: () => ({})
      },
      isAdd: Boolean
    },
    components: {
      Upload
    },
    watch: {
      'data.id': {
        handler(val) {
          if (val) {
            Object.assign(this.ruleForm, this.data)
          } else {
            this.resetForm('ruleForm')
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        ruleForm: {
          courseName: '',
          courseCredit: '',
          courseNo: '',
          courseHours: '',
          // scoreProp: '',
          courseType: '',
          scoringModel: '',
          examMode: '',
          examType: '',
          teachingMethod: '',
          percentCompleted: ''
        },
        rules: {
          courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          courseNo: [
            { required: true, message: '请输入课程编号', trigger: 'blur' }
          ],
          courseCredit: [
            { required: true, message: '请输入课程学分', trigger: 'blur' }
          ],
          courseHours: [
            { required: true, message: '请输入课程时数', trigger: 'blur' }
          ],
          courseType: [
            { required: true, message: '请选择课程类型', trigger: 'change' }
          ],
          scoringModel: [
            { required: true, message: '请选择计分模式', trigger: 'change' }
          ],
          examMode: [
            { required: true, message: '请选择考试模式', trigger: 'change' }
          ],
          examType: [
            { required: true, message: '请选择考试方式', trigger: 'change' }
          ],
          teachingMethod: [
            { required: true, message: '请选择授课方式', trigger: 'change' }
          ],
          percentCompleted: [
            { required: true, message: '请输入课程学习时间', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          const uploadRes = await this.$refs.upload.upload()
          if (uploadRes.code !== 200) {
            this.$message('图片上传失败！')
            return false
          }
          if (valid) {
            const data = Object.assign({}, this.ruleForm, { courseLogoUrl: uploadRes.data })
            const responseCallback = res => {
              if (res.code === 200) {
                data.id = res.data
                this.$emit('save', data)
                this.$message.success('保存成功')
              } else {
                this.$message.error('保存失败')
              }
            }
            if (this.isAdd) {
              addCourse(data).then(responseCallback)
            } else {
              updateCourse(data).then(responseCallback)
            }
          } else {
            this.$message('请填写完整')
            return false
          }
        });
      },
      resetForm(formName) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
          this.ruleForm.id = ''
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.course-info-from {
  display: flex;
  flex-direction: column;
  .info-form {
    flex: 1;
  }
  .footer {
    margin-top: 50px;
  }
}
  .title {
    color:#333;
    font-size: 20px;
    margin: 0;
    span {
      font-size:16px;
      font-weight:500;
      color:#3F93DB;
    }
  }
  .uploadTitle {
    color:rgba(51,51,51,1);
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
</style>
