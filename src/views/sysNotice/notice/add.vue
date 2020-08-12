<template>
  <div class="application attrStyle">
    <el-form :rules="rules" :model="ruleForm" ref="addForm" label-width="0">
      <el-form-item label="公告标题" prop="title" class="full-width">
        <el-input v-model="ruleForm.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="公告正文" prop="content" class="full-width">
        <div id="notice" class="toolbar"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '../api'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      ruleForm: {
        title: '',
        content: '',
      },
      editor: null,
      rules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.createEdit()
    for (let key in this.ruleForm) {
      this.ruleForm[key] = this.data[key] || ''
    }
    this.editor && this.editor.txt.html(this.ruleForm.content || '')
  },
  methods: {
    createEdit() {
      const E = require('wangeditor')
      this.editor = new E('#notice')
      this.editor.customConfig.onchange = (html) => {
        this.ruleForm.content = html
      }
      this.editor.create()
    },
    confirm(callBack) {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          if (!Object.keys(this.data).length) {
            await api.sysSave(this.ruleForm).then((res) => {
              if (res.code === 200) {
                this.$message.success('新增成功!')
              } else {
                this.$message.warning('新增失败!')
              }
            })
          } else {
            this.ruleForm.id = this.data.id
            await api.sysUpdate(this.ruleForm).then((res) => {
              if (res.code === 200) {
                this.$message.success('编辑成功!')
              } else {
                this.$message.warning('编辑失败!')
              }
            })
          }
          callBack(valid)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.attrStyle {
  padding: 0 20px;
  margin-bottom: 20px;
  .item {
    padding-top: 20px;
    p {
      margin: 0;
    }
  }
}
.application /deep/ {
  .el-form-item {
    display: flex;
    flex-direction: column;
  }
  .el-form-item__label {
    width: auto !important;
    text-align: left;
  }
}
.select-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stu-info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  height: 88px;
  padding: 16px;
  margin-top: 24px;
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #666666;
    margin-bottom: 8px;
  }
  .cont {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
  }
}
/deep/ .el-form-item__label {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
}
.title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
  margin-bottom: 8px;
}
.toolbar /deep/ .w-e-text-container {
  height: 440px !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
}
</style>
