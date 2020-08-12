<template>
  <div>
    <LenTime v-show="showTime" class="lenTime" ref="lenTime" :time-data="time"/>
    <component :is="componentName" :ref="componentName" :chapterCont="ChapterCont"/>
  </div>
</template>

<script>
  import LenTime from './lenTime'
  import courseGuide from './guided'
  import teachVideo from './teachVideo'
  import courseExpandResource from './expandResources'
  import courseMaterial from './learnMaterial'
  import courseTopicDiscusses from './topicDiscuss'
  export default {
    name: 'ChapterContent',
    props: {
      componentName: {
        type: String
      },
      ChapterCont: {
        type: Object,
        default: () => ({})
      },
      activeKey: String
    },
    components: {
      LenTime,
      courseGuide,
      teachVideo,
      courseExpandResource,
      courseMaterial,
      courseTopicDiscusses
    },
    computed: {
      showTime() {
        // 主题讨论没有content字段
        return this.activeKey !== 'courseTopicDiscusses'
      },
      time() {
        return this.ChapterCont[this.activeKey] || {}
      }
    },
    methods: {
      initData() {
        this.$nextTick(() => {
          // this.$refs.lenTime.initData()
          this.$refs[this.componentName].initData()
        })
      }
    }
  }
</script>

