<template >
  <div>
    <div v-if="arr[0] === type || arr[2] === type">
      <el-radio-group v-model="value" @change="$emit('update-answer',$event)">
        <el-radio
          :label="String.fromCharCode(index+65)"
          v-for="(item,index) of options"
          :key="index"
        >{{String.fromCharCode(index+65)}}</el-radio>
      </el-radio-group>
    </div>
    <div v-if="arr[1] === type">
      <el-checkbox-group v-model="value" @change="$emit('update-answer', $event)">
        <el-checkbox
          :label="String.fromCharCode(index+65)"
          v-for="(item,index) of options"
          :key="index"
        >{{String.fromCharCode(index+65)}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-if="arr[3] === type">
      <el-button @click="handlerAdd()">添加选项</el-button>
      <el-row v-for="(item,index) of fillAnswer" :key="index" style="margin-top: 10px">
        <span>{{ index+1 }}</span>
        <el-input style="width: 74%;margin-left:2%" v-model="item.content"></el-input>
        <el-input-number
          :min="0"
          :step="1"
          style="display:inline-flex;margin-left: 2%"
          v-model="item.score"
          @change="changeScore(item.score)"
        ></el-input-number>
        <i
          class="el-icon-delete"
          style="display:inline-flex;margin-left: 2%"
          @click="deleteOptions(index)"
        ></i>
      </el-row>
    </div>
    <div v-if="isAnswerEditor">
      <div id="answerEditor" class="toolbar"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    answer: {
      type: [String, Array],
      required: true,
    },
    score: {
      type: [Number],
    },
  },
  computed: {
    value: {
      get() {
        return this.answer
      },
      set(val) {
        this.$emit('update:answer', val)
      },
    },
    isAnswerEditor() {
      return this.arr[4] === this.type
    },
  },
  data() {
    return {
      arr: ['1', '2', '3', '4', '5'],
      answerEditor: null,
      fillAnswer: [],
    }
  },
  watch: {
    isAnswerEditor(val) {
      if (val) {
        setTimeout(() => {
          this.createEdit('answerEditor', '#answerEditor', 'value')
        }, 500)
      }
    },
  },
  methods: {
    changeScore(val) {
      const values = Object.values(this.fillAnswer)
      let score = 0
      values.forEach((item) => {
        score = score + item.score
      })
      this.$emit('update:score', score)
    },
    createEdit(name, dom, value) {
      const E = require('wangeditor')
      this[name] = new E(dom)
      this[name].customConfig.onchange = (html) => {
        this.value = html
      }
      this[name].create()
      this[name].txt.html(this.value)
    },
    deleteOptions(index) {
      this.fillAnswer.splice(index, 1)
    },
    handlerAdd() {
      this.fillAnswer.push({
        id: this.$_gentID(6),
        content: '',
        score: null,
      })
    },
    valid() {
      if (this.fillAnswer.length) {
        const isBool = this.fillAnswer.every(
          (item) => item.content && item.score > 0
        )
        return isBool
      } else {
        return true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .el-icon-delete {
  font-size: 18px;
  color: crimson;
}
</style>