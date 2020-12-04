<template>
  <div>
    <div id="courseMaterial">
      <div id="courseMaterial-toolbar" class="toolbar"></div>
      <div id="courseMaterial-text" class="text"></div>
    </div>
  </div>
</template>

<script>
  import editMixin from './editMinix'
  export default {
    name: 'CourseMaterial',
    mixins: [editMixin],
    data() {
      return {
        idName: '#courseMaterial'
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
