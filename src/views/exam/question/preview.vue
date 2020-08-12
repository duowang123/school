<template >
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="name">题目内容</div>
    <div v-html="form.stem"></div>
    <div v-if="(form.type === arr[0] || form.type === arr[2])">
      <el-radio-group v-model="answer">
        <el-radio
          v-for="(item,key, index) in form.examOption[0]"
          :key="key"
          :label="String.fromCharCode(index+65)"
        >
          <span>
            {{String.fromCharCode(index+65)}}
            <span
              style="display: inline-flex;"
              v-html="item[String.fromCharCode(index+65)]"
            ></span>
          </span>
        </el-radio>
      </el-radio-group>
    </div>
    <div v-if="arr[1] === form.type">
      <el-checkbox-group v-model="answer">
        <el-checkbox
          :label="String.fromCharCode(index+65)"
          v-for="(item,key, index) in form.examOption[0]"
          :key="index"
        >
          <span>
            {{String.fromCharCode(index+65)}}
            <span
              style="display: inline-flex;"
              v-html="item[String.fromCharCode(index+65)]"
            ></span>
          </span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <analysis :form="form" />
    <div v-html="form.analysis"></div>
  </el-dialog>
</template>
<script>
import Analysis from './analysis'
export default {
  components: {
    Analysis,
  },
  props: {
    form: {
      type: Object,
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
      title: '',
      answer: '',
    }
  },
  created() {
    this.handlerTitle()
  },
  methods: {
    handlerTitle() {
      const { type, answer } = this.form
      if (type === this.arr[0]) {
        this.title = '单选题预览'
      } else if (type === this.arr[1]) {
        // this.answer = answer.split(',')
        this.title = '多选题预览'
      } else if (type === this.arr[4]) {
        this.title = '问答题预览'
      } else if (type === this.arr[2]) {
        this.title = '判断题预览'
      } else if (type === this.arr[3]) {
        this.title = '填空题预览'
      }
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