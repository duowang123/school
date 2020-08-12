<template >
  <el-dialog
    title="试卷预览"
    :visible.sync="dialogVisible"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
  >
    <div>题目序号</div>
    <div v-for="(item,index) in examPaperContents" :key="index">
      <span>{{item.title || `标题${index+1}`}}:</span>
      <span v-for="(e,i) in item.examQuests" :key="i">{{ i }},</span>
    </div>
    <div>{{ examOption }}</div>
  </el-dialog>
</template>
<script>
// import Analysis from './analysis'
export default {
  components: {
    // Analysis,
  },
  props: {
    examPaperContents: {
      type: Array,
      required: true,
    },
    previewVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.previewVisible
      },
      set(val) {
        this.$emit('update:previewVisible', val)
      },
    },
  },
  data() {
    return {
      arr: ['1', '2', '3', '4', '5'],
      answer: '',
      examOption: [],
    }
  },
  methods: {
    open() {
      const examOption = this.examPaperContents[0].examQuests || []
      // 设置第一题
      if (examOption.length) this.examOption = examOption[0]
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0;
}
.name {
  height: 56px;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #212121;
  line-height: 56px;
  border-bottom: 1px solid #aab6c3;
}
/deep/ .el-checkbox {
  pointer-events: none;
}
/deep/ .el-radio {
  pointer-events: none;
}
// /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label {
// color: #3F93DB
// }
</style>