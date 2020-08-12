<template>
  <div class="situation">
    <el-scrollbar style="height:100%" :noresize="true">
      <el-form :model="managerInfo" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <div class="basic">
          <h2 class="title" style="justify-content: space-between">
            <span>基本信息</span>
            <el-button type="text" @click="editHandler">{{disabled ? '编辑' : '保存'}}</el-button>
          </h2>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">机构名称<span class="required-icon">*</span></p>
                <el-form-item prop="name">
                  <el-input
                      class="form-item-input"
                      :disabled="disabled"
                      v-model="managerInfo.name"
                      placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">曾用名</p>
                <el-form-item prop="oldName">
                  <el-input
                      class="form-item-input"
                      :disabled="disabled"
                      v-model="managerInfo.oldName"
                      placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">机构性质</p>
                <el-select
                    class="form-item-input"
                    v-model="managerInfo.property"
                    :disabled="disabled"
                    placeholder="请选择">
                  <el-option
                      v-for="item in propertyOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">依托单位名称</p>
                <el-input
                    class="form-item-input"
                    :disabled="disabled"
                    v-model="managerInfo.unitName"
                    placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">依托单位性质</p>
                <el-select
                    class="form-item-input"
                    v-model="managerInfo.unitProperty"
                    :disabled="disabled"
                    placeholder="请选择">
                  <el-option
                      v-for="item in unitPropertyOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="contact">
            <h2 class="title">联系人信息</h2>
            <el-tabs class="users-tab" v-model="activeIndex" :disabled="disabled" :stretch="true" @tab-click="tabsHandleClick">
              <el-tab-pane label="负责人/法人 *" name="0">
                <div class="contact-info">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名<span class="required-icon">*</span></p>
                      <el-form-item prop="contactsName">
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[0].name"
                            placeholder="请输入姓名"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证<span class="required-icon">*</span></p>
                      <el-form-item prop="contactsIdCard">
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[0].idCard"
                            placeholder="请输入身份证"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别<span class="required-icon">*</span></p>
                      <div class="radio-container">
                        <el-form-item prop="contactsSex">
                          <el-radio-group v-model="managerInfo.contactInfoS[0].sex" :disabled="disabled">
                            <el-radio class="form-item-radio" label="1">男</el-radio>
                            <el-radio class="form-item-radio" label="2">女</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">手机号码<span class="required-icon">*</span></p>
                      <el-form-item prop="contactsMobile">
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[0].mobile"
                            placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[0].phone"
                          :disabled="disabled"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[0].weixin"
                          :disabled="disabled"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="招生办负责人" name="1">
                <div class="contact-info" v-if="managerInfo.contactInfoS[1]">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名</p>
                      <el-form-item>
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[1].name"
                            @input="forceChange()"
                            placeholder="请输入姓名"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证</p>
                      <el-form-item >
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[1].idCard"
                            @input="forceChange()"
                            placeholder="请输入身份证"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别</p>
                      <div class="radio-container">
                        <el-form-item >
                          <el-radio-group v-model="managerInfo.contactInfoS[1].sex" @input="forceChange()" :disabled="disabled">
                            <el-radio class="form-item-radio" label="1">男</el-radio>
                            <el-radio class="form-item-radio" label="2">女</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">手机号码</p>
                      <el-form-item >
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[1].mobile"
                            @input="forceChange()"
                            placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[1].phone"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[1].weixin"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="学籍教务管理员" name="2">
                <div class="contact-info" v-if="managerInfo.contactInfoS[2]">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名</p>
                      <el-form-item>
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[2].name"
                            @input="forceChange()"
                            placeholder="请输入姓名"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证</p>
                      <el-form-item >
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[2].idCard"
                            @input="forceChange()"
                            placeholder="请输入身份证"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别</p>
                      <div class="radio-container">
                        <el-form-item >
                          <el-radio-group v-model="managerInfo.contactInfoS[2].sex" @input="forceChange()" :disabled="disabled">
                            <el-radio class="form-item-radio" label="1">男</el-radio>
                            <el-radio class="form-item-radio" label="2">女</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">手机号码</p>
                      <el-form-item >
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[2].mobile"
                            @input="forceChange()"
                            placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[2].phone"
                          @input="forceChange()"
                          :disabled="disabled"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[2].weixin"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="财务管理员" name="3">
                <div class="contact-info" v-if="managerInfo.contactInfoS[3]">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名</p>
                      <el-form-item>
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[3].name"
                            @input="forceChange()"
                            placeholder="请输入姓名"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证</p>
                      <el-form-item >
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[3].idCard"
                            @input="forceChange()"
                            placeholder="请输入身份证"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别</p>
                      <div class="radio-container">
                        <el-form-item >
                          <el-radio-group v-model="managerInfo.contactInfoS[3].sex" @input="forceChange()" :disabled="disabled">
                            <el-radio class="form-item-radio" label="1">男</el-radio>
                            <el-radio class="form-item-radio" label="2">女</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">手机号码</p>
                      <el-form-item >
                        <el-input
                            class="form-item-input"
                            :disabled="disabled"
                            v-model="managerInfo.contactInfoS[3].mobile"
                            @input="forceChange()"
                            placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[3].phone"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                          class="form-item-input"
                          v-model="managerInfo.contactInfoS[3].weixin"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"></el-input>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div>
          <h2 class="title">
          证件上传
          <span style="color: #8d8d8d; font-size: 14px; margin-left: 15px">( 办学许可证 / 企业单位登记证书 / 法人身份证 )</span></h2>
          <div class="row uploader-container">
            <img-list ref="imgList" :imgs="fileList" @delete-img="deleteImgHandler" :deleteable="!disabled"/>
          </div>
        </div>
        <div>
          <h2 class="title">其他</h2>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">辅导老师人数</p>
                <el-input-number
                    class="form-item-input_number"
                    :disabled="disabled"
                    v-model="managerInfo.teacherNum"
                    placeholder="请输入内容"/>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">管理员人数</p>
                <el-input-number
                    class="form-item-input_number"
                    v-model="managerInfo.managerNum"
                    :disabled="disabled"
                    placeholder="请输入内容"/>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">其他人员人数</p>
                <el-input-number
                    class="form-item-input_number"
                    v-model="managerInfo.otherNum"
                    :disabled="disabled"
                    placeholder="请输入内容"/>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import * as api from '@/api/organ'
  import { isvalidMobile, validateIdCard } from '../../../utils/validate';
  import ImgList from '@/components/ImgList'

  export default {
    name: 'Info',
    components: {
      ImgList
    },
    data() {
      const testName = (rule, val, callback) => {
        const name = this.managerInfo.contactInfoS['0'].name
        if (name) {
          callback()
        } else {
          callback(new Error('请输入'))
        }
      }
      const testSex = (rule, val, callback) => {
        const sex = this.managerInfo.contactInfoS['0'].sex
        if (sex) {
          callback()
        } else {
          callback(new Error('请选择性别'))
        }
      }
      const testIdCard = (rule, val, callback) => {
        const id = this.managerInfo.contactInfoS['0'].idCard
        const validRes = validateIdCard(id)
        if (validRes.status === 1) {
          callback()
        } else {
          callback(new Error(validRes.msg))
        }
      }

      const testMobile = (rule, value, callback) => {
        const mobile = this.managerInfo.contactInfoS['0'].mobile
        const validRes = isvalidMobile(mobile)
        if (!validRes) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }

      return {
        uploadFileList: [], // 等待上传的文件
        dialogVisible: false,
        dialogImageUrl: '',
        fileList: [],
        disabled: true,
        managerInfo: { contactInfoS: {}},
        propertyOption: [{
          value: '1',
          label: '招生'
        }, {
          value: '2',
          label: '学籍教务管理'
        }],
        unitPropertyOption: [{
          value: '1',
          label: '事业单位'
        }, {
          value: '2',
          label: '其他'
        }],
        activeIndex: '0',
        // TODO 切换联系人后，校验存在问题
        rules: {
          name: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          'contactsName': [
            { validator: testName, trigger: 'blur' }
          ],
          'contactsIdCard': [
            { validator: testIdCard, trigger: 'blur' }
          ],
          'contactsMobile': [
            { validator: testMobile, trigger: 'blur' }
          ],
          'contactsSex': [
            { validator: testSex, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.managerOrgan()
    },
    methods: {
      addNewContact(index) {
        return {
          'id': '',
          'createUserId': '',
          'updateUserId': '',
          'contactType': (index + 1) + '',
          'name': '',
          'sex': '1',
          'idCard': '',
          'mobile': '',
          'phone': '',
          'weixin': '',
          'qq': '',
          'address': '',
          'organId': '1'
        }
      },
      tabsHandleClick({ name }) {
        const index = name
        this.managerInfo.contactInfoS[index] = this.managerInfo.contactInfoS[index] || this.addNewContact(index)
      },
      editHandler() {
        if (!this.disabled) {
          this.submitForm(this.update)
        } else {
          this.disabled = false
        }
      },
      managerOrgan() {
        api.getManagerOrgan().then(res => {
          res.data.contactInfoS = res.data.contactInfoS || [{}]
          this.managerInfo = res.data
          this.fileList = this.managerInfo.unitCertUrl.split('&')
        })
      },
      submitForm(callback) {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            callback()
          }
        })
      },

      forceChange() {
        this.$forceUpdate()
      },

      async update() {
        // 上传图片
        const ret = await this.$refs.imgList.uploadImg()
        if (!ret) {
          this.$message({
            showClose: true,
            message: '图片上传失败',
            type: 'error'
          });
          return false
        }
        this.managerInfo.unitCertUrl = this.fileList.join('&')
        api.updateOrgan(this.managerInfo).then(res => {
          if (res.data === '1') {
            this.$message({
              showClose: true,
              message: '数据更新成功',
              type: 'success'
            });
            this.disabled = true
          } else {
            this.$message({
              showClose: true,
              message: '数据更新失败',
              type: 'error'
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: '数据更新失败: ' + err,
            type: 'error'
          });
        })
      },
      deleteImgHandler(dIndex) {
        this.fileList = this.fileList.filter((e, i) => i !== dIndex)
        this.managerInfo.unitCertUrl = this.managerInfo.unitCertUrl.split('&').filter((e, i) => i !== dIndex).join('&')
      }
    }
  }
</script>

<style scoped lang="scss">
  .situation {
    margin: 56px 24px 24px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 11, 30, 0.08);
    padding-left: 24px;

    /deep/ .el-form-item {
      margin-bottom: 0;
    }

    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .title {
      font-size: 18px;
      color: #333333;
      margin: 24px 24px 0 0;
      height: 26px;
      line-height: 26px;
      display: flex;
    }

    .row {
      margin-top: 24px;
    }

    .contact {
      height: 360px;
      .users-tab {
        margin-left: -25px;
        border: none;
        box-shadow: none;
        height: 48px;
        padding-right: calc(100% - 544px);
        background-color: #E6E9EC;

        /deep/ .el-tabs__item {
          width: 96px;
          height: 48px;
          line-height: 48px;
          padding: 0;

          &.is-active {
            background: rgba(255, 255, 255, 1);
            font-weight: 500;
            color: rgba(63, 147, 219, 1);
          }
        }
      }

      /deep/ .el-tabs {
        .el-tabs__content {
          height: 360px;
          width: 1200px;
          padding-left: 27px;
          .el-tab-pane {
            width: 1300px;
          }
        }
      }
    }

    .uploader-container {
      display: flex;
      .avatar-uploader {
        /deep/ .el-upload {
          border: 1px dashed #d9d9d9;
          width: 150px;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: #409EFF;
          }

          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 148px;
            height: 148px;
            line-height: 148px;
            text-align: center;
          }

          .avatar {
            width: 148px;
            height: 148px;
            display: block;
          }
        }
      }
    }
  }
</style>
