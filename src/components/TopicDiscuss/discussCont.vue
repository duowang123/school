<template>
  <div>
    <div class="comment-container" v-if="discussData.topicName">
      <div class="title" >{{discussData.topicName}} <el-button @click="discussInput = !discussInput">参与讨论</el-button></div>
      <div class="explain">主题说明</div>
      <div class="desc">{{discussData.topicIntroduce}}</div>
      <div class="user-comment" v-show="commentData.length">
        <div class="comment" v-for="item in commentData" :key="item.id">
          <div class="comment-left">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <div class="user-name">{{item.createUserName}}</div>
          </div>
          <div class="comment-right">
            <div class="comment-msg">
              {{item.content}}
            </div>
            <div class="comment-footer">
              <span class="time">{{item.createDate}}</span>
              <!--              <span class="dianzan">点赞（{{item.likesNum}}）</span>-->
              <span :class="{'huifu': true, open: item.open}" @click="clickHuifu(item)">回复</span>
              <div class="fuifu-list" v-if="item.children.length && item.open">
                <div class="fuifu-msg" v-for="fItem in item.children">
                  <div class="msg-cont">
                    <span class="user-name">{{fItem.createUserName}}:  </span>
                    <span>{{fItem.content}}</span>
                  </div>
                </div>
                <div>
                  <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="huiFuMsg"
                      maxlength="30"
                      show-word-limit
                  />
                  <el-button class="huifu-btn" style="margin-top: 5px" type="primary" size="mini" @click="huifuHandler">回复</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="discussInput">
        <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="commentMsg"
            maxlength="30"
            show-word-limit
        />
        <el-button class="huifu-btn" style="margin: 15px 20px" type="primary" size="mini" @click="commentHandler">回复</el-button>
      </div>
      <div class="empty-comment" v-show="!commentData.length">
        该主题还没评论消息！
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from './api'

  export default {
    name: 'DiscussCont',
    props: {
      discussData: Object
    },
    data() {
      return {
        commentData: [],
        loading: false,
        commentMsg: '',
        huiFuMsg: '',
        curHuiFuParent: null,
        discussInput: false
      }
    },
    methods: {
      getCurrentLoading() {
        return this.loading
      },
      updateComment(topicId) {
        const id = topicId || this.discussData.id
        if (!id) return false
        const params = {
          pageCurrent: 0,
          pageSize: 100,
          queryContent: '',
          topicDiscussesId: id
        }
        this.loading = true
        api.getCommentList(params).then(res => {
          this.commentData = res.data.rows
          this.loading = false
        })
      },
      clickHuifu(item) {
        this.$set(item, 'open', !item.open)
        this.huiFuMsg = ''
        this.curHuiFuParent = item.open ? item : null
      },
      huifuHandler(data, callback) {
        const params = {
          content: data.content || this.huiFuMsg,
          parentId: data.parentId || this.curHuiFuParent.id,
          topicDiscussesId: this.discussData.id
        }
        if (!params.content) {
          this.$message.warning('请输入回复内容!')
          return false
        }
        api.addComment(params).then(res => {
          console.log(res);
          if (res.code === 200) {
            const addData = params
            addData.id = res.data
            addData.children = []
            const children = this.curHuiFuParent || []
            children.push(addData)
            const temp = [...children]
            if (callback) {
              callback(addData)
            } else {
              this.$set(this.curHuiFuParent, 'children', temp)
            }
          }
        })
      },
      commentHandler() {
        this.curHuiFuParent && this.$set(this.curHuiFuParent, 'open', false)

        const data = {
          content: this.commentMsg,
          parentId: '-1'
        }
        this.huifuHandler(data, (data) => {
          this.commentMsg = ''
          this.updateComment()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .comment-container {
    padding: 24px 15% 24px 24px;
    .title {
      font-size: 16px;
      font-weight: 700;
      color: #212121;
      line-height: 24px;
      padding: 0 24px 0 6px;
      display: flex;
      height: 40px;
      justify-content: space-between;
    }
    .explain {
      font-size: 14px;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 26px;
      padding: 6px 0 3px 0;
    }
    .desc {
      font-size: 14px;
      font-weight: 400;
      text-align: justify;
      color: #666666;
      line-height: 24px;
      width: 100%;
      padding-bottom: 24px;
      border-bottom: 2px solid #d7e0e7;
      margin-bottom: 15px;
    }
    .empty-comment {
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #666666;
      line-height: 24px;
      width: 100%;
      padding: 24px;
    }
    .comment {
      display: flex;
      flex-direction: row;
      min-height: 146px;
      border-bottom: 1px dashed #d7e0e7;
      /*align-items: center;*/
      .comment-left {
        flex: 0 0 120px;
        text-align: center;
        padding-top: 24px;
        .svg-container {
          /deep/ .svg-icon {
            width: 52px;
            height: 52px;
          }
        }
        .user-name {
          margin-top: 4px;
          color: #3F93DB;
        }
      }
      .comment-right {
        width: 100%;
        .comment-msg {
          height: 62px;
          margin-top: 20px;
          overflow-x: auto;
        }
        .comment-footer {
          text-align: right;
          min-height: 24px;
          line-height: 24px;
          padding: 12px 10px;
          color: #3F93DB;
          .time {
            margin-right: 40px;
          }
          .dianzan {
            margin-right: 22px;
          }
          .huifu {
            display: inline-block;
            width: 80px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            &.open{
              background-color: #D7E0E7;
            }
          }
          .fuifu-list {
            color: #333333;
            background-color: #D7E0E7;
            font-size: 14px;
            padding: 10px 20px;
            .fuifu-msg {
              text-align: left;
              .msg-cont {
                height: 65px;
                display: flex;
                align-items: center;
                padding-bottom: 15px;
                .user-name {
                  color: #3F93DB;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
