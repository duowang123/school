<template >
  <div>
    <div class="name">答案与解析</div>
    <el-row :gutter="20" class="margin10" v-show="form.selectAnswer">
      <div class="grid-content margin-name">学生答题: {{ form.selectAnswer }}</div>
      <div class="grid-content margin-name">学生得分: {{ form.realScore }}</div>
    </el-row>
    <el-row
      class="margin10"
      :gutter="20"
      v-show="form.selectFillAnswer && form.selectFillAnswer.length"
    >
      <div>学生答题:</div>
      <div
        v-for="(item,index) in form.selectFillAnswer"
        :key="index"
        class="anster"
      >{{index+1}}.&nbsp;&nbsp;{{ item.content}}</div>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content text">分数: {{ form.score }}</div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content text">难度:&nbsp;&nbsp;</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content text">
          <el-rate v-model="form.difficulty" disabled class="custom-score"></el-rate>
        </div>
      </el-col>
      <el-col :span="6" v-if="form.type !== arr[4] && form.type !== arr[3]">
        <div class="grid-content text">正确答案: {{ showAnster(form.answer) }}</div>
      </el-col>
    </el-row>
    <el-row class="text" v-if="form.type === arr[3]">正确答案:</el-row>
    <el-row v-for="(item,index) in form.fillAnswer" :key="index">
      <div class="grid-content answer-text">{{index+1}}. {{ item.content }}</div>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      arr: ['1', '2', '3', '4', '5'],
    }
  },
  methods: {
    showAnster(answer) {
      return answer && answer.includes(',')
        ? answer.split(',').sort().join()
        : answer
    },
  },
}
</script>
<style lang="scss" scoped>
.name {
  height: 56px;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #212121;
  line-height: 56px;
  border-bottom: 1px solid #aab6c3;
}
.text {
  height: 64px;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  color: #3f93db;
  line-height: 64px;
}

.answer-text {
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #3f93db;
  line-height: 2;
  margin: 10px 0;
}
.custom-score {
  line-height: 84px;
  display: inline-flex;
  margin-left: -30px;
}
.custom-score /deep/ .el-rate__icon {
  font-size: 30px;
}
.margin10 {
  margin-top: 20px;
  font-size: 16px;
  margin-left: 0;
}
.anster {
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  line-height: 2;
  margin: 10px 0;
}
.margin-name {
  margin-left: 10px;
}
.margin-name {
  margin-bottom: 15px;
}
</style>