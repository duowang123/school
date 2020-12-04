<template>
  <div class="app-main-container">
    <section class="app-main" ref="appMain">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key"/>
        <!--      <keep-alive :exclude="notCachedViews">-->
        <!--        <router-view :key="key"/>-->
        <!--      </keep-alive>-->
        <!-- or name="fade" -->
      </transition>
    </section>
  </div>

</template>

<script>

export default {
  name: 'AppMain',
  provide() {
    return {
      appMainStyle: this.appMainStyle
    }
  },
  computed: {
    notCachedViews() {
      return ['detail', 'no-cache']
    },
    key() {
      return this.$route.fullPath
    }
  },
  data() {
    return {
      appMainStyle: {
        height: ''
      },
      appMainHeight: ''
    }
  },
  mounted() {
    this.$store.dispatch('updateOrganList')
    const { height } = this.$refs.appMain.getBoundingClientRect()
    this.appMainStyle.height = height
  }
}
</script>

<style scoped>
.app-main-container {
  position: fixed;
  top: 64px;
  left: 210px;
  right: 0;
  bottom: 0;
  background-color: #f3f5f7;
}
.app-main {
  /*50 = navbar  34 = tagsView */
  height: calc(100vh - 128px);
  /*height: 100%;*/
  margin-top: 64px;
  position: relative;
  background-color: #f3f5f7;
}
</style>
