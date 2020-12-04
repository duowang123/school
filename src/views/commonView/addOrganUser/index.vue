<template>
  <el-scrollbar style="height:100%" :noresize="true">
    <el-form :model="user" :rules="rules" ref="ruleForm" label-width="0" class="ruleForm">
      <div class="basic">
        <div class="row">
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">
                机构名称
                <span class="required-icon">*</span>
              </p>
              <el-form-item prop="organId">
                <el-select
                  class="form-item-input"
                  v-model="user.organId"
                  placeholder="请选择"
                  :disabled="organType === 1"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in showList()"
                    :key="item.id"
                    @click.native="changeUser(item)"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48" v-if="organType === 2">
            <div class="container">
              <p class="label">
                机构性质
                <span class="required-icon">*</span>
              </p>
              <el-form-item prop="property">
                <el-select
                  class="form-item-input"
                  v-model="user.property"
                  placeholder="请选择"
                  disabled
                  clearable
                >
                  <el-option label="学校" value="1"></el-option>
                  <el-option label="教学点" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">
                姓名
                <span class="required-icon">*</span>
              </p>
              <el-form-item prop="realName">
                <el-input class="form-item-input" v-model="user.realName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">
                性别
                <span class="required-icon">*</span>
              </p>
              <div class="radio-container">
                <el-form-item prop="contacts.sex">
                  <el-radio-group v-model="user.sex">
                    <el-radio class="form-item-radio" label="1">男</el-radio>
                    <el-radio class="form-item-radio" label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">
                用户名
                <span class="required-icon">*</span>
              </p>
              <el-form-item prop="userName">
                <el-input
                  class="form-item-input"
                  :disabled="!isAdd "
                  v-model="user.userName"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">
                角色
                <span class="required-icon">*</span>
              </p>
              <el-select class="form-item-input" v-model="user.roleId" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOption"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">职称</p>
              <el-select class="form-item-input" v-model="user.title" placeholder="请选择">
                <el-option
                  v-for="item in titleOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">职务</p>
              <el-select class="form-item-input" v-model="user.job" placeholder="请选择">
                <el-option
                  v-for="item in jobOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">学历</p>
              <el-select class="form-item-input" v-model="user.record" placeholder="请选择">
                <el-option
                  v-for="item in recordOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">毕业院校</p>
              <el-form-item prop="contacts.mobile">
                <el-input class="form-item-input" v-model="user.university" placeholder="请输入毕业院校"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">
                联系电话(手机)
                <span class="required-icon">*</span>
              </p>
              <el-form-item prop="mobile">
                <el-input class="form-item-input" v-model="user.mobile" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">邮箱</p>
              <el-form-item prop="email">
                <el-input class="form-item-input" v-model="user.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">联系电话(办公)</p>
              <el-form-item prop="phone">
                <el-input class="form-item-input" v-model="user.phone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="OEP-form-item margin_r_48">
            <div class="container">
              <p class="label">联系地址</p>
              <el-form-item prop="contacts.address">
                <el-input class="form-item-input" v-model="user.address" placeholder="请输入联系地址"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="uploader">
        <h2 class="title">照片</h2>
        <div class="row">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            list-type="picture-card"
            :on-change="onFileChange"
            :on-exceed="onExceed"
            :auto-upload="false"
            :limit="1"
          >
            <img v-if="unitCertUrl" :src="unitCertUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </el-form>
  </el-scrollbar>
</template>

