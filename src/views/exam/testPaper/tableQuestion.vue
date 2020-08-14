 <template>
  <el-dialog
    title="手动添加题目"
    :close-on-click-modal="false"
    append-to-body
    custom-class="custon-question"
    :visible.sync="visible"
    width="950px"
  >
    <div class="main">
      <el-row style="text-align: right;margin-bottom:20px">
        <el-select v-model="type" @change="changeType()" clearable>
          <el-option
            v-for="(item,index) in typeList"
            :label="item.dictName"
            :value="item.dictValue"
            :key="index"
          ></el-option>
        </el-select>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="445"
          ref="table"
          :row-key="rowKey"
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#F3F4F7', color: '#333333'}"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
          <el-table-column prop="typeLabel" label="题型" width="80"></el-table-column>
          <el-table-column label="题干" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ $_getSimpleText(row.stem) }}</template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" align="center"></el-table-column>
          <el-table-column prop="score" label="分数" align="center"></el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <span class="active">已选: {{multipleSelection.length}}题！</span>
        <pagination
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :currentPage="page.pageCurrent"
          :pagination-config="paginationConfig"
        />
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </span>
  </el-dialog>
</template>
 <script>
import * as api from '../api'
import pagination from '@/components/Table/pagination'
export default {
  components: {
    pagination,
  },
  props: {
    dialogQuestion: {
      type: Boolean,
      default: false,
    },
    organId: {
      type: String,
      required: true,
    },
    examPaperContents: {
      type: Array,
      required: true,
    },
  },
  computed: {
    visible: {
      get() {
        return this.dialogQuestion
      },
      set(val) {
        this.$emit('update:dialogQuestion', val)
      },
    },
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [10, 20, 30, 40],
      }
    },
  },
  data() {
    return {
      tableData: [],
      typeList: [],
      index: -1,
      multipleSelection: [],
      type: '',
      page: {
        pageCurrent: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0,
      },
    }
  },
  methods: {
    rowKey(row) {
      return row.id
    },
    clearSelect() {
      this.$refs.table.clearSelection()
    },
    setMultipleSelection(arr) {
      arr.forEach((row) => {
        this.$refs.table.toggleRowSelection(row, true)
      })
    },
    confirm() {
      const examQuests = this.multipleSelection.length
        ? this.multipleSelection.map((item) => {
            return {
              ...item,
              examQuestId: item.examQuestId || item.id,
              id: this.$_gentID(6),
            }
          })
        : []
      this.examPaperContents[this.index].examQuests = examQuests
      this.visible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changeType() {
      this.initPage()
      this.getTable()
    },
    init(index) {
      this.index = index
      this.initPage()
      this.getListByCode()
      this.getTable()
      // 清空选中值
      this.$refs.table && this.clearSelect()
      // 设置选中值
      this.$refs.table &&
        this.examPaperContents[this.index].examQuests.length &&
        this.setMultipleSelection(this.examPaperContents[this.index].examQuests)
    },
    getListByCode() {
      api.listByCode({ code: '0032' }).then((res) => {
        this.typeList = res.data
      })
    },
    getTable() {
      this.tableData = []
      const params = {
        organId: this.organId,
        type: this.type,
        ...this.page,
      }
      api.examQuestionAddlist(params).then((res) => {
        this.tableData = res.data.rows || []
        this.page.totalCount = res.data.totalCount
      })
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initPage()
      this.getTable()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.getTable()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-table__header-wrapper {
  .el-checkbox {
    visibility: hidden;
  }
}
/deep/ .custon-question /deep/ .el-dialog__body {
  padding-bottom: 0;
}
/deep/ .custon-question .el-dialog__footer {
  padding-top: 0;
}
.active {
  color: #3f93db;
  line-height: 73px;
  font-size: 14px;
}
.text {
  display: inline-block;
  width: 184px;
  overflow: hidden;
}
</style>