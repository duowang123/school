<template>
  <div class="introduction">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="formData" :label-position="'top'" label-width="80px" >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="教师名称">
                    <el-input v-model="formData.teacherName" placeholder="请选择教师名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="教师简介">
                <el-input
                    class="teacher-introduce"
                    placeholder="请选择教师简介"
                    type="textarea"
                    :autosize="{ minRows: 10, maxRows: 40}"
                    maxlength="500"
                    show-word-limit
                    v-model="formData.teacherIntroduce">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <p class="uploadTitle">教师照片</p>
              <Upload ref="upload" :url="formData.photoUrl"/>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="课程介绍">
                <div id="introduce"></div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-button class="save-btn" type="text" @click="update">保 存</el-button>
  </div>
</template>

<script>
import Upload from '@/components/ImgUpload'
import * as api from './api'
export default {
    name: 'CourseIntroduction',
    components: {
      Upload
    },
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    watch: {
      'data.course.id': {
        handler(val) {
          if (val) {
            this.getIntroduce(val)
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        formData: {
          teacherName: '',
          courseIntroduce: '',
          teacherIntroduce: '',
          photoUrl: ''
        },
        editor: null
      }
    },
    mounted() {
      this.createEdit()
    },
    methods: {
      getIntroduce(id) {
        api.getCourseIntroduce(id).then(res => {
          this.formData = res.data || {
            teacherName: '',
            teacherIntroduce: '',
            courseIntroduce: ''
          }
          this.editor && this.editor.txt.html(this.formData.courseIntroduce || '')
        })
      },
      createEdit() {
        const E = require('wangeditor')
        this.editor = new E('#introduce')
        this.editor.customConfig.onchange = (html) => {
          this.formData.courseIntroduce = html
        }
        this.editor.create()
      },
      getData() {
        return {
          photoUrl: this.$refs.upload.imageUrl,
          ...this.formData
        }
      },
      async update() {
        const { code, data } = await this.$refs.upload.upload()
        if (code === 200) {
          this.formData.photoUrl = data
          const params = {
            courseId: this.data.course.id,
            ...this.formData
          }
          api.updateCourseIntroduce(params).then(res => {
            if (res.code === 200) {
              this.$message.success('数据更新成功')
            }
          })
        } else {
          this.$message.error('图片上传失败')
        }
      }
    }
}
</script>

<style scoped lang="scss">
  .uploadTitle {
    color:rgba(51,51,51,1);
  }
  /deep/ .el-form {
    .el-form-item {
        width: 100%;
      .el-form-item__content {
          width: 100%;
        .el-input, .el-select, .el-textarea{
          width: 100%;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .introduction {
    position: relative;
    .save-btn {
      position: absolute;
      top: 0;
      right: 24px;
    }
  }
</style>
