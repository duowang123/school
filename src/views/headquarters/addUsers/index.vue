<template>
  <div class="situation">
    <el-scrollbar style="height:100%" :noresize="true">
      <el-form :model="managerInfo" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
        <div class="basic">
          <h2 class="title">基本信息
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
        <div class="contact">
          <h2 class="title">联系人信息</h2>
          <el-tabs class="users-tab" v-model="activeIndex" :disabled="disabled" :stretch="true" @tab-click="tabsHandleClick">
            <el-tab-pane label="负责人/法人 *" name="0"></el-tab-pane>
            <el-tab-pane label="招生办负责人" name="1"></el-tab-pane>
            <el-tab-pane label="学籍教务管理员" name="2"></el-tab-pane>
            <el-tab-pane label="财务管理员" name="3"></el-tab-pane>
          </el-tabs>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">姓名<span class="required-icon">*</span></p>
                <el-form-item prop="contacts.name">
                  <el-input
                      class="form-item-input"
                      :disabled="disabled"
                      v-model="managerInfo.contacts.name"
                      placeholder="请输入姓名"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">身份证<span class="required-icon">*</span></p>
                <el-form-item prop="contacts.idCard">
                  <el-input
                      class="form-item-input"
                      :disabled="disabled"
                      v-model="managerInfo.contacts.idCard"
                      placeholder="请输入身份证"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">性别<span class="required-icon">*</span></p>
                <div class="radio-container">
                  <el-form-item prop="contacts.sex">
                    <el-radio-group v-model="managerInfo.contacts.sex" :disabled="disabled">
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
                <el-form-item prop="contacts.mobile">
                  <el-input
                      class="form-item-input"
                      :disabled="disabled"
                      v-model="managerInfo.contacts.mobile"
                      placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">电话</p>
                <el-input
                    class="form-item-input"
                    v-model="managerInfo.contacts.phone"
                    :disabled="disabled"
                    placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">微信号</p>
                <el-input
                    class="form-item-input"
                    v-model="managerInfo.contacts.weixin"
                    :disabled="disabled"
                    placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="title">证件上传</h2>
          <div class="row">
            <el-upload
                :disabled="disabled"
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-change="onFileChange"
                :auto-upload="false"
                :limit="1"
            >
              <img v-if="unitCertUrl" :src="unitCertUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div>
          <h2 class="title">其他</h2>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">辅导老师人数</p>
                <el-input
                    class="form-item-input"
                    :disabled="disabled"
                    v-model="managerInfo.teacherNum"
                    style="width: 120px"
                    placeholder="请输入内容"/>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">管理员人数</p>
                <el-input
                    class="form-item-input"
                    v-model="managerInfo.managerNum"
                    :disabled="disabled"
                    style="width: 120px"
                    placeholder="请输入内容"/>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">其他人员人数</p>
                <el-input
                    class="form-item-input"
                    v-model="managerInfo.otherNum"
                    :disabled="disabled"
                    style="width: 120px"
                    placeholder="请输入内容"/>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
  import * as api from '@/api/organ'
  import { isvalidMobile, validateIdCard } from '../../../utils/validate';
  import * as commonalityApi from '@/api/commonality'
  import { getToken } from '@/utils/auth'
  import { BASE_API } from '@/constant/global'

  export default {
    name: 'Info',
    computed: {
      unitCertUrl() {
        const { unitCertUrl } = this.managerInfo
        return unitCertUrl ? `${BASE_API}/course${unitCertUrl}?token=${getToken()}` : null
      }
    },
    data() {
      const testIdCard = (rule, val, callback) => {
        const id = this.managerInfo.contacts.idCard
        const validRes = validateIdCard(id)
        if (validRes.status === 1) {
          callback()
        } else {
          callback(new Error(validRes.msg))
        }
      }

      const testMobile = (rule, value, callback) => {
        const mobile = this.managerInfo.contacts.mobile
        const validRes = isvalidMobile(mobile)
        if (!validRes) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }

      return {
        disabled: true,
        managerInfo: { contacts: {}},
        contacts: {},
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
            { required: true, message: '请输入机构名称', trigger: 'blur' }
          ],
          'contacts.name': [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          'contacts.idCard': [
            { required: true, message: '请输入身份证', trigger: 'blur' },
            { validator: testIdCard, trigger: 'blur' }
          ],
          'contacts.mobile': [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: testMobile, trigger: 'blur' }
          ],
          'contacts.sex': [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.managerOrgan()
    },
    methods: {
      addNewContact() {
        return {
          'id': '',
          'createUserId': '',
          'updateUserId': '',
          'name': '',
          'sex': '1',
          'idCard': '',
          'mobile': '',
          'phone': '',
          'weixin': '',
          'qq': '',
          'address': '',
          'organId': '1',
          'contactType': '1'
        }
      },
      tabsHandleClick({ name }) {
        const index = name
        if (this.managerInfo.contactInfoS[index]) {
          this.managerInfo.contacts = this.managerInfo.contactInfoS[index]
        } else {
          this.managerInfo.contacts = this.managerInfo.contactInfoS[index] = this.addNewContact()
        }
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
          this.managerInfo = res.data
          this.managerInfo.contacts = res.data.contactInfoS[this.activeIndex]
        })
      },
      submitForm(callback) {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            callback()
          }
        })
      },

      beforeAvatarUpload(file) {
        return true
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      },
      //阻止upload的自己上传，进行再操作
      onFileChange(data) {
        this.uploadImg(data.raw)
        // const file = data.raw
        // const img = new Image();
        // img.onload = () => {
        //   // const w = parseInt(img.width)
        //   // const h = parseInt(img.height)
        // }
        // //创建临时的路径来展示图片
        // const windowURL = window.URL || window.webkitURL;
        // img.src = windowURL.createObjectURL(file)
        // this.src = windowURL.createObjectURL(file);
        // //重新写一个表单上传的方法
        // this.param = new FormData();
        // this.param.set('image', file, file.name);
        // this.ruleForm.image = file
        return false;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadImg(file) {
        // const file = files[0];
        const param = new FormData();
        param.append('picFile', file, file.name);
        commonalityApi.uploadPic(param).then(res => {
          if (res.code === 200) {
            this.managerInfo.unitCertUrl = res.data
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '上传图片出错，请稍后重试'
          })
        })
      },
      update() {
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
      justify-content: space-between;
    }

    .row {
      margin-top: 24px;
    }

    .contact {
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
    }

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
</style>
