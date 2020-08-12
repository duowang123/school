<template >
  <div>
    <div class="stem">
      <span class="left">{{index+1}}.</span>
      <span class="center">{{ $_getSimpleText(data.stem) }}</span>
      <el-input-number v-model="data.score" class="option-right"></el-input-number>
      <i class="right remove el-icon-delete" @click="$emit('delete-exam-question')"></i>
    </div>
    <div v-if="(data.type === arr[0] || data.type === arr[2])">
      <el-radio-group v-model="answer">
        <el-radio
          v-for="(item,key, index) in data.examOption[0]"
          :key="key"
          :label="String.fromCharCode(index+65)"
        >
          <span>
            {{String.fromCharCode(index+65)}}.
            <span
              style="display: inline-flex;"
              v-html="item[String.fromCharCode(index+65)]"
            ></span>
          </span>
        </el-radio>
        <div>3333</div>
      </el-radio-group>
    </div>
    <div v-if="arr[1] === data.type">
      <el-checkbox-group v-model="answer">
        <el-checkbox
          :label="String.fromCharCode(index+65)"
          v-for="(item,key, index) in data.examOption[0]"
          :key="index"
        >
          <span>
            {{String.fromCharCode(index+65)}}.
            <span
              style="display: inline-flex;"
              v-html="item[String.fromCharCode(index+65)]"
            ></span>
          </span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      arr: ['1', '2', '3', '4', '5'],
      answer: '',
    }
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
.stem {
  position: relative;
  display: flex;
  margin: 10px 0;
  .left {
    order: -1;
    flex-basis: 20px;
  }
  .center {
    flex-grow: 1;
    text-align: left;
    /deep/ * {
      padding: 0;
      margin: 0;
    }
  }
  .right {
    flex-basis: 40px;
    color: #cf0000;
    cursor: pointer;
    line-height: 40px;
  }
}
.option-left {
  flex: 1;
}
.option-right {
  flex-basis: 180px;
  margin-right: 20px;
  /deep/ .el-input {
    width: 180px;
  }
}
.flex {
  display: flex;
}
</style>