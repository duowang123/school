<template >
  <el-dialog
    title="阅卷预览"
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
        :class="[ id === e.id ? 'active': '' ]"
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
      <el-row v-if="arr[3] === examOption.type || arr[4] === examOption.type " class="ping-fen">
        <div class="label">老师评分:</div>
        <el-input-number :min="0" :max="examOption.score" v-model="examOption.realScore"></el-input-number>
      </el-row>
      <el-row style="text-align: center;" v-if="quests.length">
        <span class="pro" @click="prev()">上一题</span>
        <span class="pro" @click="next()">下一题</span>
        <span class="pro" @click="confirm()">阅卷提交</span>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import Analysis from './analysis.vue'
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
      examOptionId: [],
      index: -1,
      examOptionLoading: false,
      id: null,
      quests: [],
    }
  },
  methods: {
    next() {
      const index = this.quests.findIndex((item) => this.id === item.id)
      const examQuestId = this.quests[index + 1]
        ? this.quests[index + 1].examQuestId
        : null
      const stemId = this.quests[index + 1] ? this.quests[index + 1].id : null
      if (examQuestId && stemId) {
        this.getExamOption(examQuestId, stemId)
      } else {
        this.$message.warning('没有下一题了!')
      }
    },
    prev() {
      const index = this.quests.findIndex((item) => this.id === item.id)
      const examQuestId = this.quests[index - 1]
        ? this.quests[index - 1].examQuestId
        : null
      const stemId = this.quests[index - 1] ? this.quests[index - 1].id : null
      if (examQuestId && stemId) {
        this.getExamOption(examQuestId, stemId)
      } else {
        this.$message.warning('没有上一题了!')
      }
    },
    flattenArray(arr, quests = []) {
      arr.forEach((item) => {
        if (item.examQuests) quests.push(...item.examQuests)
      })
      return quests
    },
    init() {
      this.id = null
      this.quests = []
      this.examOption = {}
    },
    open() {
      this.init()
      console.log(' this.examPaperContents', this.examPaperContents)
      const arr = this.examPaperContents.filter((item) => item.examQuests) || []
      if (arr.length) {
        this.quests = this.flattenArray(arr)
      }
      if (arr.length) {
        const examOption = arr[0].examQuests || []
        if (examOption.length)
          this.getExamOption(examOption[0].examQuestId, examOption[0].id)
      }
    },
    async getExamOption(id, stemId) {
      this.examOptionLoading = true
      setTimeout(() => {
        const index = this.quests.findIndex((item) => item.id === stemId)
        this.examOption = this.quests[index]
        this.id = stemId
        if (this.quests[index].difficulty)
          this.examOption.difficulty = parseInt(this.quests[index].difficulty)
        this.examOptionLoading = false
      }, 500)
    },
    handlerOptions(index, i) {
      const examQuests = this.examPaperContents[index].examQuests
      this.getExamOption(examQuests[i].examQuestId, examQuests[i].id)
    },
    confirm() {
      const teScoring = this.quests.map((item) => {
        return {
          id: item.id,
          realScore: item.realScore,
        }
      })
      this.$confirm('是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('confirm', teScoring)
      })
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
.active {
  color: #fff;
  background: rgb(63, 147, 219);
  border: 1px solid rgb(63, 147, 219);
}
.pro {
  display: inline-flex;
  color: #fff;
  background-color: #3f93db;
  border-color: #3f93db;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}
.pro + .pro {
  margin-left: 10px;
}
.label {
  margin: 10px 10px 10px 0;
  font-size: 16px;
}
.ping-fen {
  display: inline-flex;
  flex-direction: row;
  margin-bottom: 10px;
}
</style>