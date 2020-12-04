<template>
  <div class="img-container">
    <!--    <div class="img-item" v-for="(url, index) in list" :key="index">-->
    <!--      <img width="148px" height="148px" :src="url">-->
    <!--      <div class="upload-list__item-actions">-->
    <!--        <span class="el-upload-list__item-preview" @click="previewHandler(url)"><i class="el-icon-zoom-in"></i></span>-->
    <!--        <span v-if="deleteable" class="el-upload-list__item-preview" @click="deleteHandler(index)"><i class="el-icon-delete"></i></span>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-upload
        :disabled="!disabled"
        ref="upload"
        :class="{'avatar-uploader':true,'disUploadBtn':!disabled}"
        :action="uploadUrl"
        :show-file-list="true"
        :with-credentials="true"
        :headers="headers"
        name="picFile"
        :on-success="onSuccess"
        :before-upload="beforeAvatarUpload"
        :on-preview="previewHandler"
        :on-remove="handleRemove"
        list-type="picture-card"
        :auto-upload="true"
        :file-list="fileList"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"  append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { BASE_API } from '@/constant/global'
  import * as commonalityApi from '@/api/commonality'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'
  export default {
    name: 'ImgList',
    props: {
      imgs: {
        type: Array,
        required: true
      },
      disabled: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      fileList() {
        return this.imgs.map((e, i) => ({ url: `${BASE_API}/course${e}` }))
      }
    },
    data() {
      return {
        uploadUrl: BASE_API + '/course/upload/pic',
        list: [...this.imgs],
        headers: {
          token: getToken()
        },
        dialogVisible: false,
        dialogImageUrl: '',
        uploadFileList: [] // 登录上传的图片
      }
    },
    methods: {
      previewHandler(url) {
        this.dialogVisible = true
        this.dialogImageUrl = typeof url === 'object' ? url.url : url
      },
      // deleteHandler(index) {
      //   this.$emit('delete-img', index)
      // },
      onSuccess(res, file, fileList) {
        if (res.code === 200) {
          this.list.push(res.data)
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
        this.list = this.list.filter(u => {
          return !file.url.includes(u)
        })
        return false
      },
      beforeAvatarUpload(file) {
        // return false
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      },
      async uploadImg() {
        return this.list
        // const files = this.uploadFileList
        // if (!files.length) {
        //   return true
        // }
        // debugger
        // const params = []
        // files.forEach((file, i) => {
        //   const param = new FormData();
        //   param.append('picFile', file, file.name);
        //   params.push(param)
        // })
        // let result = true
        // await axios.all(params.map(p => commonalityApi.uploadPic(p))).then(axios.spread((...args) => {
        //   args.forEach(res => {
        //     if (res.code === 200) {
        //       this.imgs.push(res.data)
        //       this.uploadFileList = []
        //       // clear && this.$refs.upload.clearFiles()
        //     } else {
        //       result = false
        //       this.$message({
        //         type: 'error',
        //         message: '上传图片出错，请稍后重试'
        //       })
        //     }
        //   })
        // })).catch(() => {
        //   result = false
        // })
        // return result
      },
      clearFiles() {
        this.$refs.upload.clearFiles()
      }
    }
  }
</script>

<style scoped lang="scss">
  .disUploadBtn {
    /deep/ .el-upload--picture-card{
      display:none;   /* 上传按钮隐藏 */
    }
  }
</style>
