<template>
  <div class="content">
    <div v-html="cont"></div>
  </div>
</template>

<script>
import { CHAPTER_CONT_TYPE } from './constant'
import mixin from './mixin'

export default {
  name: 'PreviewGuided',
  props: {
    chapterCont: {
      type: Object
    }
  },
  computed: {
    cont() {
      return this.$_getValue(this.chapterCont, `${CHAPTER_CONT_TYPE.daoxue}.content`)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
