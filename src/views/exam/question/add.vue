<template >
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    destroy-on-close
    custom-class="add-question-type"
    height="700px"
    width="1200px"
  >
    <el-select
      :disabled="!isAll"
      class="organ-select"
      clearable
      filterable
      placeholder="请选择学校"
      v-model="form.organId"
    >
      <el-option
        :key="item.id"
        :label="item.name"
        :value="item.id"
        v-for="item in schoolOrgansList"
      ></el-option>
    </el-select>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" v-loading="loading">
      <el-form-item label="题目类型" required>
        <el-radio-group v-model="form.type" @change="handlerRadio()">
          <el-radio
            type="primary"
            v-for="(item,index) of typeList"
            :label="item.dictValue"
            :key="index"
          >{{item.dictName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-scrollbar style="height:650px;"> -->
      <el-row class="el-row-select">
        <el-col :span="8" v-for="(item,index) of selectList" :key="index">
          <el-form-item>
            <div>{{item.name}}</div>
            <el-select
              v-model="form[item.model]"
              @visible-change="visibleChange($event, item)"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="(e,index) in item.data"
                :key="index"
                @click.native="handlerClickOption(item)"
                :label="e.dictName"
                :value="e.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="flex-coulmn" label="题干" required>
        <div id="stem" class="toolbar"></div>
      </el-form-item>
      <el-form-item label="选项" required style="margin-top: 10px " v-if="isOptionsVisable">
        <el-button style="float: right;margin-right:10px" type="primary" @click="addOptions()">添加选项</el-button>
      </el-form-item>
      <div v-if="options.length">
        <el-form-item
          :label="String.fromCharCode(index+65)"
          style="margin-top: 10px"
          :key="index"
          class="options-toolbar"
          v-for="(item, index) in options"
        >
          <div :id="String.fromCharCode(index+65)" class="toolbar"></div>
          <i class="el-icon-delete" @click="deleteOptions(index)"></i>
        </el-form-item>
      </div>
      <el-form-item class="flex-coulmn" label="题目解析" required>
        <div id="answer" class="toolbar"></div>
      </el-form-item>
      <el-form-item class="flex-coulmn" label="分数" required>
        <el-input-number
          :min="0"
          v-model="form.score"
          :step="1"
          style="display:inline-flex"
          :disabled="form.type === '4'"
        ></el-input-number>
      </el-form-item>
      <!-- <el-form-item class="flex-coulmn" label="难度" required> -->
      <!-- <el-rate v-model="form.difficulty"></el-rate> -->
      <!-- </el-form-item> -->
      <el-form-item class="flex-coulmn" style="margin-top: 10px" label="标准答案" required>
        <answer
          :options="options"
          :answer.sync="form.answer"
          :type="form.type"
          :score.sync="form.score"
          ref="answer"
          @update-answer="updateAnswer"
        />
      </el-form-item>
      <!-- </el-scrollbar> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">提交</el-button>
      <el-button @click="resetTing">重置</el-button>
      <el-button type="primary" @click="handlerPreview()">预览</el-button>
    </span>
    <preview :form="previewInfo" :previewVisible.sync="previewVisible" v-if="previewVisible" />
  </el-dialog>
</template>
<script>
import * as api from '../api'
import Answer from './answer'
import Preview from './preview'
import selectMixin from '@/views/mixins/select.js'
export default {
  props: {
    dialogAdd: {
      type: Boolean,
      default: false,
    },
    organId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  mixins: [selectMixin],
  components: {
    Answer,
    Preview,
  },
  data() {
    return {
      typeList: [],
      selectList: [
        {
          placeholder: '请选择层次',
          name: '层次',
          key: 'code',
          model: 'level',
          code: '0015',
          data: [],
        },
        {
          placeholder: '请选择专业',
          name: '专业',
          model: 'specialtyId',
          key: 'specialtyId',
          data: [],
        },
        {
          placeholder: '请选择课程',
          name: '课程',
          model: 'courseId',
          key: 'courseId',
          data: [],
        },
      ],
      form: {
        organId: '',
        type: '1',
        level: '', // 层次
        courseId: '', // 课程id
        specialtyId: '', // 专业id
        stem: '',
        answer: '',
        score: '',
        analysis: '',
        // difficulty: null,
      },
      stemEdit: undefined,
      answerEdit: undefined,
      init: true,
      isAddOptions: false,
      options: [],
      editor: undefined,
      isOptionsVisable: true,
      loading: false,
      title: '',
      previewVisible: false,
      previewInfo: {
        title: '单选题预览',
      },
      arr: ['1', '2', '3', '4', '5'],
    }
  },
  async created() {
    this.form.organId = this.organId ? this.organId : this.schoolOrgansList[0].id
    this.init = true
    this.typeList = ((await api.listByCode({ code: '0032' })) || {}).data || []
    if (this.id) await this.handlerForm(this.id)
  },
  computed: {
    dialogVisible: {
      get() {
        return this.dialogAdd
      },
      set(val) {
        this.$emit('update:dialogAdd', val)
      },
    },
  },
  updated() {
    // 初始化富文本
    if (this.init) {
      this.title = this.id ? '修改题目' : '新增题目'
      this.createEdit('stemEdit', '#stem', 'stem')
      this.createEdit('answerEdit', '#answer', 'analysis')
      this.init = false
    }
    if (this.isAddOptions)
      this.createOptionsEdit(this.index, String.fromCharCode(this.index + 65))
  },
  methods: {
    handlerPreview() {
      this.previewInfo = JSON.parse(JSON.stringify(this.form))
      const examOption = this.options.map((item, index) => {
        return {
          [String.fromCharCode(index + 65)]: item.content,
        }
      })
      if (this.id) this.previewInfo.id = this.id
      this.previewInfo.organId = this.form.organId
      this.previewInfo.examOption = [{ ...examOption }]
      // 判断是否是多选
      if (Array.isArray(this.previewInfo.answer)) {
        this.previewInfo.answer = this.previewInfo.answer.toString()
      }
      // 判断填空
      let isfillAnswer = true
      if (this.previewInfo.type === this.arr[3]) {
        isfillAnswer = this.$refs.answer.valid()
      }
      const valid = this.checkRules(this.previewInfo)
      if (!isfillAnswer || !valid) return this.$message.warning('请填写完整!')
      // 填空赋值
      if (this.previewInfo.type === this.arr[3])
        this.previewInfo.fillAnswer = this.$refs.answer.fillAnswer
      this.previewVisible = true
    },
    // 数据重置
    resetTing() {
      for (let key in this.form) {
        if (key === 'answer' && this.form.type === this.arr[1]) {
          this.form.answer = []
          // } else if (key === 'difficulty') {
          // this.form[key] = null
        } else if (key !== 'type') {
          this.form[key] = ''
        }
      }
      // 重置富文本
      this.stemEdit.txt.html('')
      this.answerEdit.txt.html('')
      this.options = []
      this.$refs.answer.fillAnswer = []
    },
    // 编辑
    async handlerForm(id) {
      try {
        const res = await api.examEdit(id)
        const { data } = res
        const { level, specialtyId, courseId, examOption } = data
        // 层次
        if (level)
          this.handlerSelect(this.selectList[0], this.selectList[0].key)
        this.form.level = level
        // 专业
        if (specialtyId)
          this.handlerSelect(this.selectList[1], this.selectList[1].key)
        this.form.specialtyId = specialtyId
        // 课程
        if (courseId)
          this.handlerSelect(this.selectList[2], this.selectList[2].key)
        for (let key in this.form) {
          if (key === 'answer' && data.type === this.arr[1]) {
            this.form.answer = data.answer.split(',')
            // } else if (key === 'difficulty') {
            // this.form[key] = parseInt(data[key])
          } else if (key === 'score') {
            this.form[key] = data[key].toString()
          } else {
            this.form[key] = data[key]
          }
        }
        if (this.form.type === this.arr[3]) {
          this.$refs.answer.fillAnswer = data.fillAnswer || []
        }
        // 题干
        this.stemEdit.txt.html(this.form.stem)
        // 解析
        this.answerEdit.txt.html(this.form.analysis)
        // 判断是有选项
        const isOptions =
          Array.isArray(examOption) &&
          examOption[0] &&
          Object.keys(examOption[0]).length
        if (isOptions) {
          const arr = Object.values(examOption[0])
          arr.forEach((item, index) => {
            setTimeout(() => {
              this.addOptions(item[String.fromCharCode(index + 65)])
            }, 200)
          })
        }
      } catch (err) {
        console.log('err')
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    updateAnswer(data) {
      this.form.answer = data
    },
    checkRules(formCopy, valid = true) {
      for (let key in formCopy) {
        if (!formCopy[key] && key !== 'answer') return false
        if (Array.isArray(formCopy[key])) {
          if (!Object.keys([formCopy[key][0]]).length) {
            return false
          } else {
            for (let name in formCopy[key][0]) {
              const arr = Object.values(formCopy[key][0])
              for (let i = 0; i < arr.length - 1; i++) {
                for (const keyName in arr[i]) {
                  if (!arr[i][keyName]) return false
                }
              }
            }
          }
        }
      }
      // 判断是否是填空题
      if (formCopy.type !== this.arr[3] && !formCopy.answer) return false
      return true
    },
    confirm() {
      const formCopy = JSON.parse(JSON.stringify(this.form))
      const examOption = this.options.map((item, index) => {
        return {
          [String.fromCharCode(index + 65)]: item.content,
        }
      })
      if (this.id) formCopy.id = this.id
      formCopy.organId = this.form.organId
      formCopy.examOption = [{ ...examOption }]
      // 判断是否是多选
      if (Array.isArray(formCopy.answer)) {
        formCopy.answer = formCopy.answer.toString()
      }
      let isfillAnswer = true
      if (formCopy.type === this.arr[3]) {
        isfillAnswer = this.$refs.answer.valid()
      }
      const valid = this.checkRules(formCopy)
      if (!isfillAnswer || !valid) return this.$message.warning('请填写完整!')
      // 填空赋值
      if (formCopy.type === this.arr[3])
        formCopy.fillAnswer = this.$refs.answer.fillAnswer
      if (this.id) {
        api.examQuestionUpdate(formCopy).then((res) => {
          if (res.code === 200) this.$message.success('修改成功!')
        })
      } else {
        api.examQuestionSave(formCopy).then((res) => {
          if (res.code === 200) this.$message.success('新增成功!')
        })
      }
      this.$emit('updateTable')
      this.$emit('update:dialogAdd', false)
    },
    handlerRadio() {
      this.isOptionsVisable = !(
        this.form.type === this.arr[3] || this.form.type === this.arr[4]
      )
      this.resetTing()
    },
    deleteOptions(index) {
      this.options.splice(index, 1)
    },
    createOptionsEdit(index, dom) {
      const E = require('wangeditor')
      this.options[index].editor = new E(`#${dom}`)
      this.options[index].editor.customConfig.onchange = (html) => {
        this.options[index].content = html
      }
      this.options[index].editor.create()
      this.options[index].editor.txt.html(this.options[index].content)
      this.isAddOptions = false
    },
    addOptions(content) {
      if (this.options.length > 25) return
      const params = {
        editor: null,
        content,
      }
      this.options.push(params)
      this.index = this.options.length - 1
      this.isAddOptions = true
    },
    createEdit(name, dom, value) {
      const E = require('wangeditor')
      this[name] = new E(dom)
      this[name].customConfig.onchange = (html) => {
        this.form[value] = html
      }
      this[name].create()
    },
    handlerClickOption(item) {
      if (item.model === 'level') this.form.specialtyId = ''
      if (item.model !== 'courseId') this.form.courseId = ''
    },
    async visibleChange(value, item) {
      if (
        !item.data.length ||
        item.key === 'specialtyId' ||
        item.key === 'courseId'
      )
        this.handlerSelect(item, item.key)
    },
    async handlerSelect(item, value) {
      const handler = {
        code: async () => {
          const res =
            ((await api.listByCode({ code: item.code })) || {}).data || []
          item.data = res
        },
        specialtyId: async () => {
          const params = {
            organId: this.form.organId,
            level: this.form.level,
          }
          if (!this.form.level) return this.$message.warning('请先选择层次!')
          const data =
            ((await api.listByOrganIdAndLevel(params)) || {}).data || []
          if (data.length) {
            item.data = data.map((item) => {
              return {
                dictName: item.name,
                dictValue: item.id,
              }
            })
          }
        },
        courseId: async () => {
          if (!this.form.specialtyId)
            return this.$message.warning('请先选择专业!')
          const data =
            ((await api.specialtySubject(this.form.specialtyId)) || {}).data ||
            []
          item.data = data.length
            ? (item.data = data.map((item) => {
                return {
                  dictName: item.courseName,
                  dictValue: item.id,
                }
              }))
            : []
        },
      }
      handler[value]()
    },
  },
}
</script>
<style lang="scss" scoped>
.el-row-select /deep/ {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
<style lang="scss">
.add-question-type /deep/ {
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .flex-coulmn {
    display: flex;
    flex-direction: column;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .toolbar {
    margin-right: 10px;
  }
  .toolbar > .w-e-text-container {
    height: 200px !important;
  }
  .el-rate__icon {
    font-size: 30px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .options-toolbar {
    .el-form-item__content {
      margin-left: 0 !important;
      display: flex;
      flex-direction: row;
      margin-right: 10px;
      .toolbar {
        flex: 1;
        .w-e-text-container {
          height: 100px !important;
        }
      }
      i.el-icon-delete {
        line-height: 150px;
        font-size: 30px;
        color: crimson;
      }
    }
  }
}
</style>
