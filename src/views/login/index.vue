<template>
  <div class="login-container">
    <bg-comp />
    <div class="right-section">
      <div class="login" v-if="loginVisible">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="welcome">WELCOME</div>
          <h3 class="title">教学管理平台</h3>
          <el-form-item prop="mobile">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.mobile"
              name="mobile"
              type="text"
              auto-complete="on"
              placeholder="登录帐号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :type="pwdType"
              v-model="loginForm.password"
              name="password"
              auto-complete="on"
              placeholder="登录密码"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item class="submit">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </el-form-item>
        </el-form>
        <div class="forget-pwd" @click="forgetHandler">忘记密码？</div>
      </div>
      <div class="login" v-else-if="firstPWDVisible">
        <el-form
          ref="firstLoginForm"
          :model="firstLoginForm"
          :rules="firstLoginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <h3 class="title">首次登录需要修改密码</h3>
          <el-form-item prop="mobilePsw">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="firstLoginForm.mobilePsw"
              name="mobile"
              type="text"
              auto-complete="on"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item prop="rePwd">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :type="pwdType"
              v-model="firstLoginForm.rePwd"
              name="password"
              auto-complete="on"
              placeholder="确认密码"
              @keyup.enter.native="firstLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item class="submit">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="firstLogin"
            >确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--     <div class="login" v-else-if="forgetPWDVisible">-->
      <!--       <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">-->
      <!--         <h3 class="title">忘记密码</h3>-->
      <!--         <el-form-item prop="mobile">-->
      <!--          <span class="svg-container">-->
      <!--            <svg-icon icon-class="user" />-->
      <!--          </span>-->
      <!--           <el-input v-model="loginForm.mobile" name="mobile" type="text" auto-complete="on" placeholder="登录帐号" />-->
      <!--         </el-form-item>-->
      <!--         <el-form-item prop="password">-->
      <!--          <span class="svg-container">-->
      <!--            <svg-icon icon-class="password" />-->
      <!--          </span>-->
      <!--           <el-input-->
      <!--               :type="pwdType"-->
      <!--               v-model="loginForm.password"-->
      <!--               name="password"-->
      <!--               auto-complete="on"-->
      <!--               placeholder="登录密码"-->
      <!--               @keyup.enter.native="handleLogin" />-->
      <!--           <span class="show-pwd" @click="showPwd">-->
      <!--            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />-->
      <!--          </span>-->
      <!--         </el-form-item>-->
      <!--         <el-form-item class="submit">-->
      <!--           <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="resetPwd">-->
      <!--             重置密码-->
      <!--           </el-button>-->
      <!--         </el-form-item>-->
      <!--       </el-form>-->
      <!--     </div>-->
    </div>
    <el-dialog title="提示" :visible.sync="forgetPWDVisible" append-to-body width="30%">
      <span>请联系管理员重置密码!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="forgetPWDVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as api from '@/api/login'
import CryptoJS from 'crypto-js'

const PUBLIC_KEY = 1234567890123456

import BgComp from './BgComp'

export default {
  name: 'Login',
  components: {
    BgComp,
  },
  data() {
    return {
      loginForm: {
        // mobile: 'root',
        // password: '123456',
        mobile: '18888888888',
        password: '123456',
        // system_qc Shiji123
        // mobile: '',
        // password: '',
        // mobile: '',
        // password: '',
        clientId: 'lkb65617f842ad4c37895a733b8de43cbb', //客户端ID
        ip: '127.0.0.0',
      },
      firstLoginForm: {
        mobilePsw: '',
        rePwd: '',
      },

      loginRules: {
        mobile: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobilePsw: [{ required: true, trigger: 'blur' }],
        rePwd: [{ required: true, trigger: 'blur' }],
      },
      firstLoginRules: {
        mobilePsw: [{ required: true, trigger: 'blur' }],
        rePwd: [{ required: true, trigger: 'blur' }],
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      loginVisible: true,
      firstPWDVisible: false,
      forgetPWDVisible: false,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    encrypt(data) {
      const key = CryptoJS.enc.Utf8.parse(PUBLIC_KEY)
      const iv = CryptoJS.enc.Utf8.parse(PUBLIC_KEY)
      return CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      }).toString()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            ...this.loginForm,
            password: this.encrypt(this.loginForm.password),
          }
          this.$store
            .dispatch('Login', params)
            .then((res) => {
              // 首次登录状态判断
              this.loading = false
              this.goHome()
              // if (res.data.firstLogin) {
              //   this.loginVisible = false
              //   this.firstPWDVisible = true
              // } else {
              //   this.goHome()
              // }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    forgetHandler() {
      this.forgetPWDVisible = true
    },
    firstLogin() {
      this.$refs.firstLoginForm.validate((valid) => {
        if (valid) {
          api.firstLogin(this.firstLoginForm).then((res) => {
            if (res.code === 200) {
              this.goHome()
              this.$router.push({ path: this.redirect || '/' })
            }
          })
        }
      })
    },
    async goHome() {
      this.$store.dispatch('updategetSchoolOrgansList')
      this.$store.dispatch('updateSchoolList')
      this.$store.dispatch('updateTeacherList')
      this.$store.dispatch('updateIdentificationList')
      this.$store.dispatch('getYearAndSemester')
      this.$router.push({ path: this.redirect || '/' })
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #f8f9fb;
$light_gray: #444;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #e5e5e5 inset !important;
        -webkit-text-fill-color: #333333 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 32px;
    &.submit {
      margin-top: 48px;
      margin-bottom: 20px;
    }
  }
  .el-dialog__header {
    text-align: left;
  }
  /deep/ .el-form-item__content {
    background-color: #ffffff;
    border: 1px solid #aab6c3;
    border-radius: 4px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #f8f9fb;
$dark_gray: #889aa4;
$light_gray: #444;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  display: flex;
  .left-section {
    z-index: 10;
    height: 100vh;
    background-color: #3f93db;
    flex: 0 0 36vw;
    text-align: center;
    position: relative;
    .login_img_title {
      position: absolute;
      width: 22vw;
      top: 5vh;
      left: 5vw;
    }
    .login_img {
      position: absolute;
      width: 18vw;
      top: 35vh;
      left: 9vw;
    }
  }
  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 0 35px 0 44px;
    margin: 32px auto 0;
    .welcome {
      opacity: 0.2;
      font-size: 50px;
      color: #a3aab3;
      letter-spacing: 0;
      margin-bottom: 18px;
    }
  }
  .login_logo_img {
    width: 60px;
    height: 60px;
    display: inline-block;
    vertical-align: middle;
  }
  .login_logo {
    width: 120px;
    height: 120px;
    border: 5px solid #93defe;
    border-radius: 100px;
    background: #fff;
    text-align: center;
    line-height: 100px;
    position: absolute;
    top: -130px;
    right: 155px;
  }
  .right-section {
    position: fixed;
    z-index: 20;
    top: 24vh;
    right: 33vw;
    display: flex;
    .login {
      height: 480px;
      width: 480px;
      box-shadow: 0 8px 24px 0;
      background-color: #ffffff;
      border-radius: 6px;
      box-sizing: border-box;
      position: relative;
      .forget-pwd {
        position: absolute;
        left: 44px;
        bottom: 39px;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 21px;
        height: 21px;
      }
    }
  }

  .tips {
    font-size: 14px;
    position: fixed;
    bottom: 0;
    left: 0;
    top: 650px;
    text-align: center;
    right: 0;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 24px;
    color: $light_gray;
    margin: 0 auto 32px auto;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
