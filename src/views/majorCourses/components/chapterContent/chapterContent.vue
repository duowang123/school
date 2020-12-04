<template>
  <div v-show="componentName">
    <LenTime v-show="showTime" class="lenTime" ref="lenTime" :time-data="time"/>
    <component :is="componentName" :ref="componentName" :chapterCont="ChapterCont"/>
  </div>
</template>

<script>
  import LenTime from './lenTime'
  import courseMaterial from './courseMaterial'
  import teachVideo from './teachVideo'
  import courseTopicDiscusses from './topicDiscuss'
  export default {
    name: 'ChapterContent',
    props: {
      ChapterCont: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      LenTime,
      courseMaterial,
      teachVideo,
      courseTopicDiscusses
    },
    computed: {
      componentName() {
        return this.ChapterCont.key
      },
      showTime() {
        // 主题讨论没有content字段
        return this.componentName !== 'courseTopicDiscusses'
      },
      time() {
        return this.ChapterCont || {}
      }
    }
  }
</script>

