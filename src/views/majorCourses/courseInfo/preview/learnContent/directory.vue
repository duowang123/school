<template>
  <div class="block">
    <el-tree
      :data="treeData"
      node-key="id"
      default-expand-all
      @node-click="(data) => $emit('nodeClick', data)"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'PreviewDirectory',
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'chapterName'
      }
    }
  },
  methods: {
    handleClick() {
    }
  }
}
</script>

<style scoped lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
