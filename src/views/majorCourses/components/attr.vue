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
        },
    }
</script>

<style scoped lang="scss">
.attrStyle {
  padding: 12px 20px;
  .item {
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    .title {
      color: #666666;
    }
    .content {
      color: #333333;
      margin-top: 8px;
    }
  }
}
</style>
