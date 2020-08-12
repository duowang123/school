<template>
  <div class="drawer-container-box">
    <div class="drawer-content">
      <div class="content-container">
        <img :src="urlData" />
      </div>
    </div>
    <div class="demo-drawer__footer">
      <el-button @click="closeDia">关闭</el-button>
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
      return this.data.changePictureUrl
        ? `${BASE_API}/course/${this.data.changePictureUrl}?token=${getToken()}`
        : ''
    }
  },
  methods: {
    closeDia() {
      this.$emit('update:dialogVisible', false)
      setTimeout(() => {
        this.$emit('update:isShowBtn', true)
      }, 300)
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