<script>
import * as api from '@/api/organ'
import { isvalidMobile, isvalidEmail, isvalidPhone } from '@/utils/validate'
import * as commonalityApi from '@/api/commonality'
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
import { mapGetters } from 'vuex'
const testMobile = (rule, mobile, callback) => {
  const validRes = isvalidMobile(mobile)
  if (!validRes) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
const testEmail = (rule, value, callback) => {
  const validRes = isvalidEmail(value)
  if (value && !validRes) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
const testPhone = (rule, value, callback) => {
  const validRes = isvalidPhone(value)
  if (value && !validRes) {
    callback(new Error('请输入正确的号码'))
  } else {
    callback()
  }
}

export default {
  name: 'AddUser',
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    user: {
      required: true,
      type: Object
    },
    organType: {
      type: Number,
      default: 1 // 总院： 1, 分院： 2
    }
  },
  computed: {
    unitCertUrl() {
      const { pictureUrl } = this.user
      return pictureUrl
        ? `${BASE_API}/course${pictureUrl}?token=${getToken()}`
        : null
    },
    organId() {
      return this.user.organId
    },
    ...mapGetters(['schoolList']),
    isAll() {
      return this.$store.getters.userOrganId + '' === '1'
    }
  },
  watch: {
    organId: {
      handler(val) {
        val && this.getRoleList()
        this.$nextTick(() => {
          this.clearValidate()
        })
      },
      immediate: true
    },
    user: {
      handler(val) {
        if (val) {
          val.roleId =
            typeof val.roleId === 'string' ? val.roleId.split(',') : val.roleId
          if (this.organType === 1) {
            this.user.organId = '1'
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      disabled: true,
      contacts: {},
      roleOption: [],
      roleOptionALL: [],
      titleOption: [
        {
          value: '1',
          label: '高级讲师'
        },
        {
          value: '2',
          label: '讲师'
        },
        {
          value: '3',
          label: '助教'
        }
      ],
      jobOption: [
        {
          value: '1',
          label: '院长'
        },
        {
          value: '2',
          label: '科长'
        },
        {
          value: '3',
          label: '科员'
        }
      ],
      recordOption: [
        {
          value: '1',
          label: '专科'
        },
        {
          value: '2',
          label: '本科'
        },
        {
          value: '3',
          label: '研究生'
        }
      ],
      activeIndex: '0',
      rules: {
        organId: [
          { required: true, message: '请选择机构名称', trigger: 'change' }
        ],
        property: [
          { required: true, message: '请选择机构性质', trigger: 'change' }
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: testMobile, trigger: 'change' }
        ],
        email: [{ validator: testEmail, trigger: 'change' }],
        phone: [{ validator: testPhone, trigger: 'change' }]
      }
    }
  },
  methods: {
    changeUser(val) {
      this.user.property = val.property
    },
    setRules() {
      this.rules = {
        realName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: testMobile, trigger: 'change' }
        ],
        email: [{ validator: testEmail, trigger: 'change' }],
        phone: [{ validator: testPhone, trigger: 'change' }]
      }
    },
    showList() {
      if (this.organType === 1) {
        return this.roleOptionALL
      } else {
        return this.schoolList
      }
    },
    validate(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        callback(valid)
      })
    },
    // 获取角色列表
    getRoleList() {
      const params = {
        organId: this.organId
      }
      api.getRoleFormOrgan(params).then((res) => {
        this.roleOption = res.data.organRESQS
      })
      // 获取总院列表
      api.getOrgan({}).then((res) => {
        this.roleOptionALL = res.data.list || []
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
      if (this.$_picTypeCheck(data.raw)) {
        this.uploadImg(data.raw)
      }
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
      return false
    },
    onExceed(files, fileList) {
      if (this.$_picTypeCheck(files[0])) {
        this.uploadImg(files[0])
      }
    },
    uploadImg(file) {
      // const file = files[0];
      const param = new FormData()
      param.append('picFile', file, file.name)
      commonalityApi.uploadPic(param).then((res) => {
        if (res.code === 200) {
          this.user.pictureUrl = res.data
        } else {
          this.$message({
            type: 'error',
            message: '上传图片出错，请稍后重试'
          })
        }
      })
    },
    clearValidate() {
      this.$refs['ruleForm'].clearValidate()
      this.$refs['upload'].clearFiles()
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .form-item-radio {
  width: 50%;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.ruleForm {
  display: flex;
  .basic {
    width: calc(100% - 220px);
    flex: 1 0 auto;
    .OEP-form-item {
      width: 27%;
      /deep/ .form-item-input {
        width: 100%;
        .el-input {
          width: 100%;
        }
      }
    }
  }
  .uploader {
    flex: 0 0 220px;
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
      background-color: #e6e9ec;

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
        border-color: #409eff;
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
