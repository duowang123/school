<template>
  <div>
    <div id="guided">
      <div id="guided-toolbar" class="toolbar"></div>
      <div id="guided-text" class="text"></div>
    </div>
  </div>
</template>

<script>
  import { CHAPTER_CONT_TYPE } from './constant'
  import editMixin from './editMinix'
  export default {
    name: 'Guided',
    mixins: [editMixin],
    props: {
      chapterCont: {
        type: Object
      }
    },
    data() {
      return {
        idName: '#guided',
        contKey: CHAPTER_CONT_TYPE.daoxue
      }
    },
    mounted() {
      this.createEdit()
    },
    methods: {
      initData() {
        if (this.editor) {
          this.editor.txt.html(this.chapterCont[CHAPTER_CONT_TYPE.daoxue].content || '')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .text {
    min-height: 300px;
    height: 450px;
  }
</style>
