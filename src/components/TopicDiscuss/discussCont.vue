<template>
  <div>
    <div class="comment-container" v-if="discussData.topicName">
      <div class="title">
        【主题】{{discussData.topicName}}
        <el-button class="discussBtn" type="primary" @click="discussInput = !discussInput">参与讨论</el-button>
      </div>
      <div class="explain">主题说明</div>
      <div class="desc">{{discussData.topicIntroduce}}</div>
      <div class="user-comment" v-show="commentData.length">
        <div class="comment" v-for="item in commentData" :key="item.id">
          <div class="comment-left">
            <span class="svg-container">
<!--              <svg-icon icon-class="user" />-->
              <img class="user-img" src="@/assets/images/icon-touixang-u.png" />
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
              <template v-if="item.open">
                <div class="fuifu-list" v-if="item.children.length">
                  <div class="fuifu-msg" v-for="fItem in item.children">
                    <div class="msg-cont">
                      <div class="user-avatar">
<!--                        <svg-icon icon-class="user" />-->
                        <img class="user-img" src="@/assets/images/icon-touixang-u.png" />
                      </div>
                      <span class="user-name">{{fItem.createUserName}}</span>
                      <span class="space">:</span>
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
                <template v-else>
                  <div class="fuifu-list">
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="huiFuMsg"
                        maxlength="30"
                        show-word-limit
                    />
                    <el-button class="huifu-btn" style="margin-top: 5px" type="primary" size="mini" @click="huifuHandler">回复</el-button>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageCurrent"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
      <div v-show="discussInput">
        <div class="comment-footer">
          <div class="title">参与讨论</div>
          <el-input
              class="huifu-textarea"
              type="textarea"
              placeholder="请输入内容"
              v-model="commentMsg"
              maxlength="300"
              show-word-limit
              style="height: 120px"
          />
          <el-button class="huifu-btn" style="margin: 30px 0" type="primary" size="mini" @click="commentHandler">发表</el-button>
        </div>
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
        discussInput: false,
        pageCurrent: 0,
        pageSize: 10,
        total: 0
      }
    },
    methods: {
      handleSizeChange() {
        this.updateComment
      },
      handleCurrentChange() {
        this.updateComment()
      },
      getCurrentLoading() {
        return this.loading
      },
      updateComment(topicId) {
        const id = topicId || this.discussData.id
        if (!id) return false
        const params = {
          pageCurrent: this.pageCurrent,
          pageSize: this.pageSize,
          queryContent: '',
          topicDiscussesId: id
        }
        this.loading = true
        api.getCommentList(params).then(res => {
          this.commentData = res.data.rows
          this.total = res.data.totalCount
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
            const children = this.curHuiFuParent.children || []
            children.push(addData)
            const temp = [...children]
            if (callback) {
              callback(addData)
            } else {
              this.$set(this.curHuiFuParent, 'children', temp)
            }
            this.huiFuMsg = ''
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
    .comment-footer {
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 24px;
        margin: 2px 0 16px 0;
      }
      .huifu-textarea {
        /deep/ .el-textarea__inner {
          height: 120px;
        }
      }
    }
    .title {
      position: relative;
      font-size: 16px;
      font-weight: 700;
      color: #212121;
      line-height: 24px;
      padding: 0 24px 0 6px;
      display: flex;
      justify-content: space-between;
      .discussBtn {
        position: absolute;
        right: 0;
      }
    }
    .explain {
      font-size: 14px;
      font-weight: 600;
      text-align: left;
      color: #333333;
      /*line-height: 26px;*/
      padding: 16px 0 3px 0;
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
        flex: 0 0 72px;
        text-align: left;
        padding-top: 24px;
        margin-right: 48px;
        .svg-container {
          display: inline-block;
          .user-img {
            width: 72px;
            height: 72px;
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
            color: #999999;
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
              background-color: #f5f7fa;
              transform: translateY(1px);
              border: 1px solid #d7e0e7;
              border-bottom: none;
            }
          }
          .fuifu-list {
            color: #333333;
            background: #f5f7fa;
            border: 1px solid #d7e0e7;
            font-size: 14px;
            .fuifu-msg {
              text-align: left;
              margin: 24px 20px 0 20px;
              /*height: 48px;*/
              border-bottom: 1px dashed #D7E0E7;
              .msg-cont {
                height: 48px;
                display: flex;
                margin-bottom: 24px;
                /*align-items: center;*/
                /*padding-bottom: 15px;*/
                .user-avatar {
                  width: 48px;
                  height: 48px;
                  margin-right: 16px;
                  .user-img {
                    width: 48px;
                    height: 48px;
                  }
                }
                .user-name {
                  color: #3F93DB;
                }
                .space {
                  margin-right: 12px;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }
    .pagination-container {
      margin: 38px 0;
    }
  }
</style>
