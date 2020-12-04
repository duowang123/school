<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="1">
        <el-form>
          <el-scrollbar style="height:550px;">
            <div class="main-content" style="justify-content: flex-start;">
              <div>
                <div class="flex-1">
                  试卷编号
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-input class="flex-2" v-model="form.paperNo" placeholder="请输入" />
                </el-form-item>
              </div>
              <div class="homePlace margin-left">
                <div class="flex-1">
                  试卷名称
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-input class="flex-2 lagerWidth" v-model="form.paperName" placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="main-content" style="justify-content: flex-start;">
              <div>
                <div class="flex-1">
                  学校名称
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-select @change="handlerOption('level')" class="flex-2" placeholder="请选择" v-model="form.organId">
                    <el-option
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      v-for="item in schoolOrgansList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="margin-left">
                <div class="flex-1">
                  层次
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-select @change="handlerOption('level')" class="flex-2" placeholder="请选择" v-model="form.level">
                    <el-option
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictValue"
                      v-for="(item,index) in levelList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="margin-left">
                <div class="flex-1">
                  专业
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-select
                    class="flex-2"
                    v-model="form.specialtyId"
                    @visible-change="visibleChange($event, 'specialtyId')"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item,index) in specialtyIdList"
                      @click.native="handlerOption('specialtyId')"
                      :label="item.name"
                      :value="item.id"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="main-content" style="justify-content: flex-start;">
              <div>
                <div class="flex-1">
                  课程
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-select
                    @visible-change="visibleChange($event, 'courseId')"
                    class="flex-2"
                    placeholder="请选择"
                    v-model="form.courseId"
                  >
                    <el-option
                      :key="index"
                      :label="item.courseName"
                      :value="item.id"
                      v-for="(item,index) in courseIdList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="margin-left">
                <div class="flex-1">
                  试卷类型
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-select class="flex-2" v-model="form.paperType" placeholder="请选择">
                    <el-option
                      v-for="(item,index) in paperTypeList"
                      :label="item.dictName"
                      :value="item.dictValue"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="main-content" style="justify-content: flex-start;">
              <div>
                <div class="flex-1">选项打乱</div>
                <el-form-item>
                  <el-radio-group v-model="form.isDisruption">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="main-content" style="justify-content: flex-start;">
              <div>
                <div class="flex-1">
                  建议完成时长/min
                  <span class="required-icon">*</span>
                </div>
                <el-form-item>
                  <el-input class="flex-2" v-model="form.finishTime" placeholder="请输入" />
                </el-form-item>
              </div>
            </div>
          </el-scrollbar>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="试卷内容" name="2">
        <el-form>
          <el-tabs v-model="currTabs" type="card" editable @edit="handleTabsEdit">
            <el-tab-pane
              :key="index"
              v-for="(item,index) in form.examPaperContents"
              :label="item.title || `标题${index+1}`"
              :name="`${index}`"
            >
              <el-row>
                <!-- <span class="title">标题{{index+1}}</span> -->
                <el-input v-model="item.title"></el-input>
                <span class="manual" @click="handlerManual(index)">+ 手动添加题目</span>
                <span class="auto" @click="handlerAuto(index)">+ 自动添加题目</span>
                <!-- <span class="remove" @click="deleteQuestion(index)">删除</span> -->
              </el-row>
              <el-row >
                <draggable v-model="item.examQuests">
                  <transition-group>
                    <exam-question
                      v-for="(e,i) in item.examQuests"
                      :index="i"
                      :data="e"
                      :key="i"
                      @delete-exam-question="deleteExamQuestion(item,i)"
                    />
                  </transition-group>
                </draggable>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <table-question
      ref="question"
      :examPaperContents="form.examPaperContents"
      :organId="form.organId"
      :dialogQuestion.sync="dialogQuestion"
    />
    <preview
      ref="preview"
      :examPaperContents="form.examPaperContents"
      :previewVisible.sync="previewVisible"
    />
    <auto ref="auto" :examPaperContents="form.examPaperContents" :autoVisible.sync="autoVisible" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '../api'
import tableQuestion from './tableQuestion'
import examQuestion from './examQuestion'
import Preview from './preview'
import Auto from './auto'
import draggable from 'vuedraggable'
import selectMixin from '@/views/mixins/select.js'

