<template>
  <div class="attrStyle">
    <div class="item" v-for="item in data.keys" :key="item.key">
      <p class="title">{{item.label}}</p>
      <p class="content">{{data.data[item.key]}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="scss">
.attrStyle {
  padding: 0 20px;
  .item {
    padding-top: 20px;
    p {
      margin: 0;
    }
  }
}
</style>
