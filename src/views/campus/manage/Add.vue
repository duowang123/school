<template>
  <div class="situation">
    <el-scrollbar style="height:100%" :noresize="true">
      <el-form
        :model="organInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <div class="basic">
          <h2 class="title" style="justify-content: space-between">
            <span>基本信息</span>
            <!--            <el-button type="text" @click="editHandler">{{disabled ? '编辑' : '保存'}}</el-button>-->
          </h2>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">
                  合作单位名称
                  <span class="required-icon">*</span>
                </p>
                <el-form-item prop="name">
                  <el-input
                    class="form-item-input"
                    :disabled="disabled"
                    v-model="organInfo.name"
                    placeholder="请输入内容"
                  ></el-input>
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
                    v-model="organInfo.oldName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">
                  机构性质
                  <span class="required-icon">*</span>
                </p>
                <el-form-item prop="property">
                  <el-select
                    class="form-item-input"
                    v-model="organInfo.property"
                    :disabled="disabled"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in propertyOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">
                  合作状态
                  <span class="required-icon">*</span>
                </p>
                <el-form-item prop="cooperationStuts">
                  <el-select
                    class="form-item-input"
                    v-model="organInfo.cooperationStuts"
                    :disabled="disabled"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in cooperationStutsOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">
                  依托单位名称
                  <span class="required-icon">*</span>
                </p>
                <el-form-item prop="unitName">
                  <el-input
                    class="form-item-input"
                    :disabled="disabled"
                    v-model="organInfo.unitName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">
                  依托单位性质
                  <span class="required-icon">*</span>
                </p>
                <el-form-item prop="unitProperty">
                  <el-select
                    class="form-item-input"
                    v-model="organInfo.unitProperty"
                    :disabled="disabled"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in unitPropertyOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">
                  用户数量限制
                  <span class="required-icon">*</span>
                </p>
                <el-form-item prop="userLimit">
                  <el-input-number
                    class="form-item-input_number"
                    v-model="organInfo.userLimit"
                    :disabled="disabled"
                    :min="0"
                    :max="1000"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="contact">
            <h2 class="title">联系人信息</h2>
            <el-tabs
              class="users-tab"
              v-model="activeIndex"
              :stretch="true"
              @tab-click="tabsHandleClick"
            >
              <el-tab-pane label="负责人/法人 *" name="0">
                <div class="contact-info">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">
                        姓名
                        <span class="required-icon">*</span>
                      </p>
                      <el-form-item prop="contactsName">
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[0].name"
                          placeholder="请输入姓名"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">
                        身份证
                        <span v-if="activeIndex === '0'" class="required-icon">*</span>
                      </p>
                      <el-form-item prop="contactsIdCard">
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[0].idCard"
                          placeholder="请输入身份证"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">
                        性别
                        <span v-if="activeIndex === '0'" class="required-icon">*</span>
                      </p>
                      <div class="radio-container">
                        <el-form-item prop="contactsSex">
                          <el-radio-group
                            v-model="organInfo.contactInfoS[0].sex"
                            :disabled="disabled"
                          >
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
                        手机号码
                        <span v-if="activeIndex === '0'" class="required-icon">*</span>
                      </p>
                      <el-form-item prop="contactsMobile">
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[0].mobile"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[0].phone"
                        :disabled="disabled"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[0].weixin"
                        :disabled="disabled"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">QQ</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[0].qq"
                        :disabled="disabled"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">
                        地址
                        <span v-if="activeIndex === '0'" class="required-icon">*</span>
                      </p>
                      <el-form-item prop="contactsAddress">
                        <el-input
                          class="form-item-input"
                          v-model="organInfo.contactInfoS[0].address"
                          :disabled="disabled"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="招生办负责人" name="1">
                <div class="contact-info" v-if="organInfo.contactInfoS[1]">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[1].name"
                          @input="forceChange()"
                          placeholder="请输入姓名"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[1].idCard"
                          @input="forceChange()"
                          placeholder="请输入身份证"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别</p>
                      <div class="radio-container">
                        <el-form-item>
                          <el-radio-group
                            v-model="organInfo.contactInfoS[1].sex"
                            @input="forceChange()"
                            :disabled="disabled"
                          >
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
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[1].mobile"
                          @input="forceChange()"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[1].phone"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[1].weixin"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">QQ</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[1].qq"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">地址</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          v-model="organInfo.contactInfoS[1].address"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="学籍教务管理员" name="2">
                <div class="contact-info" v-if="organInfo.contactInfoS[2]">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[2].name"
                          @input="forceChange()"
                          placeholder="请输入姓名"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[2].idCard"
                          @input="forceChange()"
                          placeholder="请输入身份证"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别</p>
                      <div class="radio-container">
                        <el-form-item>
                          <el-radio-group
                            v-model="organInfo.contactInfoS[2].sex"
                            @input="forceChange()"
                            :disabled="disabled"
                          >
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
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[2].mobile"
                          @input="forceChange()"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[2].phone"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[2].weixin"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">QQ</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[2].qq"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">地址</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          v-model="organInfo.contactInfoS[2].address"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="财务管理员" name="3">
                <div class="contact-info" v-if="organInfo.contactInfoS[3]">
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">姓名</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[3].name"
                          @input="forceChange()"
                          placeholder="请输入姓名"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">身份证</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[3].idCard"
                          @input="forceChange()"
                          placeholder="请输入身份证"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">性别</p>
                      <div class="radio-container">
                        <el-form-item>
                          <el-radio-group
                            v-model="organInfo.contactInfoS[3].sex"
                            @input="forceChange()"
                            :disabled="disabled"
                          >
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
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          :disabled="disabled"
                          v-model="organInfo.contactInfoS[3].mobile"
                          @input="forceChange()"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">电话</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[3].phone"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">微信号</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[3].weixin"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">QQ</p>
                      <el-input
                        class="form-item-input"
                        v-model="organInfo.contactInfoS[3].qq"
                        :disabled="disabled"
                        @input="forceChange()"
                        placeholder="请输入内容"
                      ></el-input>
                    </div>
                  </div>
                  <div class="OEP-form-item margin_r_48">
                    <div class="container">
                      <p class="label">地址</p>
                      <el-form-item>
                        <el-input
                          class="form-item-input"
                          v-model="organInfo.contactInfoS[3].address"
                          :disabled="disabled"
                          @input="forceChange()"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-form-item>
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
            <span
              style="color: #8d8d8d; font-size: 14px; margin-left: 15px"
            >( 办学许可证 / 企业单位登记证书 / 法人身份证 )</span>
          </h2>
          <div class="row uploader-container">
            <img-list ref="imgList" :imgs="fileList" :disabled="!disabled" />
          </div>
        </div>
        <div>
          <h2 class="title">审核信息</h2>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">行政部门审核时间</p>
                <el-form-item>
                  <el-date-picker
                    class="form-item-input"
                    v-model="organInfo.approveDate"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">行政部门批准文号</p>
                <el-form-item>
                  <el-input
                    class="form-item-input"
                    :disabled="disabled"
                    v-model="organInfo.approveNo"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">最近一次审核日期</p>
                <el-form-item>
                  <el-date-picker
                    class="form-item-input"
                    v-model="organInfo.lastApproveDate"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">最近一次合同日期</p>
                <el-form-item>
                  <el-date-picker
                    class="form-item-input"
                    v-model="organInfo.lastContractDate"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">最近一次审核意见</p>
                <el-form-item>
                  <el-input
                    class="form-item-input"
                    v-model="organInfo.lastApproveIdea"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="title">其他</h2>
          <div class="row">
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">辅导老师人数</p>
                <el-input-number
                  :min="0"
                  :max="1000"
                  class="form-item-input_number"
                  :disabled="disabled"
                  v-model="organInfo.teacherNum"
                  placeholder="请输入内容"
                />
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">管理员人数</p>
                <el-input-number
                  :min="0"
                  :max="1000"
                  class="form-item-input_number"
                  v-model="organInfo.managerNum"
                  :disabled="disabled"
                  placeholder="请输入内容"
                />
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">技术员人数</p>
                <el-input-number
                  :min="0"
                  :max="1000"
                  class="form-item-input_number"
                  v-model="organInfo.itNum"
                  :disabled="disabled"
                  placeholder="请输入内容"
                />
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">其他人员人数</p>
                <el-input-number
                  :min="0"
                  :max="1000"
                  class="form-item-input_number"
                  v-model="organInfo.otherNum"
                  :disabled="disabled"
                  placeholder="请输入内容"
                />
              </div>
            </div>
            <div class="OEP-form-item margin_r_48">
              <div class="container">
                <p class="label">首批学生入学日期</p>
                <el-form-item>
                  <el-date-picker
                    class="form-item-input"
                    v-model="organInfo.firstDate"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-scrollbar>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/organ'
