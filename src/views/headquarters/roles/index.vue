<template>
  <div class="headquarter-role-view">
    <role :organ-type="1"></role>
  </div>
</template>

<script>
  import Role from '@/views/commonView/roles'
  export default {
    name: 'HeadquartersRoleManage',
    components: {
      Role
    }
  }
</script>

<style scoped lang="scss">
.headquarter-role-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f8f9fb;
  z-index: 100;
}
</style>
