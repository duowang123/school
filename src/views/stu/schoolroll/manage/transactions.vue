<template>
  <div>
    <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData"></courses-table>
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
  data(vm) {
    return {
      tableData: [],
      changeReasonList: [],
      changeTypList: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#fff', color: '#333333' },
        isHideOperation: true,
        columnConfig: [
          {
            label: '异动类型',
            prop: 'changeType',
            type: 'enums',
            width: '170px',
            enums: value => {
              return value
                ? vm.changeTypList.filter(item => item.dictValue === value)[0]
                    .dictName
                : '暂无'
            }
          },
          // {
          // label: '异动信息',
          // prop: 'changeNum',
          // width: '170px',
          // },
          {
            label: '异动原因',
            prop: 'changeReason',
            type: 'enums',
            width: '170px',
            enums: value => {
              return value
                ? vm.changeReasonList.filter(
                    item => item.dictValue === value
                  )[0].dictName
                : '暂无'
            }
          },
          {
            label: '申请时间',
            prop: 'approveDate',
            width: '160px'
          },
          {
            label: '审核状态',
            prop: 'approveStatus',
            type: 'enums',
            enums: value => {
              // 审核状态，1待审批，2通过，3不通过
              if (!value) {
                return '--'
              }
              if (value === '1') {
                return '待审批'
              } else if (value === '2') {
                return '通过'
              } else {
                return '不通过'
              }
            }
          }
        ]
      }
    }
  },
  async created() {
    const changeReasonData = (await api.getSysDictList({ code: '0022' })) || {}
    const changeTypeData = (await api.getSysDictList({ code: '0021' })) || {}
    this.changeReasonList = changeReasonData.data || []
    this.changeTypList = changeTypeData.data || []
  },
  mounted() {
    this.getStuChangeListData()
  },
  methods: {
    async getStuChangeListData() {
      const params = {
        id: this.data.data.id
      }
      const res = await api.getStuChangeList(params)
      this.tableData = res.data
    }
  }
}
</script>
