<template>
  <div class="img-container">
    <div class="img-item" v-for="(url, index) in list" :key="index">
      <img width="148px" height="148px" :src="url">
      <div class="upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click="previewHandler(url)"><i class="el-icon-zoom-in"></i></span>
        <span v-if="deleteable" class="el-upload-list__item-preview" @click="deleteHandler(index)"><i class="el-icon-delete"></i></span>
      </div>
    </div>
    <el-upload
        :disabled="!deleteable"
        ref="upload"
        class="avatar-uploader"
        action="http://106.52.50.102/admin/apis/course/upload/pic"
        :show-file-list="true"
        :before-upload="beforeAvatarUpload"
        :on-change="onFileChange"
        :on-preview="previewHandler"
        :on-remove="handleRemove"
        list-type="picture-card"
        :auto-upload="false"
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
  import axios from 'axios'
  export default {
    name: 'ImgList',
    props: {
      imgs: {
        type: Array,
        required: true
      },
      deleteable: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      list() {
        return this.imgs.map(e => `${BASE_API}/course${e}`)
      }
    },
    data() {
      return {
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
      deleteHandler(index) {
        this.$emit('delete-img', index)
      },
      //阻止upload的自己上传，进行再操作
      onFileChange(data) {
        this.uploadFileList.push(data.raw)
        return false;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        this.uploadFileList = this.uploadFileList.filter(f => f !== file.raw)
      },
      beforeAvatarUpload(file) {
        return false
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
        const files = this.uploadFileList
        if (!files.length) {
          return true
        }
        const params = []
        files.forEach((file, i) => {
          const param = new FormData();
          param.append('picFile', file, file.name);
          params.push(param)
        })
        let result = true
        await axios.all(params.map(p => commonalityApi.uploadPic(p))).then(axios.spread((...args) => {
          args.forEach(res => {
            if (res.code === 200) {
              this.imgs.push(res.data)
              this.$refs.upload.clearFiles()
            } else {
              result = false
              this.$message({
                type: 'error',
                message: '上传图片出错，请稍后重试'
              })
            }
          })
        })).catch(() => {
          result = false
        })
        return result
      }
    }
  }
</script>

<style scoped lang="scss">
.img-container {
  display: flex;
  .img-item {
    margin-right: 20px;
    position: relative;
    overflow: hidden;
    .upload-list__item-actions {
      transform: translateY(-100%);
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      font-size: 20px;
      background-color: rgba(0,0,0,.5);
      transition: opacity .3s;
      z-index: 100;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-upload-list__item-preview {
        margin-left: 15px;
        cursor: pointer;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    &:hover {
      .upload-list__item-actions{
        transform: translateY(0);
      }
    }
  }
}
</style>
