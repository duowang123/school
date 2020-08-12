<template>
  <el-dialog
    title="高级查询"
    @close="$emit('update:dialogVisible', false)"
    :visible="dialogVisible"
    width="800px"
    modal-append-to-body
    :close-on-click-modal="false"
  >
    <div>
      <div class="main-content">
        <div class="select-box" v-for="(item, i) in searchList" :key="i">
          <div class="flex-1">{{item.name}}</div>
          <el-select
            v-model="params[item.key]"
            placeholder="请选择"
            @visible-change="visibleChange($event, item)"
          >
            <el-option v-for="(e, index) in item.data" :key="index" :label="e.name" :value="e.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="input-box">
        <div class="select-box">
          <div class="flex-1">考生号</div>
          <el-input class="flex-2" v-model="params.testNo" placeholder="请输入考生号"></el-input>
        </div>
        <div class="id-box" style="margin-left: 130px;">
          <div class="flex-1">身份证号码</div>
          <el-input class="flex-2" v-model="params.certNo" placeholder="请输入证件号码"></el-input>
        </div>
      </div>
      <div class="input-box">
        <div class="select-box">
          <div class="flex-1">姓名</div>
          <el-input class="flex-2" v-model="params.realName" placeholder="请输入姓名"></el-input>
        </div>
        <div class="select-box">
          <div class="flex-1">学号</div>
          <el-input class="flex-2" v-model="params.studentNo" placeholder="请输入学号"></el-input>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.stop="$emit('update:dialogVisible', false)">取消</el-button>
      <el-button type="primary" @click.stop="closeDia">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from '@/api/commonality'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    organId: {
      type: String
    }
  },
  // watch: {
  //   dialogVisible(val) {
  //     this.openStatus = val
  //   }
  // },
  data() {
    return {
      searchList: [
        {
          name: '招生计划',
          key: 'planId',
          data: []
        },
        {
          name: '合作单位',
          key: 'organId',
          data: []
        },
        {
          name: '学籍状态',
          key: 'studentStatus',
          code: '0029',
          data: []
        },
        {
          name: '异动原因',
          key: 'changeReason',
          code: '0022',
          data: []
        },
        {
          name: '招生层次',
          key: 'enterLevel',
          code: '0015',
          data: []
        },
        {
          name: '专业',
          key: 'enterMajor',
          data: []
        },
        {
          name: '审核状态',
          key: 'approveStatus',
          data: [
            {
              name: '待审批',
              id: '1'
            },
            {
              name: '通过',
              id: '2'
            },
            {
              name: '不通过',
              id: '3'
            }
          ]
        },
        {
          name: '报名方式',
          code: '0011',
          key: 'signType',
          data: []
        },
        {
          name: '考试方式',
          code: '0009',
          key: 'testType',
          data: []
        },
        {
          name: '注册状态',
          code: '0012',
          key: 'registerType',
          data: []
        }
      ],
      params: {
        planId: '', // 招生计划
        organId: '', // 合作单位
        studentStatus: '', // 学籍状态
        enterLevel: '', // 招生层次
        enterMajor: '', // 招生专业
        approveStatus: '', // 审核状态
        signType: '', // 报名方式
        testType: '', // 考试方式
        registerType: '', // 注册状态
        testNo: '', // 考生号
        certNo: '', // 身份证
        realName: '', /// 姓名
        studentNo: '', // 学号
        changeReason: '' // 原因
      }
      // openStatus: this.dialogVisible
    }
  },
  methods: {
    async visibleChange(value, item) {
      if (!item.data.length || item.key === 'enterMajor')
        this.handlerSelect(item, item.code ? 'code' : item.key)
    },
    async handlerSelect(item, value) {
      const handler = {
        planId: async () => {
          item.data = ((await api.listByOrganId()) || {}).data || []
        },
        organId: async () => {
          item.data = ((await api.getRootAndChildOrgan({ name: '' })) || {}).data.list || []
        },
        code: async () => {
          const res =
            ((await api.listByCode({ code: item.code })) || {}).data || []
          item.data = res.map(e => {
            return {
              ...e,
              name: e.dictName,
              value: e.dictValue,
              id: item.key === 'enterLevel' ? e.dictValue : e.id
            }
          })
        },
        enterMajor: async () => {
          const params = {
            organId: this.organId,
            level: this.params.enterLevel
          }
          if (!this.params.enterLevel)
            return this.$message.warning('请先选择招生层次!')
          item.data =
            ((await api.listByOrganIdAndLevel(params)) || {}).data || []
        }
      }
      handler[value]()
    },
    resetSearchValue() {
      this.params = {
        planId: '', // 招生计划
        organId: '', // 合作单位
        studentStatus: '', // 学籍状态
        enterLevel: '', // 招生层次
        enterMajor: '', // 招生专业
        approveStatus: '', // 审核状态
        signType: '', // 报名方式
        testType: '', // 考试方式
        registerType: '', // 注册状态
        testNo: '', // 考生号
        certNo: '', // 身份证
        realName: '',/// 姓名
        studentNo: '', // 学号
        changeReason: '' // 原因
      }
    },
    closeDia() {
      event.preventDefault()
      this.$emit('update:dialogVisible', false)
      this.$emit('closeDia', this.params, false)
      this.resetSearchValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.select-box {
  width: 33%;
  .flex-1 {
    margin: 12px 0;
  }
  .flex-2 {
    width: 203px;
  }
}
.input-box {
  display: flex;
  width: 50%;
  justify-content: space-between;
}
.id-box {
  width: 50%;
  .flex-1 {
    margin: 12px 0;
  }
  .flex-2 {
    width: 458px;
  }
}
</style>
