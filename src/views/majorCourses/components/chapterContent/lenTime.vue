<template>
  <div class="len-time">
    <span class="edge">应学习时长</span>
    <span class="edge">
      <el-input-number controls-position="right" :min="0" :max="24" size="mini" v-model="timeData.learnTimeHour" />
      <span class="fontEdge">时</span>
    </span>
    <span class="edge">
      <el-input-number controls-position="right" :min="0" :max="59" size="mini" v-model="timeData.learnTimeMin" />
      <span class="fontEdge">分</span>
    </span>
    <span class="edge">
      <el-input-number controls-position="right" :min="0" :max="59" size="mini" v-model="timeData.learnTimeSec" />
      <span class="fontEdge">秒</span>
    </span>
  </div>
</template>

<script>
    export default {
      name: 'LenTime',
      props: {
        timeData: {
          type: Object,
          default: () => ({
            learnTimeSec: 0,
            learnTimeMin: 0,
            learnTimeHour: 0
          })
        }
      },
    }
</script>

<style scoped lang="scss">
.len-time {
  margin: 24px 16px;
  color: #333333;
  font-size: 14px;
  .fontEdge {
    margin-left: 20px;
  }
}
</style>
