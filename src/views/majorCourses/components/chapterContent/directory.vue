<template>
  <div class="directory">
    <el-dialog :title="addDialogTitle" :visible.sync="dialogVisible" append-to-body width="450px" :close-on-click-modal="false">
      <el-form :model="aadMenuData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="aadMenuData.chapterName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <p class="title">
      课程目录
      <i class="el-icon-plus" @click="addMenu()"></i>
    </p>
    <el-scrollbar class="course-menu-tree">
      <el-tree
          class="tree"
          :data="treeData"
          node-key="id"
          default-expand-all
          :highlight-current="true"
          :props="defaultProps"
          :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }" @dblclick="editMenu(data)">
          <span class="chapterName" @click="selChapterCont(data)">{{ node.label }}</span>
          <span>
              <i class="tree-item el-icon-plus treeAdd" @click="addMenu(data)"></i>
              <i class="tree-item iconfont icon-delete" @click="() => remove(node, data)"></i>
          </span>
        </div>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import * as api from './api'
export default {
  name: 'Directory',
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    courseId: String,
    checkData: {
      type: Object
    },
    chapterTabs: {
      type: Object,
      default: () => ({})
    }
  },
  inject: {
    courseData: {
      default: () => ({})
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.aadMenuData.courseId = this.courseId
      }
    },
    chapterTabs: {
      handler() {
        this.tabs = Object.values(this.chapterTabs)
      },
      immediate: true
    }
  },
  data() {
    return {
      tabs: [],
      dialogVisible: false,
      addDialogTitle: '添加课程目录',

      aadMenuData: {
        chapterName: '',
        courseId: '',
        floor: '1',
        id: '',
        parentId: '',
        sort: 0
      },
      rules: {
        chapterName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      chapterData: {
        type: []
      },
      defaultProps: {
        children: 'children',
        label: 'chapterName'
      }
    }
  },
  methods: {
    submitForm(formName) {
    const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            api.addCourseMenu(this.aadMenuData).then(res => {
              if (res.code === 200) {
                if (_this.parentMenu && _this.parentMenu.children) {
                  _this.parentMenu.children.push({
                    ..._this.aadMenuData,
                    id: res.data
                  })
                } else {
                  this.$emit('update-menu')
                }
                this.dialogVisible = false
              }
            })
          } else {
            api.updateCourseMenu(this.aadMenuData).then(res => {
              if (res.code === 200) {
                this.$emit('update-menu')
                this.dialogVisible = false
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    selChapterCont(data) {
      if (data.parentId === '-1') {
        return void '一级菜单只做一个锚点'
      }
      this.$emit('change-chapter', data)
    },
    editMenu(data) {
      this.isAdd = false
      console.log(data.chapterName)
      this.aadMenuData = { ...data }
      this.$delete(this.aadMenuData, 'children')
      this.addDialogTitle = '修改目录'
      this.dialogVisible = true
    },
    addMenu(data) {
      this.isAdd = true
      this.aadMenuData = {
        chapterName: '',
        courseId: '',
        floor: '1',
        id: '',
        parentId: '',
        sort: 0
      }
      if (data) {
        this.aadMenuData.parentId = data.id
        this.parentMenu = data
      } else {
        this.parentMenu = null
      }
      this.addDialogTitle = '添加目录'
      this.dialogVisible = true
    },
    remove(node, data) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        api.deleteCourseMenu({ id: data.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.$emit('update-menu')
            children.splice(index, 1);
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .course-menu-tree {
    height: 600px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    height: 48px;
    line-height: 48px;
    .chapterName {
      flex: 1;
    }
    &.active {
      background-color: #3F93DB;
      color: #333333;
      /*.chapterName {*/
      /*  color: #3F93DB;*/
      /*}*/
    }
  }
  .title {
    font-weight:500;
    padding: 20px 0;
    margin: 0;
    border-bottom: 2px solid #F8F9FB;
  }
  .el-icon-plus {
    color: #AAB6C3;
    background-color: #E8EBEF;
    padding: 2px;
    border-radius: 2px;
    float: right;
    cursor: pointer;
  }
  .tree {
    /deep/ .treeAdd {
      float: none;
    }
    /deep/ .tree-item{
      margin-left: 10px;
    }
  }
</style>
