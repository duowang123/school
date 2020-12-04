<template>
<div class="cont_container">
  <div class="title">论文信息</div>
  <div class="thesis_box">
    <div class="box_item" v-for="(item, i) in thesisList" :key="i">
      <div class="box_item_title">{{item.label}}</div>
       <el-button v-if="item.type === 'file'" type="text" size="small">
        <a download :href="item.text">
          如何写论文.doc
        </a>
      </el-button>
      <el-input v-else-if="item.type === 'textarea'" :autosize="{ minRows: 5, maxRows: 5 }" type="textarea" :readonly="true" :rows="5" :placeholder="item.text"></el-input>
      <div v-else>{{item.text}}</div>
    </div>
  </div>
  <div class="title thesis_title">毕业信息</div>
  <div class="thesis_status">毕业审核结论：{{grudaInfo.paperStatus}}</div>
  <div class="table_box">
    <courses-table :tableConfig="tableConfig" :tableData="tableData">
    </courses-table>
  </div>
   
</div>
</template>
<script>
import * as api from '../api'
import coursesTable from '@/components/Table/coursesTable'
import mixin from '../../../mixins/download'
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
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
  mixins: [mixin],
  data() {
    return {
        thesisList: [{
          label: '论文初稿',
          text: '',
          type: 'file'
        },
        {
          label: '论文终稿',
          text: '',
          type: 'file'
        },
        {
          label: '初稿成绩',
          text: '',
          type: 'text'
        },
        {
          label: '终稿成绩',
          text: '',
          type: ''
        },
        {
          label: '初稿评语',
          text: '',
          type: 'textarea'
        },
        {
          label: '终稿评语',
          text: '',
          type: 'textarea'
        }],
        tableData: [],
        grudaInfo: {},
        tableConfig: {
          loading: false,
          headerCellStyle: { background: '#ddd', color: '#333333' },
          isHideOperation: true,
          border: true,
          columnConfig: [
            {
              label: '毕业审核项',
              prop: 'credit',
              width: '240'
            },
            {
              label: '内容',
              prop: 'content',
              width: '240',
            },
            {
              label: '审核结论',
              prop: 'result',
              width: '240'
            }
          ]
        }
    }
  },
  mounted() {
    this.getThesisInfoData()
    this.getGrudationInfoData()
  },
  methods: {
    showImg(url) {
      return `${BASE_API}/course/${url}?token=${getToken()}`
    },
    async getThesisInfoData() {
      const obj = {
        studentId: this.data.data.id
      }
      const data = await api.getThesisInfo(obj)
      this.thesisList[0].text = this.showImg(data.data.firstUrl) || ''
      this.thesisList[1].text = this.showImg(data.data.lastUrl) || ''
      this.thesisList[2].text = data.data.firstResult || ''
      this.thesisList[3].text = data.data.lastResult || ''
      this.thesisList[4].text = data.data.firstRemark || ''
      this.thesisList[5].text = data.data.lastRemark || ''

    },
    async getGrudationInfoData() {
      const obj = {
        studentId: this.data.data.id
      }
      const data = await api.getGrudationInfo(obj)
      this.grudaInfo = data.data
      this.tableData = [{
        credit: '学分审核',
        content: `选课学分：${data.data.allScore}, 获得学分：${data.data.getScore}`,
        result: data.data.creditStatus
      },
      {
        credit: '论文审核',
        content: `论文成绩： ${data.data.paperStatus ? data.data.paperStatus : '无'}`,
        result: data.data.paperStatus
      },
      {
        credit: '学费',
        content: `欠费：${data.data.oweMoney}`,
        result: data.data.moneyStatus
      },
      {
        credit: '照片',
        content: this.showImg(data.data.picture),
        result: ''
      },
      {
        credit: '毕业登记表',
        content: this.showImg(data.data.formFile),
        result: ''
      }]
    }
  }
}
</script>
<style lang="scss" scoped>
.cont_container{
  padding: 24px;
  .title{
    font-size: 16px;
    font-weight: 700;
    color: #333333;
  }
  .thesis_title{
    margin-top: 100px;
    margin-bottom: 10px;
  }
  .thesis_status{
    font-size: 18px;
    color: red;
    margin: 10px 0;
  }
  .table_box{
    width: 721px;
  }
  .thesis_box{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .box_item{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 50%;
      padding: 10px 50px 10px 0;
      .box_item_title{
        width: 120px;
        text-align: left;
      }
    }
  }
}
</style>