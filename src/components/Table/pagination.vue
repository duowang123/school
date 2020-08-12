<template>
  <el-pagination
    class="pagination"
    @size-change="(val) => $emit('handleSizeChange', val)"
    @current-change="(val) => $emit('handleCurrentChange', val)"
    :current-page="currentPage"
    :page-sizes="paginationConfig.pageSizes"
    :page-size="paginationConfig.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="paginationConfig.total">
  </el-pagination>
</template>

<script>
    export default {
      name: 'Pagination',
      props: {
        currentPage: {
          type: Number
        },
        paginationConfig: {
          type: Object,
          default: () => ({
            pageSizes: [10, 20, 30, 40],
            pageSize: 10,
            total: 0
          })
        }
      }
    }
</script>

