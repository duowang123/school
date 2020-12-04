PreviewTopicDiscuss
<template>
  <div class="content">
<!--    <div class="topic-name">{{cont.topicName}}</div>-->
<!--    <div class="topic-cont">{{cont.topicIntroduce}}</div>-->
    <discuss-cont ref="cont" :discussData="cont"/>
  </div>
</template>

<script>
  import DiscussCont from '@/components/TopicDiscuss/discussCont'

  export default {
    name: 'TopicDiscuss',
    components: {
      DiscussCont
    },
    props: {
      chapterCont: {
        type: Object
      }
    },
    watch: {
      'cont.id': {
        handler(id) {
          this.$nextTick(() => {
            this.$refs.cont && this.$refs.cont.updateComment(id)
          })
        },
        immediate: true
      }
    },
    computed: {
      cont() {
        return this.chapterCont
      }
    }
  }
</script>

<style scope lang="scss">
  .content {
    margin-top: 24px;
    font-size: 14px;
    color: #666666;
    line-height: 24px;
  }
</style>
