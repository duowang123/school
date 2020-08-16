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
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'

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
        this.editor.customConfig.pasteFilterStyle = false
        this.editor.customConfig.uploadImgServer = BASE_API + '/course/upload/pic' // 上传图片到服务器
        this.editor.customConfig.uploadImgHeaders = {
          'token': getToken()
        }
        this.editor.customConfig.dragdrop = true
        this.editor.customConfig.uploadFileName = 'picFile'
        this.editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
          },
          success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          error: function (xhr, editor) {
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },
          timeout: function (xhr, editor) {
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },

          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = `${BASE_API}/course/${result.data}`
            insertImg(url)

            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }
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
