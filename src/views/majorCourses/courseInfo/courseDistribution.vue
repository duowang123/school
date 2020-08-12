<template>
  <div class="courseDistributionBox">
    <div class="select">
      <el-select v-model="organId" @change="organChange" placeholder="请选择机构">
        <el-option
            v-for="item in data.allOrgan"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-transfer
      :titles="['未选课程', '已选课程']"
      v-model="selCourse"
      :data="courseData">
    </el-transfer>
  </div>
</template>

<script>
  import { getCourseByOrganId, bindCourseToOrgan, getAuthList } from '../api'

    export default {
      name: 'CourseDistribution',
      props: {
        data: {
          type: Object,
          default: () => ({})
        }
      },
      data() {
        return {
          courseData: [],
          selCourse: [],
          organId: ''
        };
      },
      watch: {
        'data': {
          handler() {
            // this.courseData = this.generateData(this.data.allCourse)
            this.organId = this.data.allOrgan[0].value
            this.organChange()
          },
          immediate: true
        }
      },
      methods: {
        generateData(course = []) {
          return course.map(e => {
            return {
              label: e.courseName,
              key: e.id,
              value: e.id,
              disable: false
            }
          })
        },
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        },
        organChange() {
          getAuthList({
            organId: this.organId,
            pageCurrent: 0,
            pageSize: 999
          }).then(res => {
            this.courseData = [...this.generateData(res.data.rows)]
          })
          getCourseByOrganId(this.organId).then(res => {
            this.selCourse = res.data.map(e => e.id)
          })
        },
        confirm() {
          const params = {
            organId: this.organId,
            courseIds: this.selCourse
          }
          bindCourseToOrgan(params).then(res => {
            if (res.code === 200) {
              this.$message.success('绑定成功')
              this.$emit('update', this.organId)
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss">
.courseDistributionBox {
  padding: 0 20px;
  h5, p{
    margin: 0;
  }
  h5, p {
    margin-bottom: 10px;
  }
  .select {
    margin-bottom: 15px;
  }
}
</style>
