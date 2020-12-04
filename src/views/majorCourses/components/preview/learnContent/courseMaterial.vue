<template>
  <div class="content">
    <div v-html="cont"></div>
  </div>
</template>

<script>
  export default {
    name: 'PreviewLearnMaterial',
    props: {
      chapterCont: {
        type: Object
      }
    },
    computed: {
      cont() {
        return this.chapterCont.content || ''
      }
    }
  }
</script>

<style scoped>

</style>
