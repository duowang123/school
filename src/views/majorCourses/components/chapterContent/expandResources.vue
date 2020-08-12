<template>
  <div>
    <div id="expandResources">
      <div id="expandResources-toolbar" class="toolbar"></div>
      <div id="expandResources-text" class="text"></div>
    </div>
  </div>
</template>

<script>
  import { CHAPTER_CONT_TYPE } from './constant'
  import editMixin from './editMinix'
  export default {
    name: 'ExpandResources',
    mixins: [editMixin],
    props: {
      chapterCont: {
        type: Object
      }
    },
    data() {
      return {
        idName: '#expandResources',
        contKey: CHAPTER_CONT_TYPE.ziyuan
      }
    },
    watch: {
    },
    mounted() {
      this.createEdit()
    },
    methods: {
      initData() {
        if (this.editor) {
          this.editor.txt.html(this.chapterCont[CHAPTER_CONT_TYPE.ziyuan].content || '')
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .text {
    min-height: 300px;
    height: 450px;
  }
</style>
