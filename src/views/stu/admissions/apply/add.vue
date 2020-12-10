<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <el-form :model="basicForm" :rules="basicRules" ref="basicForm" :inline="true">
          <el-scrollbar style="height:450px;">
            <div style="width: 900px">
              <div style="margin-bottom: 32px">
                <div class="main-title">个人信息</div>
                <div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">
                        证件类型
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="certType">
                        <el-select class="flex-2" v-model="basicForm.certType" placeholder="请选择">
                          <el-option
                            v-for="item in identificationList"
                            :key="item.id"
                            :label="item.dictName"
                            :value="item.dictValue"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">
                        证件号码
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="certNo">
                        <el-input class="flex-2" placeholder="请输入证件号码" v-model="basicForm.certNo"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">
                        姓名
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="realName">
                        <el-input class="flex-2" v-model="basicForm.realName" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">性别</div>
                      <el-radio-group class="flex-2" v-model="basicForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">
                        出生日期
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="birthday">
                        <el-date-picker
                          class="flex-2"
                          v-model="basicForm.birthday"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">籍贯</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.birthPlace" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">民族</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.nation" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">政治面貌</div>
                      <el-form-item>
                        <el-input
                          class="flex-2"
                          v-model="basicForm.politicalOutlook"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">婚姻状况</div>
                      <el-radio-group class="flex-2" v-model="basicForm.marryStatus">
                        <el-radio label="1">已婚</el-radio>
                        <el-radio label="2">未婚</el-radio>
                      </el-radio-group>
                    </div>

                    <div class="homePlace">
                      <div class="flex-1">
                        户籍地址
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="address">
                        <el-input
                          class="flex-2 lagerWidth"
                          v-model="basicForm.address"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">邮编</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.postalCode" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">
                        手机号
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="mobile">
                        <el-input class="flex-2" v-model="basicForm.mobile" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">电子邮箱</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.email" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">联系QQ</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.qq" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">微信</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.weixin" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-bottom: 32px">
                <div class="main-title">教育信息</div>
                <div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">毕业证书类型</div>
                      <el-form-item>
                        <el-select class="flex-2" v-model="basicForm.record" placeholder="请选择">
                          <el-option
                            v-for="item in recordOption"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">
                        毕业学校
                        <!--                        <span class="required-icon">*</span>-->
                      </div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.university" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">
                        毕业时间
                        <!--                        <span class="required-icon">*</span>-->
                      </div>
                      <el-form-item>
                        <el-date-picker
                          class="flex-2"
                          v-model="basicForm.graduationDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">原学习专业</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.major" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">
                        毕业证号码
                        <!--                        <span class="required-icon">*</span>-->
                      </div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.recordNo" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                    <div class="homePlace">
                      <div class="flex-1">
                        专科身份证号
                      </div>
                      <el-form-item>
                        <el-input
                          class="flex-2 lagerWidth"
                          v-model="basicForm.juniorCertNo"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">
                        专科姓名
                        <!--                        <span class="required-icon">*</span>-->
                      </div>
                      <el-form-item>
                        <el-input
                          class="flex-2"
                          v-model="basicForm.juniorCertName"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="homePlace">
                  <div class="flex-1">认证报告或学历备案编号</div>
                  <el-form-item>
                    <el-input
                      class="flex-2 lagerWidth"
                      v-model="basicForm.report"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="main-content" style="justify-content: flex-start;">
                <div>
                  <div class="flex-1">是否前置学历审核</div>
                  <el-form-item>
                    <el-select
                      class="flex-2"
                      v-model="basicForm.educationApprove"
                      placeholder="请选择"
                    >
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div style="margin-left: 35px" v-if="basicForm.educationApprove === '1'">
                  <div class="flex-1">审核附件</div>
                  <el-form-item>
                    <el-upload
                      class="upload-demo"
                      style="display: inline;margin-right:10px;"
                      :on-change="onFileChange"
                      :auto-upload="false"
                      :show-file-list="false"
                      :limit="1"
                      action="https://jsonplaceholder.typicode.com/posts/"
                    >
                      <el-button slot="trigger" size="small" type="primary">上传</el-button>
                    </el-upload>
                    <a
                      class="file-text"
                      style="text-decoration: underline;"
                      @click="downLoads(basicForm.approveFile)"
                      :title="basicForm.approveFile"
                    >{{basicForm.approveFile}}</a>
                  </el-form-item>
                </div>
                <div style="margin-left: 35px" v-if="basicForm.educationApprove === '1'">
                  <div class="flex-1">审核结论</div>
                  <el-form-item>
                    <el-select class="flex-2" v-model="basicForm.educationStatus" placeholder="请选择">
                      <el-option label="通过" value="1"></el-option>
                      <el-option label="不通过" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>

              <div style="margin-bottom: 32px">
                <div class="main-title">工作信息</div>
                <div>
                  <div class="main-content">
                    <div>
                      <div class="flex-1">参加工作时间</div>
                      <el-form-item>
                        <el-date-picker
                          class="flex-2"
                          v-model="basicForm.workDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">工作单位名称</div>
                      <el-form-item>
                        <el-input
                          class="flex-2"
                          v-model="basicForm.workCompany"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">职业</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.occupation" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">职务</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.job" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>

                  <div class="main-content">
                    <div>
                      <div class="flex-1">职称</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.title" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">职业状况</div>
                      <el-radio-group class="flex-2" v-model="basicForm.jobStatus">
                        <el-radio label="1">从业</el-radio>
                        <el-radio label="2">无业</el-radio>
                      </el-radio-group>
                    </div>
                    <div>
                      <div class="flex-1">是否可以上网</div>
                      <el-radio-group class="flex-2" v-model="basicForm.yesIntelnet">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                      </el-radio-group>
                    </div>
                    <div>
                      <div class="flex-1">备用联系电话（手机）</div>
                      <el-input class="flex-2" v-model="basicForm.backMobile" placeholder="请输入内容"></el-input>
                    </div>
                  </div>

                  <div class="main-content" style="justify-content: flex-start;">
                    <div class="homePlace">
                      <div class="flex-1">备注</div>
                      <el-input
                        class="flex-2 lagerWidth"
                        v-model="basicForm.remark"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="录取信息" name="2">
        <el-form :model="signUpForm" :rules="signUpRules" ref="signUpForm" :inline="true">
          <div class="main-content">
            <div>
              <div class="flex-1">
                学年
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="schoolYear">
                <el-select class="flex-2" v-model="signUpForm.schoolYear" placeholder="请选择">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in schoolYearOptions"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">
                学期
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="semester">
                <el-select class="flex-2" v-model="signUpForm.semester" placeholder="请选择">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in semesterOptions"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">报考学校  <span class="required-icon">*</span></div>
              <el-form-item prop="organId">
                <el-select
                  class="flex-2"
                  v-model="signUpForm.organId"
                  filterable
                  :disabled="!isAdd && isSchool"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in schoolOrgansList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">
                录取层次
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="enterLevel">
                <el-select class="flex-2" v-model="signUpForm.enterLevel" placeholder="请选择">
                  <el-option
                    v-for="item in enterLevelList"
                    :key="item.id"
                    @click.native="handlerEnterMajor(item, true)"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="main-content">
            <div>
              <div class="flex-1">
                录取专业
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="enterMajor">
                <el-select
                  class="flex-2"
                  v-model="signUpForm.enterMajor"
                  @visible-change="visibleChange($event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in enterMajorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">
                考生号
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="testNo">
                <el-input class="flex-2" v-model="signUpForm.testNo" placeholder="请输入" />
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">报考密码</div>
              <el-form-item>
                <el-input class="flex-2" v-model="signUpForm.testPassword" placeholder="请输入" />
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">转专业</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.enterTransfer" placeholder="请选择">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="main-content">
            <div>
              <div class="flex-1">考试方式</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.testType" placeholder="请选择">
                  <el-option
                    v-for="item in testTypeList"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="margin-left: 35px">
              <div class="flex-1">学习形式</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.studyType" placeholder="请选择">
                  <el-option label="函授" value="1"></el-option>
                  <el-option label="业余" value="2"></el-option>
                  <el-option label="脱产" value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="margin-left: 35px">
              <div class="flex-1">学院审核</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.approveStatus" placeholder="请选择">
                  <el-option label="未审核" value="1"></el-option>
                  <el-option label="合格" value="2"></el-option>
                  <el-option label="待定" value="3"></el-option>
                  <el-option label="不合格" value="4"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="margin-left: 35px">
              <div class="flex-1">教学点</div>
              <el-form-item>
                <el-select
                  class="flex-2"
                  v-model="signUpForm.schoolOrganId"
                  :disabled="!isAdd && isTeacher"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in teacherList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="main-content" style="justify-content: start">
            <div>
              <div class="flex-1">
                学号
                <span class="required-icon">*</span>
              </div>
              <el-form-item>
                <el-input class="flex-2" placeholder="请输入" v-model="signUpForm.studentNo" />
              </el-form-item>
            </div>
            <div style="margin-left: 35px">
              <div class="flex-1">
                学制
              </div>
              <div class="flex-2">
                {{signUpForm.schoolSystem}}
              </div>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="图片信息" name="3">
        <el-scrollbar style="height:450px">
          <el-form :model="phontoForm" ref="phontoForm" :inline="true">
            <div class="main-content">
              <div>
                <div class="flex-1 marin-bottom">
                  上传毕业照
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      <img width="500px" src="/src/assets/images/use-example.jpg" alt />
                    </div>
                    <i class="iconfont icon-help-nor"></i>
                  </el-tooltip>
                </div>
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl1" ref="upload1" />
                </el-form-item>
              </div>
            </div>
            <div class="flex-1 marin-bottom">上传其他照片(毕业证、身份证正反两面、资格证书、学历电子备案表等)</div>
            <div class="main-content" style="margin-top:0;">
              <div>
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl2" ref="upload2" />
                </el-form-item>
              </div>
              <div>
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl3" ref="upload3" />
                </el-form-item>
              </div>
              <div>
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl4" ref="upload4" />
                </el-form-item>
              </div>
              <div>
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl5" ref="upload5" />
                </el-form-item>
              </div>
            </div>
            <div class="main-content" style="margin-top:0;justify-content: flex-start;">
              <div>
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl6" ref="upload6" />
                </el-form-item>
              </div>
              <div style="margin-left:35px">
                <el-form-item>
                  <Upload :url="phontoForm.pictureUrl7" ref="upload7" />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VDistpicker from 'v-distpicker'