export default {
  components: {
    tableQuestion,
    examQuestion,
    Preview,
    Auto,
    draggable
  },
  mixins: [selectMixin],
  props: {
    data: {
      type: Object
    },
    id: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['organList'])
  },
  data() {
    return {
      previewVisible: false,
      activeName: '1',
      currTabs: '',
      paperTypeList: [],
      levelList: [],
      specialtyIdList: [],
      courseIdList: [],
      dialogQuestion: false,
      autoVisible: false,
      form: {
        courseId: '',
        finishTime: null,
        isDisruption: true,
        isEnable: true,
        paperName: '',
        level: '',
        paperNo: '',
        paperType: '',
        specialtyId: '',
        examPaperContents: []
      }
    }
  },
  created() {
    this.getListByCode()
  },
  methods: {
    open() {
      this.activeName = '1'
      this.id ? this.recoverData() : this.initData()
    },
    initData() {
      this.form = {
        courseId: '',
        finishTime: null,
        isDisruption: true,
        isEnable: true,
        paperName: '',
        level: '',
        paperNo: '',
        paperType: '',
        specialtyId: '',
        examPaperContents: []
      }
      this.specialtyIdList = []
      this.courseIdList = []
    },
    recoverData() {
      api.examPaperGet(this.id).then(async(res) => {
        Object.assign(this.form, res.data)
        const { level, specialtyId } = this.form
        if (level) {
          await this.handlerOption('level', true)
          this.form.level = res.data.level
        }
        if (specialtyId) {
          await this.handlerOption('specialtyId', true)
          this.form.specialtyId = res.data.specialtyId
        }
      })
    },
    // 预览
    preview() {
      this.$refs.preview.open()
      this.previewVisible = true
    },
    deleteExamQuestion(item, i) {
      this.$confirm('该题是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          item.examQuests.splice(i, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.addQuestion()
      } else {
        this.deleteQuestion(targetName)
      }
    },
    addQuestionParams() {
      return {
        id: this.$_gentID(6),
        title: '',
        examQuests: []
      }
    },
    deleteQuestion(index) {
      this.$confirm('当前删除整个题型，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.form.examPaperContents.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addQuestion() {
      this.form.examPaperContents.push(this.addQuestionParams())
    },
    handlerAuto(index) {
      this.autoVisible = true
      this.$refs.auto.init(this.form.organId, index)
    },
    handlerManual(index) {
      this.dialogQuestion = true
      this.$refs.question.init(index)
    },
    getListByCode() {
      api.listByCode({ code: '0033' }).then((res) => {
        this.paperTypeList = res.data
      })
      api.listByCode({ code: '0015' }).then((res) => {
        this.levelList = res.data
      })
    },
    handlerOption(type, init) {
      if (type === 'level') {
        if (!this.form.organId || !this.form.level) {
          return void ''
        }
        const params = {
          organId: this.form.organId,
          level: this.form.level
        }
        api.listByOrganIdAndLevel(params).then((res) => {
          this.specialtyIdList = res.data
          // 初始化不需要清空数据
          if (!init) {
            this.form.specialtyId = ''
            this.form.courseId = ''
          }
        })
      } else if (type === 'specialtyId') {
        api.specialtySubject(this.form.specialtyId).then((res) => {
          this.courseIdList = res.data
          // 初始化不需要清空数据
          if (!init) this.form.courseId = ''
        })
      }
    },
    visibleChange(event, type) {
      if (!event) return
      if (type === 'specialtyId') {
        if (!this.form.level) return this.$message.warning('请先选择层次!')
      } else if (type === 'courseId') {
        if (!this.form.specialtyId) { return this.$message.warning('请先选择专业!') }
      }
    },
    confirm(callback) {
      if (this.id) {
        this.form.id = this.id
        api.examPaperUpdate(this.form).then((res) => {
          if (res.code === 200) {
            this.$message.success('试卷修改成功!')
            callback(true)
          }
        })
      } else {
        api.examPaperSave(this.form).then((res) => {
          if (res.code === 200) {
            this.$message.success('试卷新增成功!')
            callback(true)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-title {
  color: #333;
  font-size: 16px;
}
.main-content {
  margin-top: 24px;
  color: #666;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  > div {
    width: 240px;
  }
  > .homePlace {
    width: 528px;

    .flex-2 /deep/ select {
      width: 140px;
    }
  }
}

.margin-left {
  margin-left: 58px;
}

.flex-1 {
  margin-bottom: 4px;
}

.flex-2 {
  height: 40px;
  line-height: 40px;
  width: 240px;
  /deep/ .el-input {
    width: 240px;
  }
  /deep/ select {
    width: 98px;
  }
  /deep/ select {
    width: 98px;
  }
  > label {
    vertical-align: middle;
  }
  &.lagerWidth {
    width: 538px;
  }
}

.address {
  display: flex;
}
.marin-bottom {
  margin-bottom: 15px;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.manual {
  color: #3f93db;
  display: inline-block;
  margin: 0 38px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
}
.auto {
  color: #67c23a;
  font-size: 16px;
  display: inline-block;
  margin-right: 38px;
  cursor: pointer;
  font-weight: 700;
}
.remove {
  color: #cf0000;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
}
.title {
  font-size: 16px;
  margin-right: 38px;
  width: 50px;
  display: inline-block;
}
.add {
  display: inline-block;
  width: 96px;
  height: 36px;
  border: 1px solid #3f93db;
  border-radius: 2px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #3f93db;
  cursor: pointer;
  line-height: 36px;
}
</style>
