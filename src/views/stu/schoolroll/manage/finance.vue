<template>
  <div>
    <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
    </courses-table>
  </div>
  
</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import * as api from '../api'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    coursesTable
  },
  data() {
    return {
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#fff', color: '#333333' },
        isHideOperation: true,
        columnConfig: [
          {
            label: '总应缴/元',
            prop: 'payableMoney'
          },
          {
            label: '总减免/元',
            prop: 'saleMoney'
          },
          {
            label: '总实缴/元',
            prop: 'payMoney',
            width: '160px'
          },
          {
            label: '总退费/元',
            prop: 'returnMoney'
          },
          {
            label: '总欠费/元',
            prop: 'oweMoney',
            width: '160px'
          }
        ]
      }
    }
  },
  mounted() {
    this.getStuFinanceInfoData()
  },
  methods: {
    async getStuFinanceInfoData() {
      const params = {
        id: this.data.data.id
      }
      const res = await api.stuFinanceInfo(params)
      this.tableData.push(res.data)
    },
  }
}
</script>