<template>
  <div class="topic-discusses">
    <el-container>
      <el-aside width="200px">
        <DiscussList v-bind="$attrs" :active-topic-id="activeTopicId" @select-discuss="selDiscuss"/>
      </el-aside>
      <el-main>
        <DiscussCont v-show="discussData.id" ref="commentCont" :discussData="discussData"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import DiscussList from './discussList'
import DiscussCont from './discussCont'

export default {
  name: 'TopicDiscusses',
  props: {
  },
  components: {
    DiscussList,
    DiscussCont
  },
  data() {
    return {
      discussData: {},
      activeTopicId: ''
    }
  },
  methods: {
    selDiscuss(topic) {
      const contRef = this.$refs['commentCont']
      if (contRef.getCurrentLoading()) {
        this.$message.warning('数据请求中，请稍后尝试!')
        return false
      }
      this.discussData = topic || {}
      this.activeTopicId = this.discussData.id
      contRef.updateComment(this.discussData.id)
    }
  }
}
</script>

<style scoped>

</style>
