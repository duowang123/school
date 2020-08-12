import * as api from '../api'
import tree from "element-ui/packages/table/src/store/tree";
import fa from "element-ui/src/locale/lang/fa";

export default {
  props: {
    courseId: String,
    chapterId: String
  },
  data() {
    return {
      hour: 0,
      min: 0,
      sec: 0,
      startTiming: false,
      stop: false,
      studyTimer: null,
      courseType: ''
    }
  },
  computed: {
    remainderTime() {
      const sum = this.hour + this.min + this.sec
      return sum ? `距资源学习总时间：${this.hour} 时 ${this.min} 分` : '已学完'
    },
  },
  watch: {
    remainderTime: {
      handler(val) {
        if (val === '已学完') {
          this.stopStudy()
        } else {
          this.startStudy()
        }
      },
      immediate: true
    }
  },
  methods: {
    updateTime(courseType) {
      this.courseType = courseType
      const params = {
        courseId: this.courseId,
        courseMenuId: this.chapterId,
        courseType
      }
      api.getLearnTime(params).then(res => {
        this.hour = res.data.learnTimeHour
        this.min = res.data.learnTimeMin
        this.sec = res.data.learnTimeSec
      })
    },
    startStudy() {
      if (this.startTiming) {
        return void '正在计时'
      }
      this.stop = false
      this.startTiming = true
      this.timing()
      this.updateStudyTime()
    },
    timing() {
      if (this.stop) {
        return false
      }
      console.log('sec', this.sec)
      setTimeout(() => {
        this.decMin()
        this.timing()
      }, 1000 * 60)
    },
    updateStudyTime() {
      if (this.startTiming) {
        setTimeout(() => {
          const params = {
            courseId: this.courseId,
            courseMenuId: this.chapterId,
            courseType: this.courseType,
            learnTime: this.hour * 3600 + this.min * 60 + this.sec
          }
          api.updateLearnTime(params).then(res => {
            if (res.data.status === 0) {
              this.stopStudy()
            }
          })
          this.updateStudyTime()
        }, 15 * 1000)
      }
    },
    decSec() {
      if (this.sec === 0) {
        this.sec = 59
        this.decMin()
      } else {
        this.sec -= 1
      }
    },
    decMin() {
      if (this.min === 0) {
        this.min = 59
        this.decHour()
      } else {
        this.min -= 1
      }
    },
    decHour() {
      if (this.hour !== 0) {
        this.hour -= 1
      }
    },
    stopStudy() {
      this.startTiming = false
      this.stop = true
    }
  },
}
