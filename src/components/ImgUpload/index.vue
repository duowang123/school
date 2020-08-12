<template>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="handleChange"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  import * as commonalityApi from '@/api/commonality'
  import { getToken } from '@/utils/auth'
  import { BASE_API } from '@/constant/global'
  export default {
    name: 'Upload',
    props: {
      url: String
    },
    data() {
      return {
        file: null,
        imageUrl: null
      };
    },
    watch: {
      url: {
        handler(val) {
          this.imageUrl = val ? `${BASE_API}/course/${val}?token=${getToken()}` : ''
        },
        immediate: true
      }
    },
    methods: {
      handleChange(file) {
        this.file = file.raw;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      async upload() {
        if (this.file) {
          const param = new FormData();
          param.append('picFile', this.file, this.file.name);
          return await commonalityApi.uploadPic(param)
        } else {
          return {
            code: 200,
            data: this.url || ''
          }
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .avatar-uploader {
    width: 183px;
    margin: 0;
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409EFF;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
