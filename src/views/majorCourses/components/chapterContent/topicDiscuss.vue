<template>
    <el-form class="form" :label-position="'top'" label-width="80px" :model="formData">
      <el-form-item label="主题名称">
        <el-input v-model="formData.topicName" placeholder="请输入主题名称"></el-input>
      </el-form-item>
      <el-form-item label="主题说明">
        <el-input
          placeholder="请输入主题说明"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 40}"
          maxlength="500"
          show-word-limit
          v-model="formData.topicIntroduce">
        </el-input>
      </el-form-item>
    </el-form>
</template>

<script>
  import { CHAPTER_CONT_TYPE } from './constant'
  export default {
    name: 'TopicDiscuss',
    props: {
      chapterCont: {
        type: Object
      }
    },
    watch: {
      formData: {
        handler(val) {
          this.chapterCont[CHAPTER_CONT_TYPE.taolun] = val
        },
        deep: true
      }
    },
    data() {
      return {
        formData: {
          topicName: '',
          topicIntroduce: ''
        }
      }
    },
    methods: {
      initData() {
        this.formData = this.chapterCont[CHAPTER_CONT_TYPE.taolun] || {
          topicName: '',
          topicIntroduce: ''
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .form {
    margin-left: 24px;
    /deep/ .el-form-item {
        width: 100%;
        .el-form-item__label {
          color: #666666;
          font-size: 14px;
        }
        .el-form-item__content {
            width: 100%;
          .el-input {
            width: 100%;
          }
          .el-select {
            width: 100%;
          }
          .el-textarea {
            width: 100%;
          }
        }
    }
  }
</style>
