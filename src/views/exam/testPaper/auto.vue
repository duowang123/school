<template >
  <el-dialog
    title="自动添加题目"
    :visible.sync="dialogVisible"
    destroy-on-close
    append-to-body
    width="465px"
    custom-class="custom-auto"
    :close-on-click-modal="false"
  >
    <el-form ref="form" label-width="80px" v-loading="loading">
      <el-form-item :label="typeList[index].dictName" v-for="(item,index) in list" :key="index">
        <el-input-number v-model="item.limit" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <span class="confirm" @click="dialogVisible = false">取消</span>
      <span class="confirm" @click="confirm()">确 定</span>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '../api'
export default {
  components: {},
  props: {
    autoVisible: {
      type: Boolean,
      default: false,
    },
    examPaperContents: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.autoVisible
      },
      set(val) {
        this.$emit('update:autoVisible', val)
      },
    },
  },
  data() {
    return {
      answer: '',
      typeList: [],
      list: [],
      loading: false,
      index: -1,
    }
  },
  methods: {
    confirm() {
      api.examQuestionAuto(this.list).then((res) => {
        const data = res.data || []
        const examQuests = data.length
          ? data.map((item) => {
              return {
                ...item,
                examQuestId: item.id,
                id: this.$_gentID(6),
              }
            })
          : []

        this.examPaperContents[this.index].examQuests = examQuests
        this.dialogVisible = false
      })
    },
    init(organId, index) {
      this.loading = true
      try {
        this.index = index
        api.listByCode({ code: '0032' }).then((res) => {
          this.typeList = res.data
          this.list = this.typeList.map((item) => {
            return {
              limit: 1,
              organId,
              type: item.dictValue,
            }
          })
        })
      } catch (err) {
        console.log(err)
        this.loading = false
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .custom-auto /deep/ .el-dialog__body {
  .el-form {
    text-align: center;
  }
  .el-input-number {
    width: 300px;
  }
}
.name {
  height: 56px;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #212121;
  line-height: 56px;
  border-bottom: 1px solid #aab6c3;
}
.confirm {
  display: inline-block;
  width: 72px;
  height: 36px;
  background: #3f93db;
  border-radius: 4px;
  color: #ffffff;
  line-height: 36px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
</style>