<template>
  <el-select
    class="select"
    v-model="selectValue"
    filterable
    placeholder="请选择"
    @change="() => $emit('select', selectValue)">
    <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { getRootAndChildOrgan } from './api'
  export default {
    name: 'OrganSelect',
    data() {
      return {
        selectValue: '',
        selectOptions: [],
        name: ''
      }
    },
    created() {
      this.getOptions()
    },
    methods: {
      getOptions() {
        getRootAndChildOrgan({ name: this.name }).then(res => {
          const temp = res.data.list.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          })
          this.selectOptions = [...temp, ...temp, ...temp, ...temp]
          this.selectValue = (this.selectOptions[0] || {}).value
        })
      }
    }
  }
</script>

<style scoped>

</style>
