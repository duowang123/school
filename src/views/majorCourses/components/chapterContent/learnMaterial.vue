<template>
  <div>
    <div id="learnMaterial">
      <div id="learnMaterial-toolbar" class="toolbar"></div>
      <div id="learnMaterial-text" class="text"></div>
    </div>
  </div>
</template>

<script>
  import { CHAPTER_CONT_TYPE } from './constant'
  import editMixin from './editMinix';

  export default {
    name: 'LearnMaterial',
    mixins: [editMixin],
    props: {
      chapterCont: {
        type: Object
      }
    },
    data() {
      return {
        idName: '#learnMaterial',
        contKey: CHAPTER_CONT_TYPE.cailiao
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
          this.editor.txt.html(this.chapterCont[CHAPTER_CONT_TYPE.cailiao].content || '')
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
