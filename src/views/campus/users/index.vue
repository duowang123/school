<template>
  <div class="campus-user-manage-view">
    <user-manage :organType="2"/>
  </div>
</template>
<script>
  import UserManage from '@/views/commonView/organUserManage'
  export default {
    components: { UserManage },
    name: 'CampusUserManage'
  }
</script>

<style lang="scss" scoped>
</style>