import { isvalidMobile, validateIdCard } from '../../../utils/validate'
import ImgList from '@/components/ImgList'
import { cloneDeep } from 'loadsh'

export default {
  name: 'Add',
  components: {
    ImgList,
  },
  props: {
    organ: Object,
    isAdd: Boolean,
  },
  data() {
    const testName = (rule, val, callback) => {
      const name = this.organInfo.contactInfoS['0'].name
      if (name) {
        callback()
      } else {
        callback(new Error('请输入名称'))
      }
    }
    const testAddress = (rule, val, callback) => {
      const address = this.organInfo.contactInfoS['0'].address
      if (address) {
        callback()
      } else {
        callback(new Error('请输入地址'))
      }
    }
    const testSex = (rule, val, callback) => {
      const sex = this.organInfo.contactInfoS['0'].sex
      if (sex) {
        callback()
      } else {
        callback(new Error('请选择性别'))
      }
    }
    const testIdCard = (rule, val, callback) => {
      const id = this.organInfo.contactInfoS['0'].idCard
      const validRes = validateIdCard(id)
      if (validRes.status === 1) {
        callback()
      } else {
        callback(new Error(validRes.msg))
      }
    }

    const testMobile = (rule, value, callback) => {
      const mobile = this.organInfo.contactInfoS['0'].mobile
      const validRes = isvalidMobile(mobile)
      if (!validRes) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      disabled: false,
      propertyOption: [
        {
          value: '1',
          label: '学校',
        },
        {
          value: '2',
          label: '教学点',
        },
      ],
      cooperationStutsOption: [
        {
          value: '1',
          label: '招生',
        },
        {
          value: '2',
          label: '学籍教务管理',
        },
      ],
      unitPropertyOption: [
        {
          value: '1',
          label: '事业单位',
        },
        {
          value: '2',
          label: '其他',
        },
      ],
      activeIndex: '0',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        cooperationStuts: [
          { required: true, message: '请选择合作状态', trigger: 'blur' },
        ],
        property: [
          { required: true, message: '请选择机构性质', trigger: 'blur' },
        ],
        unitProperty: [
          { required: true, message: '请选择依托单位性质', trigger: 'blur' },
        ],
        userLimit: [
          { required: true, message: '请输入用户数量限制', trigger: 'blur' },
        ],
        approveDate: [
          {
            required: true,
            message: '请选择行政部门审核时间',
            trigger: 'blur',
          },
        ],
        approveNo: [
          {
            required: true,
            message: '请输入行政部门批准文号',
            trigger: 'blur',
          },
        ],
        lastApproveDate: [
          {
            required: true,
            message: '请选择最近一次审核意见',
            trigger: 'blur',
          },
        ],
        lastApproveIdea: [
          {
            required: true,
            message: '请选择最近一次审核意见',
            trigger: 'blur',
          },
        ],
        lastContractDate: [
          {
            required: true,
            message: '请选择最近一次合同日期',
            trigger: 'blur',
          },
        ],
        contactsName: [{ validator: testName, trigger: 'blur' }],
        contactsIdCard: [{ validator: testIdCard, trigger: 'blur' }],
        contactsMobile: [{ validator: testMobile, trigger: 'blur' }],
        contactsAddress: [{ validator: testAddress, trigger: 'blur' }],
        contactsSex: [{ validator: testSex, trigger: 'blur' }],
      },
      organInfo: {},
    }
  },
  methods: {
    init() {
      // this.$refs.imgList
      this.organInfo = this.organ
        ? cloneDeep(this.organ)
        : this.createNewOrgan() || {}
      this.fileList =
        this.organInfo.unitCertUrl && !this.isAdd
          ? this.organInfo.unitCertUrl.split('&')
          : []
      // 新增需要清空上传照片缓存
      if (this.isAdd) this.$refs.imgList && (this.$refs.imgList.list = [])
      this.activeIndex = '0'
    },
    createNewOrgan() {
      return {
        approveDate: '', // 审批日期
        approveNo: '', // 批文号
        contactInfoS: [
          {
            address: '',
            contactType: '', // 负责人/法人2，招生办负责人，3学籍教务管理员，4财务管理员
            id: '',
            idCard: '',
            mobile: '',
            name: '',
            organId: '',
            phone: '',
            qq: '',
            sex: '1',
            weixin: '',
          },
        ],
        cooperationStuts: '', // 合作状态1,招生，2，学籍教务管理
        firstDate: '', // 首批学生入学日期
        itNum: 0, // 技术人数
        userLimit: 10, // 用户数量限制
        lastApproveDate: '', // 最近一次审核日期
        lastApproveIdea: '', // 最近一次审核意见
        lastContractDate: '', // 最近一次合同日期
        managerNum: 0, // 管理员人数
        name: '', // 名称
        oldName: '', // 曾名称
        otherNum: 0, // 其他人数
        property: '', // 属性
        teacherNum: 0, // 老师人数
        unitCertUrl: '', // 相关证件
        unitName: '', // 依赖单位名称
        unitProperty: '', // 依赖单位属性
      }
    },
    addNewContact(index) {
      return {
        address: '',
        contactType: index + 1 + '',
        id: '',
        idCard: '',
        mobile: '',
        name: '',
        organId: '',
        phone: '',
        qq: '',
        sex: '1',
        weixin: '',
      }
    },
    forceChange() {
      this.$forceUpdate()
    },
    tabsHandleClick({ name }) {
      const index = name
      this.organInfo.contactInfoS[index] =
        this.organInfo.contactInfoS[index] || this.addNewContact(index) || {}
    },
    save(callback) {
      this.submitForm(callback)
    },
    submitForm(callback, update) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.update(callback)
        } else {
          this.$message.warning('请填写完整信息')
        }
      })
    },

    clearValidate() {
      this.$refs['ruleForm'].clearValidate()
    },

    async update(callback) {
      // 上传图片
      const list = await this.$refs.imgList.uploadImg()
      this.organInfo.unitCertUrl = list.join('&')
      setTimeout(() => {
        this.$refs.imgList.clearFiles()
      }, 1000)
      if (this.isAdd) {
        api
          .addOrgan(this.organInfo)
          .then((res) => {
            console.log(res)
            if (res.data) {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              callback(true)
            } else {
              this.$message({
                message: '添加失败',
                type: 'error',
              })
              callback(false)
            }
          })
          .catch(() => {
            callback(false)
          })
      } else {
        api
          .updateOrgan(this.organInfo)
          .then((res) => {
            console.log(res)
            if (res.data) {
              this.$message({
                message: '更新成功',
                type: 'success',
              })
              callback(true)
            } else {
              this.$message({
                message: '更新失败',
                type: 'error',
              })
              callback(false)
            }
          })
          .catch(() => {
            callback(false)
          })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.situation {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
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
}
</style>