import { isvalidMobile, validateIdCard } from '@/utils/validate'
import * as api from '../api'
import { mapGetters } from 'vuex'
import Upload from '@/components/ImgUpload'
import { getToken } from '@/utils/auth'

export default {
  components: { VDistpicker, Upload },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      'organList',
      'teacherList',
      'schoolOrgansList',
      'identificationList',
      'yearAndSemester'
    ]),
    schoolYearOptions() {
      return this.yearAndSemester.schoolYears
    },
    semesterOptions() {
      return this.yearAndSemester.semesterMap[this.signUpForm.schoolYear] || []
    },
    isSchool() {
      return (
        this.$store.getters.property && this.$store.getters.property === '1'
      )
    },
    isTeacher() {
      return (
        this.$store.getters.property && this.$store.getters.property === '2'
      )
    },
    hostUrl() {
      return `${process.env.BASE_API}/course/upload_file/doc${
        this.basicForm.approveFile
      }?${getToken()}`
    }
  },
  data() {
    const _this = this
    const nullCheck = [{ required: true, message: '请输入', trigger: 'blur' }]
    const testIdCard = (rule, val, callback) => {
      if (_this.basicForm.certType !== '1') {
        if (val) {
          callback()
        } else {
          callback(new Error('请输入'))
        }
      } else {
        const validRes = validateIdCard(val)
        if (validRes.status === 1) {
          callback()
        } else {
          callback(new Error(validRes.msg))
        }
      }
    }

    const testMobile = (rule, value, callback) => {
      const mobile = value
      const validRes = isvalidMobile(mobile)
      if (!validRes) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      basicRules: {
        name: nullCheck,
        certNo: [{ validator: testIdCard, trigger: 'blur' }],
        realName: nullCheck,
        certType: [{ required: true, message: '请选择', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择', trigger: 'blur' }],
        address: nullCheck,
        mobile: [{ validator: testMobile, trigger: 'blur' }]
      },
      signUpRules: {
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolOrganId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        enterLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        testNo: [
          { required: true, message: '请输入考生号', trigger: 'blur' },
          { max: 16, message: '必须小于16位', trigger: 'blur' }
        ],
        semester: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
        enterMajor: [{ required: true, message: '请选择', trigger: 'change' }],
        studentNo: [{ required: true, message: '请输入学号', trigger: 'blur' }]
      },
      basicForm: {
        certType: '',
        certNo: '', // 证件号码
        mobile: '', // 手机
        backMobile: '', // 备用手机号
        realName: '', // 姓名
        sex: '1', // 性别
        marryStatus: '1', // 结婚状态
        birthday: '', // 生日
        birthPlace: '', // 出生地方
        nation: '', // 名字
        politicalOutlook: '', // 政治面貌
        postalCode: '', // 邮编
        email: '', // 邮箱
        qq: '', // QQ
        weixin: '',
        address: '', // 户籍地址
        workDate: '', // 参加工作时间
        record: '', // 毕业证书类型
        university: '', // 毕业学校
        graduationDate: '', // 毕业时间
        major: '', // 原学习专业
        recordNo: '', // 毕业证书号码
        remark: '',
        yesIntelnet: '',
        yesTeacher: '',
        jobStatus: '',
        title: '',
        job: '',
        occupation: '',
        workCompany: '',
        juniorCertNo: '',
        juniorCertName: '',
        report: '',
        educationApprove: '',
        approveFile: '',
        educationStatus: ''
      },
      // 报考信息
      signUpForm: {
        organId: '',
        schoolOrganId: '',
        // studentNo: '', // 学号
        schoolYear: '', // 学年
        semester: '', // 学期
        enterLevel: '', // 报考层级
        enterMajor: '', //  录取专业
        testNo: '', // 考生号
        testPassword: '', // 报名密码
        testType: '', // 考试方式
        studyType: '', // 学习形式
        faceReason: '', // 面试理由
        enterTransfer: '', // 转专业
        approveStatus: '', // 学院审核
        registerType: '' // 注册状态
      },
      phontoForm: {
        pictureUrl1: '',
        pictureUrl2: '',
        pictureUrl3: '',
        pictureUrl4: '',
        pictureUrl5: '',
        pictureUrl6: '',
        pictureUrl7: ''
      },
      politicalLandscapeList: [
        {
          value: '团员',
          label: '团员'
        },
        {
          value: '党员',
          label: '党员'
        }
      ],
      recordOption: [
        { label: '自考', value: '1' },
        { label: '成考', value: '2' },
        { label: '普通教育', value: '3' }
      ],
      activeName: '1',
      enterLevelList: [],
      enterMajorList: [],
      registerTypeList: [],
      testTypeList: [],
      name: ''
    }
  },
  async created() {
    this.enterLevelList =
      ((await api.listByCode({ code: '0015' })) || {}).data || []
    this.registerTypeList =
      ((await api.listByCode({ code: '0012' })) || {}).data || []
    this.testTypeList =
      ((await api.listByCode({ code: '0009' })) || {}).data || []
  },
  methods: {
    async downLoads(url) {
      window.location.href = this.$_getUrl(url)
    },
    handlerData() {
      for (const key in this.basicForm) {
        this.basicForm[key] = this.data[key] || ''
      }
      for (const key in this.signUpForm) {
        this.signUpForm[key] = this.data[key] || ''
      }
      for (const key in this.phontoForm) {
        this.phontoForm[key] = this.data[key] || ''
      }
      if (this.signUpForm.enterLevel) this.handlerEnterMajor()
      if (this.isAdd) {
        this.basicForm.sex = '1'
        this.basicForm.marryStatus = '1'
        this.basicForm.jobStatus = '1'
        this.basicForm.yesTeacher = '1'
        this.basicForm.yesIntelnet = '1'
        this.basicForm.certType = this.identificationList[0].dictValue
      }
    },
    async visibleChange(value, item) {
      if (!this.signUpForm.enterLevel) { return this.$message.warning('请先选择报考层级!') }
    },
    async handlerEnterMajor(item, clear = false) {
      if (clear) this.signUpForm.enterMajor = ''
      const params = {
        organId: this.signUpForm.organId,
        level: this.signUpForm.enterLevel
      }
      if (!this.signUpForm.organId || !this.signUpForm.enterLevel) {
        return
      }
      this.enterMajorList =
        ((await api.listByOrganIdAndLevel(params)) || {}).data || []
    },
    async handlerPhoto() {
      const uploadRes1 = await this.$refs.upload1.upload()
      if (uploadRes1.code !== 200) {
        this.$message('上传证件照上传失败！')
        return false
      }
      this.phontoForm.pictureUrl1 = uploadRes1.data
      const uploadRes2 = await this.$refs.upload2.upload()
      if (uploadRes2.code !== 200) {
        this.$message('上传其他照片1传失败！')
        return false
      }
      this.phontoForm.pictureUrl2 = uploadRes2.data
      const uploadRes3 = await this.$refs.upload3.upload()
      if (uploadRes3.code !== 200) {
        this.$message('上传其他照片2传失败！')
        return false
      }
      this.phontoForm.pictureUrl3 = uploadRes3.data
      const uploadRes4 = await this.$refs.upload4.upload()
      if (uploadRes4.code !== 200) {
        this.$message('上传其他照片3传失败！')
        return false
      }
      this.phontoForm.pictureUrl4 = uploadRes4.data
      const uploadRes5 = await this.$refs.upload5.upload()
      if (uploadRes5.code !== 200) {
        this.$message('上传其他照片4传失败！')
        return false
      }
      this.phontoForm.pictureUrl5 = uploadRes5.data
      const uploadRes6 = await this.$refs.upload6.upload()
      if (uploadRes6.code !== 200) {
        this.$message('上传其他照片5传失败！')
        return false
      }
      this.phontoForm.pictureUrl1 = uploadRes1.data
      const uploadRes7 = await this.$refs.upload7.upload()
      if (uploadRes7.code !== 200) {
        this.$message('上传其他照片6传失败！')
        return false
      }
      this.phontoForm.pictureUrl6 = uploadRes6.data
    },
    async validate(callback) {
      let basicForm = false
      let signUpForm = false
      await this.handlerPhoto()
      this.$refs.basicForm.validate((valid) => {
        if (valid) return (basicForm = true)
      })
      if (this.basicForm.educationApprove === '2') {
        this.basicForm.educationStatus = ''
        this.basicForm.approveFile = ''
      }
      this.$refs.signUpForm.validate((valid) => {
        if (valid) return (signUpForm = true)
      })
      if (!basicForm || !signUpForm) { return this.$message.warning('请填写完整信息!') }
      if (basicForm && signUpForm) {
        const params = Object.assign(
          {},
          this.basicForm,
          this.signUpForm,
          this.phontoForm
        )
        if (!Object.keys(this.data).length) {
          api.addStundentSave(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('新增成功!')
              callback(true)
            }
          })
        } else {
          params.id = this.data.id
          api.addStudentUpdate(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('修改成功!')
              callback(true)
            }
          })
        }
      }
    },
    handleClick() {},
    onFileChange(data) {
      const isLt2M = data.size / 1024 / 1024 > 4
      if (isLt2M) return this.$message.warning('上传大小不能超过4M!')
      const file = data.raw
      const param = new FormData()
      param.append('docFile', file, file.name)
      api.uploadDoc(param).then((res) => {
        this.basicForm.approveFile = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-title {
  color: #333;
  font-size: 16px;
}
.main-content {
  margin-top: 24px;
  color: #666;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  > div {
    width: 200px;
  }
  > .homePlace {
    width: 430px;
    .flex-2 /deep/ select {
      width: 140px;
    }
  }
}

.flex-1 {
  margin-bottom: 4px;
}

.flex-2 {
  height: 40px;
  line-height: 40px;
  width: 200px;
  /deep/ .el-input {
    width: 200px;
  }
  /deep/ select {
    width: 98px;
  }
  /deep/ select {
    width: 98px;
  }
  > label {
    vertical-align: middle;
  }
  &.lagerWidth {
    width: 430px;
  }
}

.address {
  display: flex;
}
.marin-bottom {
  margin-bottom: 15px;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.file-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: right;
  width: 100px;
}
</style>
