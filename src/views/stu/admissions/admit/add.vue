admit<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <el-form :model="basicForm" :rules="basicRules" ref="basicForm" :inline="true">
          <el-scrollbar style="height:450px;">
            <div style="width: 900px">
              <div style="margin-bottom: 32px">
                <div class="main-title">
                  个人信息
                  <el-button
                    style="margin-left: 10px"
                    size="mini"
                    type="primary"
                    @click="cardIdClick"
                  >身份证识别</el-button>
                </div>
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
                        <el-input
                          class="flex-2"
                          v-model="basicForm.certNo"
                          :disabled="!isAdd || readCard"
                          placeholder="请输入证件号码"
                        ></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">
                        姓名
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item prop="realName">
                        <el-input
                          :disabled="readCard"
                          class="flex-2"
                          placeholder="请输入内容"
                          v-model="basicForm.realName"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">性别</div>
                      <el-radio-group :disabled="readCard" class="flex-2" v-model="basicForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                      </el-radio-group>
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
                          :disabled="readCard"
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
                  </div>
                  <div class="main-content">
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
                    <div class="homePlace">
                      <div class="flex-1">
                        户籍地址
                        <span class="required-icon">*</span>
                      </div>
                      <el-form-item>
                        <el-input
                          class="flex-2 lagerWidth"
                          v-model="basicForm.address"
                          :disabled="readCard"
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
                      <div class="flex-1">微信</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.weixin" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <div class="flex-1">联系QQ</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.qq" placeholder="请输入内容"></el-input>
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
                      <div class="flex-1">毕业学校</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.university" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>

                    <div>
                      <div class="flex-1">毕业时间</div>
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
                      <div class="flex-1">毕业证号码</div>
                      <el-form-item>
                        <el-input class="flex-2" v-model="basicForm.recordNo" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </div>
                  </div>
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
      <el-tab-pane label="报考信息" name="2">
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
                    :label="item.label"
                    :key="item.id"
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
              <div class="flex-1">
                报考科目
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="department">
                <el-select class="flex-2" v-model="signUpForm.department" placeholder="请选择">
                  <el-option
                    v-for="item in departmentOption"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">
                报考层级
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="enterLevel">
                <el-select @change="handlerEnterMajor(true)" class="flex-2" placeholder="请选择" v-model="signUpForm.enterLevel">
                  <el-option
                    v-for="item in enterLevelList"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="main-content">
            <div>
              <div class="flex-1">报考一志愿学校 <span class="required-icon">*</span></div>
              <el-form-item prop="organId">
                <el-select @change="handlerEnterMajor(true)" class="flex-2" filterable placeholder="请选择" v-model="signUpForm.organId">
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
                报考专业
                <span class="required-icon">*</span>
              </div>
              <el-form-item prop="enterMajor">
                <el-select
                  class="flex-2"
                  v-model="signUpForm.enterMajor"
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
                <el-input
                  class="flex-2"
                  v-model="signUpForm.testNo"
                  :disabled="!isAdd"
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">报考密码</div>
              <el-form-item>
                <el-input class="flex-2" v-model="signUpForm.password" placeholder="请输入" />
              </el-form-item>
            </div>
          </div>
          <div class="main-content">
            <div>
              <div class="flex-1">转专业</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.enterTransfer" placeholder="请选择">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
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
            <div>
              <div class="flex-1">学习形式</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.studyType" placeholder="请选择">
                  <el-option label="函授" value="1"></el-option>
                  <el-option label="业余" value="2"></el-option>
                  <el-option label="脱产" value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div class="flex-1">面试理由</div>
              <el-form-item>
                <el-input class="flex-2" v-model="signUpForm.faceReason" placeholder="请输入" />
              </el-form-item>
            </div>
          </div>
          <div class="main-content" style="justify-content: flex-start;">
            <div>
              <div class="flex-1">学院审核</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.approveStatus" placeholder="请选择">
                  <el-option label="未审核" value="1"></el-option>
                  <el-option label="合格" value="2"></el-option>
                  <el-option label="待定" value="3"></el-option>
                  <el-option label="不合格" value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="margin-left: 35px">
              <div class="flex-1">报考二志愿学校</div>
              <el-form-item>
                <el-select
                  class="flex-2"
                  v-model="signUpForm.organId2"
                  placeholder="请选择"
                  @change="handlerEnterMajor2(true)"
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
            <div style="margin-left: 35px">
              <div class="flex-1">二志愿层级</div>
              <el-form-item>
                <el-select
                  class="flex-2"
                  placeholder="请选择"
                  v-model="signUpForm.enterLevel2"
                  @change="handlerEnterMajor2(true)"
                >
                  <el-option
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictValue"
                    v-for="item in enterLevelList"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="margin-left: 35px">
              <div class="flex-1">报考二志愿专业</div>
              <el-form-item>
                <el-select class="flex-2" v-model="signUpForm.enterMajor2" placeholder="请选择">
                  <el-option
                    v-for="item in enterMajor2List"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="main-content">
            <div>
              <div class="flex-1">教学点</div>
              <el-form-item>
                <el-select
                  class="flex-2"
                  v-model="signUpForm.schoolOrganId"
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
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VDistpicker from 'v-distpicker'
import { isvalidMobile, validateIdCard } from '@/utils/validate'
import * as api from '../api'
import { mapGetters } from 'vuex'
import Device from '@/utils/zkid/index'

