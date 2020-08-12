<template>
  <div class="topic-list">
    <template v-for="item in discussList">
      <div :key="item.id" class="topic-item" @click="$emit('select-discuss', item)">
        <div :class="{'topicTitle': true, 'active': activeTopicId === item.id}"><span class="status">进行中</span> {{item.topicName}}</div>
      </div>
    </template>
  </div>
</template>

<script>
  import { getTopicDiscussList } from './api'

  export default {
    name: 'DiscussList',
    props: {
      courseId: String,
      activeTopicId: [Number, String]
    },
    data() {
      return {
        discussList: [],
      }
    },
    watch: {
      courseId: {
        handler(id) {
          if (id) {
            this.getData(id)
          } else {
            this.discussList = []
          }
        },
        immediate: true
      }
    },
    methods: {
      getData(id) {
        const params = {
          courseId: id,
          pageCurrent: 0,
          pageSize: 999,
        }
        getTopicDiscussList(params).then(res => {
          this.discussList = res.data.rows
        })
      },
    },
  }
</script>

<style scoped lang="scss">
.topic-list {
  .topic-item {
    padding: 24px 24px 0 24px;
    line-height: 24px;
    cursor: pointer;
    .topicTitle {
      .status {
        width: 36px;
        height: 24px;
        font-size: 12px;
        font-weight: 400;
        text-align: left;
        color: #e58d4b;
        border: 1px solid #E58D4B;
        padding: 3px 10px;
      }
      &.active {
        color: #3F93DB;
      }
    }
  }
}

</style>
