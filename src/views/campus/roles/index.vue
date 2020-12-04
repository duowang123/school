<template>
  <div class="campus-role-view">
    <role :organ-type="2"></role>
  </div>
</template>

<script>
  import Role from '@/views/commonView/roles'
  export default {
    name: 'CampusRoleManage',
    components: {
      Role
    }
  }
</script>

<style scoped lang="scss">
.campus-role-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f3f5f7;
  z-index: 100;
}
</style>