export default {
  components: { VDistpicker },
  props: {
    isAdd: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      'organList',
      'schoolOrgansList',
      'teacherList',
      'identificationList',
      'yearAndSemester'
    ]),
    schoolYearOptions() {
      return this.yearAndSemester.schoolYears
    },
    semesterOptions() {
      return this.yearAndSemester.semesterMap[this.signUpForm.schoolYear] || []
    }
  },
  data() {
    const _this = this
    const nullCheck = [{ required: true, message: '请输入', trigger: 'change' }]
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
        certNo: [{ validator: testIdCard, trigger: 'change' }],
        realName: nullCheck,
        certType: [{ required: true, message: '请选择', trigger: 'change' }],
        birthday: [{ required: true, message: '请选择', trigger: 'change' }],
        address: nullCheck,
        mobile: [{ validator: testMobile, trigger: 'change' }],
      },
      signUpRules: {
        department: [{ required: true, message: '请选择', trigger: 'change' }],
        organId: [{ required: true, message: '请选择', trigger: 'change' }],
        enterLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        testNo: [
          { required: true, message: '请输入考生号', trigger: 'change' },
          { max: 16, message: '必须小于16位', trigger: 'change' }
        ],
        semester: [{ required: true, message: '请选择', trigger: 'change' }],
        schoolYear: [{ required: true, message: '请选择', trigger: 'change' }],
        enterMajor: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      readCard: false, // 读取状态
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
        workCompany: ''
      },
      // 报考信息
      signUpForm: {
        schoolYear: '', // 学年
        semester: '', // 学期
        organId: '', // 学习中心
        enterLevel: '', // 报考层级
        organId2: '', // 报考二志愿学校
        enterLevel2: '', // 报考二志层级
        enterMajor: '', //  报考专业
        enterMajor2: '', //  报考专业2
        testNo: '', // 考生号
        password: '', // 报名密码
        testType: '', // 考试方式
        studyType: '', // 学习形式
        faceReason: '', // 面试理由
        enterTransfer: '', // 转专业
        approveStatus: '', // 学院审核
        department: '',
        schoolOrganId: ''
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
        { label: '专科', value: '1' },
        { label: '本科', value: '2' },
        { label: '研究生', value: '3' }
      ],
      semesterOption: [
        { label: '上学期', value: '1' },
        { label: '下学期', value: '2' }
      ],
      activeName: '1',
      semesterList: [],
      enterLevelList: [],
      enterMajorList: [],
      enterMajor2List: [],
      testTypeList: [],
      departmentOption: [],
      name: ''
    }
  },
  async created() {
    this.readCard = false
    this.enterLevelList =
      ((await api.listByCode({ code: '0015' })) || {}).data || []
    this.testTypeList =
      ((await api.listByCode({ code: '0009' })) || {}).data || []
    this.departmentOption =
      ((await api.listByCode({ code: '0038' })) || {}).data || []
  },
  methods: {
    handlerData() {
      this.readCard = false
      this.activeName = '1'
      for (const key in this.basicForm) {
        this.basicForm[key] = this.data[key] || ''
      }
      for (const key in this.signUpForm) {
        if (key === 'schoolOrganId') {
          console.log(this.data[key]);
        }
        this.signUpForm[key] = this.data[key] || ''
      }
      this.handlerEnterMajor()
      this.handlerEnterMajor2(false)
      if (!Object.keys(this.data).length) {
        this.basicForm.sex = '1'
        this.basicForm.marryStatus = '1'
        this.basicForm.jobStatus = '1'
        this.basicForm.yesTeacher = '1'
        this.basicForm.yesIntelnet = '1'
        this.basicForm.certType = this.identificationList[0].dictValue
      }
    },
    async handlerEnterMajor(clear = false) {
      if (clear) this.signUpForm.enterMajor = ''
      if (!this.signUpForm.organId || !this.signUpForm.enterLevel) {
        return false
      }
      const params = {
        organId: this.signUpForm.organId,
        level: this.signUpForm.enterLevel
      }
      this.enterMajorList =
        ((await api.listByOrganIdAndLevel(params)) || {}).data || []
    },
    // 获取第二志愿专业列表
    handlerEnterMajor2(reset = true) {
      reset && (this.signUpForm.enterMajor2 = '')
      if (!this.signUpForm.organId2 || !this.signUpForm.enterLevel2) {
        return false
      }
      const params = {
        organId: this.signUpForm.organId2,
        level: this.signUpForm.enterLevel2
      }
      api.listByOrganIdAndLevel(params).then((res) => {
        this.enterMajor2List = res.data
      })
    },
    validate(callback) {
      let basicForm = false
      let signUpForm = false
      this.$refs.basicForm.validate((valid) => {
        if (valid) return (basicForm = true)
      })
      this.$refs.signUpForm.validate((valid) => {
        if (valid) return (signUpForm = true)
      })
      if (!basicForm || !signUpForm) { return this.$message.warning('请填写完整信息!') }
      if (basicForm && signUpForm) {
        const params = Object.assign({}, this.basicForm, this.signUpForm)
        if (!Object.keys(this.data).length) {
          api.studentSave(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('新增成功!')
              callback(true)
            }
          })
        } else {
          params.id = this.data.id
          api.stundentUpdate(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('修改成功!')
              callback(true)
            }
          })
        }
      }
    },
    handleClick() {},
    cardIdClick() {
      Device.prototype.callBackFn = (res) => {
        const { Certificate = {}} = res
        this.basicForm.certNo = Certificate.IDNumber
        this.basicForm.realName = Certificate.Name
        this.basicForm.sex = Certificate.Sex === '男' ? '1' : '2'
        this.basicForm.nation = Certificate.Nation
        this.basicForm.address = Certificate.Address
        this.basicForm.birthday =
          Certificate.Birthday.slice(0, 4) +
          '-' +
          Certificate.Birthday.slice(4, 6) +
          '-' +
          Certificate.Birthday.slice(6)
        this.readCard = true
      }
      const device = new Device()
      device.startFun()
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
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
