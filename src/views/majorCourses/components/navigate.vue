<template>
  <div class="nav">
    <div class="nav-left">
        <el-button class="add" type="primary" @click="() => $emit('add')">新增</el-button>
        <el-button class="info" v-if="isHide.schoolInfo" plain @click="() => $emit('schoolInfo')">学院信息</el-button>
        <el-button class="info" v-if="isHide.authorization" plain @click="() => $emit('authorization')">授权</el-button>
        <el-button class="info" v-if="isHide.ratio" plain @click="() => $emit('ratio')">成绩占比</el-button>
        <el-button class="info" v-if="isHide.schoolDetail" plain @click="() => $emit('school-detail')">学期信息</el-button>
    </div>
    <div class="nav-right">
        <el-select class="select" filterable :clearable="clearable" v-model="selectValue" placeholder="请选择" @change="() => $emit('select', selectValue)">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          prefix-icon="el-icon-search"
          class="search"
          :placeholder="searchPlaceholder"
          v-model="searchValue"
          @keyup.native.enter="() => $emit('search', searchValue)"
          @blur="() => $emit('search', searchValue)" />
        <el-button v-if="!!isHide.searchBtn" class="btn" icon="el-icon-search"  @click="() => $emit('searchBtn')"></el-button>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'Navigate',
      props: {
        searchPlaceholder: {
          type: String,
          default: '请输入'
        },
        selectOptions: {
          type: Array,
          default: () => []
        },
        clearable: {
          type: Boolean,
          default: false
        },
        isHide: {
          type: Object,
          default: () => ({
            schoolInfo: false,
            authorization: false,
            searchBtn: false
          })
        }
      },
      data() {
          return {
            searchValue: '',
            selectValue: ''
          }
      },
      watch: {
        selectOptions: {
          immediate: true,
          handler(val) {
            if (val && val[0]) {
              this.selectValue = val[0].value
            }
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  $color: #3F93DB;
.nav {
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .nav-left {
    .add {
      width:96px;
    }
    .info {
      color: $color;
      border-color: $color;
    }
  }
  .nav-right {
     .select {
      width: 341px;
      margin-right: 20px;
    }
    .btn {
      margin-left: 20px;
    }
    .search {
      width: 393px;
    }
  }
}
</style>
