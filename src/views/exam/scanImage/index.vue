<template>
  <div class="drawer-container-box">
    <div class="drawer-content">
      <div class="content-container">
        <img :src="urlData" />
      </div>
    </div>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  import { BASE_API } from '@/constant/global'
  export default {
    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      isShowBtn: {
        type: Boolean,
        default: false
      }
    },
    components: {},
    computed: {
      urlData() {
        return this.data.pictureUrl
          ? `${BASE_API}/course/${this.data.pictureUrl}?token=${getToken()}`
          : ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .drawer-content {
    margin: 16px;
    img {
      width: 100%;
      min-height: 200px;
    }
  }
</style>
