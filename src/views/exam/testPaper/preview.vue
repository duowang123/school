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
      <span
        v-for="(e,i) in item.examQuests"
        :key="i"
        class="sort"
        @click="handlerOptions(index, i)"
      >{{ i+1 }}</span>
    </div>
    <div class="preview-box" v-loading="examOptionLoading">
      <div class="name">题目内容</div>
      <div v-html="examOption.stem"></div>
      <div v-if="(examOption.type === arr[0] || examOption.type === arr[2])">
        <el-radio-group v-model="answer">
          <el-radio
            v-for="(item,key, index) in examOption.examOption[0]"
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
      <div v-if="arr[1] === examOption.type">
        <el-checkbox-group v-model="answer">
          <el-checkbox
            :label="String.fromCharCode(index+65)"
            v-for="(item,key, index) in examOption.examOption[0]"
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
      <analysis :form="examOption" />
      <div v-html="examOption.analysis"></div>
    </div>
  </el-dialog>
</template>
<script>
import Analysis from '../question/analysis.vue'
import * as api from '../api'
export default {
  components: {
    Analysis,
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
      examOption: {},
      examOptionLoading: false,
    }
  },
  methods: {
    open() {
      const examOption = this.examPaperContents[0].examQuests || []
      // 设置第一题
      if (examOption.length) this.getExamOption(examOption[0].examQuestId)
    },
    async getExamOption(id) {
      this.examOptionLoading = true
      try {
        const res = await api.examPaperPreview(id)
      } catch (err) {
        this.examOptionLoading = false
        console.log(err)
      } finally {
        this.examOptionLoading = false
      }
    },
    handlerOptions(index, i) {
      const examQuests = this.examPaperContents[index].examQuests
      this.getExamOption(examQuests[i].examQuestId)
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
  display: block;
}
/deep/ .el-radio {
  pointer-events: none;
  display: block;
}
.sort {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin: 10px;
  cursor: pointer;
}
.sort:hover {
  color: #fff;
  background: rgb(63, 147, 219);
  border: 1px solid rgb(63, 147, 219);
}
.preview-box {
  min-height: 300px;
}
// /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label {
// color: #3F93DB
// }
</style>