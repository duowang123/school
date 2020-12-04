<template>
<el-dialog title="高级查询" :close-on-click-modal="false" @close="closeDia" :visible.sync="openStatus" width="800px">
<div>
  <div class="main-content">
    <div class="select-box"  v-for="(item, i) in searchList" :key="i">
      <div class="flex-1">{{item.title}}</div>
      <el-select v-model="search[item.value]" placeholder="请选择">
        <el-option
          v-for="(e, index) in item.itemList"
          :key="index"
          :label="e.name"
          :value="e.id">
        </el-option>
      </el-select>
    </div>
  </div>
  <div class="input-box">
    <div class="select-box">
      <div class="flex-1">姓名</div>
      <el-input class="flex-2" v-model="search.name" placeholder="请输入姓名"></el-input>
    </div>
    <div class="select-box">
      <div class="flex-1">学号</div>
      <el-input class="flex-2" v-model="search.testNo" placeholder="请输入学号"></el-input>
    </div>
  </div>
  <div class="id-box">
    <div class="flex-1">证件号码</div>
    <el-input class="flex-2" v-model="search.creNo" placeholder="请输入证件号码"></el-input>
  </div>

  </div>
  <div slot="footer" class="dialog-footer">
      <el-button @click="closeDia">搜索</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { searchList } from '../mock.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dialogVisible(val) {
      this.openStatus = val
    }
  },
  data() {
    return {
      searchList,
      search: {
        name: '',
        testNo: '',
        creNo: '',
        testType: '',
        testNo: '',
        studentStatus: '',
        signType: '',
        registerType: '',
        realname: '',
        planId: '',
        enterMajor: '',
        enterLevel: '',
        approveStatus: '',
        changeReason: ''
      },
      openStatus: this.dialogVisible
    }
  },
  methods: {
    resetSearchValue() {
      this.search = {
        name: '',
        testNo: '',
        creNo: '',
        testType: '',
        testNo: '',
        studentStatus: '',
        signType: '',
        registerType: '',
        realname: '',
        planId: '',
        enterMajor: '',
        enterLevel: '',
        approveStatus: '',
        changeReason: ''
      }
    },
    closeDia() {
      this.$emit('closeDia', this.search, false)
      this.resetSearchValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.select-box{
  width: 33%;
  .flex-1{
    margin: 12px 0;
  }
  .flex-2{
    width: 203px;
  }
}
.input-box{
  display: flex;
  width: 50%;
  justify-content: space-between;
}
.id-box{
  width: 50%;
  .flex-1{
    margin: 12px 0;
  }
  .flex-2{
    width: 458px;
  }
}
</style>
