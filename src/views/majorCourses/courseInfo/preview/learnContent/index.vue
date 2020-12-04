<template>
  <preview v-bind="$attrs"></preview>
</template>

<script>
  import Preview from '../../../components/preview/learnContent/index'
  export default {
    name: 'PreviewLearnContainer',
    components: {
      Preview
    }
  }
</script>

