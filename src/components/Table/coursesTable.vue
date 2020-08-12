<template>
  <el-scrollbar :style="{height:tableHeight}" :noresize="true">
    <el-table
      ref="table"
      v-loading="tableConfig.loading"
      :data="tableData"
      class="table"
      :show-summary="!!tableConfig.showSummary"
      v-bind="tableBind"
      @selection-change="(val) => $emit('handle-selection-change', val)"
      :header-cell-style="tableConfig.headerCellStyle || {background:'#F3F4F7', color: '#333333'}"
    >
      <el-table-column v-if="!!tableConfig.selection" v-bind="tableConfig.selection"></el-table-column>
      <el-table-column v-if="!!tableConfig.serialNumber" v-bind="tableConfig.serialNumber"></el-table-column>
      <template v-for="({slot, ...item}, index) of tableConfig.columnConfig">
        <el-table-column v-bind="item" :key="index" show-overflow-tooltip>
          <template slot-scope="{ row, $index }">
            <el-button
              v-if="slot && slot.type === 'btnTxt'"
              type="text"
              size="small"
              @click="() => { $emit(slot.type, row) }"
            >{{slot.txt}}</el-button>
            <el-input
              v-else-if="slot && slot.type === 'edit' && tableConfig.edit.includes($index)"
              placeholder="请输入内容"
              v-model="row[item.prop]"
              clearable
            ></el-input>
            <span v-else-if="item.type === 'html'">{{ $_getSimpleText(row[item.prop]) }}</span>
            <span v-else-if="item.type === 'popover' ">
              <el-popover ref="popover" placement="right" trigger="hover" width="200px">
                <p class="text-popover" v-html="row[item.prop]"></p>
                <el-link slot="reference">
                  查看
                  <!-- <i class="el-icon-view el-icon--right"></i> -->
                </el-link>
              </el-popover>
            </span>
            <span
              v-else-if="item.type === 'enums'"
              :style="classObject(item.prop, row[item.prop])"
            >{{ item.enums(row[item.prop]) }}</span>
            <span v-else>{{row[item.prop]}}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        fixed="right"
        v-if="!tableConfig.isHideOperation"
        label="操作"
        :width="colWidth.opear || '200px'"
      >
        <template slot-scope="scope">
          <slot :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script>
export default {
  name: 'CoursesTable',
  props: {
    tableConfig: {
      type: Object,
      default: () => ({}),
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    colWidth: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    tableBind() {
      const tableData = {}
      if (this.tableConfig.height) {
        tableData['height'] = this.tableConfig.height
      }
      return tableData
    },
  },
  data() {
    return {
      tableHeight: '',
    }
  },
  methods: {
    classObject(key, value, obj = {}) {
      const arr = ['approveStatus', 'cfApproveStatus']
      switch (key) {
        case arr[1]:
        case arr[0]:
          if (value === '1') {
            obj.color = '#E6A23B'
          } else if (value === '2') {
            obj.color = '#67C23A'
          } else {
            obj.color = '#CF0000'
          }
          break
        default:
          break
      }
      return obj
    },
    toggleRowSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    },
  },
  mounted() {
    const { height } = this.$parent.$el.getBoundingClientRect()
    // this.tableHeight = height - 150 + 'px'
  },
}
</script>

<style scoped lang="scss">
.table {
  width: 100%;
}
</style>
// <style lang="scss">
// .text-popover {
// max-height: 400px;
// max-width: 400px;
// overflow-x: hidden;
// overflow-y: auto;
// padding: 0;
// margin: 0;
// * {
// padding: 0;
// margin: 0;
// }
// }
//
</style>
// 