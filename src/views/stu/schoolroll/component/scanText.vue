<template>
  <div>
    <el-drawer
      title="查看申请文件"
      :visible.sync="openStatus"
      direction="rtl"
      size="816px"
      :before-close="closeDia"
      :wrapperClosable="false"
    >
      <div class="drawer-content">
        <div class="content-container" style="margin-left: 24px">
          <img :src="urlData" alt />
        </div>
        <div class="drawer-footer">
          <el-button @click="closeDia">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    templateFile: {
      type: String,
      default: ''
    }
  },
  components: {},
  computed: {
    urlData() {
      return this.templateFile ? `${BASE_API}/course/${this.templateFile}?token=${getToken()}` : ''
    }
  },
  watch: {
    dialogVisible (val) {
      this.openStatus = val
    }
  },
  data() {
    return {
      openStatus: this.dialogVisible
    }
  },
  methods: {
    closeDia() {
      this.$emit('closeDia', {}, false)
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .content-container {
    flex: 1;
  }
  .drawer-footer {
    margin-left: 24px;
    height: 72px;
    line-height: 72px;
  }
}
</style>
