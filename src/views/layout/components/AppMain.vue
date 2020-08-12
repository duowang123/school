<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key"/>
<!--      <keep-alive :exclude="notCachedViews">-->
<!--        <router-view :key="key"/>-->
<!--      </keep-alive>-->
      <!-- or name="fade" -->
    </transition>
  </section>
</template>

<script>

export default {
  name: 'AppMain',
  computed: {
    notCachedViews() {
      return ['detail', 'no-cache']
    },
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
    this.$store.dispatch('updateOrganList')
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  34 = tagsView */
  min-height: calc(100vh - 64px);
  padding-top: 56px;
  position: relative;
  overflow: scroll;
  background-color: #f8f9fb;
}
</style>
