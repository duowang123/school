<template>
  <div class="attrStyle">
    <div class="item" v-for="item in data.keys" :key="item.key">
      <div class="title">{{item.label}}</div>
      <el-table v-if="item.isTable" class="table" :data="data.data[item.key]" style="width: 100%">
        <el-table-column
          type="index"
          width="80"
          label="序号"
        ></el-table-column>
        <el-table-column :prop="tableitem.prop" :label="tableitem.label" v-for="(tableitem, tableidx) in item.tableConfig" :key="tableidx">
        </el-table-column>
      </el-table>
      <div v-else class="content">
        <span v-if="item.type" v-html="data.data[item.key]"></span>
        <span v-else>{{data.data[item.key] || '--'}}</span>
        </div>
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
    .content {
      margin: 8px 0;
    }
  }
}
</style>
