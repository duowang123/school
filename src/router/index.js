import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/views/layout/Layout'
export const asyncRouterMap = [
  {
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    // 当菜单文件中没有该页面配置时，在标签栏显示的就是这里配置的标题
    meta: { title: '首页' }
  },
  // 总院
  {
    path: 'headquarters',
    component: () => import('@/views/headquarters'),
    children: [
      {
        path: 'info',
        component: () => import('@/views/headquarters/info'),
        meta: { requireAuth: true }
      },
      {
        path: 'roles',
        component: () => import('@/views/headquarters/roles'),
        meta: { requireAuth: true }
      },
      {
        path: 'users',
        component: () => import('@/views/headquarters/users'),
        meta: { requireAuth: true }
        // children: [{
        //   path: 'add',
        //   component: () => import('@/views/addOrganUser'),
        //   meta: { requireAuth: true }
        // }]
      }
    ]
  },
  // 专业及课程
  {
    path: 'majorCourses',
    component: () => import('@/views/majorCourses'),
    children: [
      // 学院专业信息
      {
        path: 'specialityInfo',
        component: () => import('@/views/majorCourses/specialityInfo'),
        meta: { requireAuth: true }
      },
      // 课程信息（总院）
      {
        path: 'courseInfo',
        component: () => import('@/views/majorCourses/courseInfo'),
        meta: { requireAuth: true }
      },
      // 教学计划（机构）
      {
        path: 'teachProgram',
        component: () => import('@/views/majorCourses/teachProgram'),
        meta: { requireAuth: true }
      },
      // 选课信息
      {
        path: 'selcourseInfo',
        component: () => import('@/views/majorCourses/selcourseInfo'),
        meta: { requireAuth: true }
      },
      // 选课总览
      {
        path: 'selcourseOverview',
        component: () => import('@/views/majorCourses/selcourseOverview'),
        meta: { requireAuth: true }
      },
      // 学生平时成绩
      {
        path: 'usualScores',
        component: () => import('@/views/majorCourses/usualScores'),
        meta: { requireAuth: true }
      }
    ]
  },
  // 机构
  {
    path: 'campus',
    component: () => import('@/views/campus'),
    children: [
      {
        path: 'manage',
        component: () => import('@/views/campus/manage'),
        meta: { requireAuth: true }
      },
      {
        path: 'roles',
        component: () => import('@/views/campus/roles'),
        meta: { requireAuth: true }
      },
      {
        path: 'users',
        component: () => import('@/views/campus/users'),
        meta: { requireAuth: true }
      }
    ]
  },
  // 学生
  {
    path: 'stu',
    component: () => import('@/views/stu'),
    children: [
      {
        path: 'plan',
        component: () => import('@/views/stu/plan/manage'),
        meta: { requireAuth: true }
      },
      {
        path: 'right',
        component: () => import('@/views/stu/plan/right'),
        meta: { requireAuth: true }
      },
      {
        // 报名清单
        path: 'admit',
        component: () => import('@/views/stu/admissions/admit'),
        meta: { requireAuth: true }
      },
      {
        path: 'apply',
        component: () => import('@/views/stu/admissions/apply'),
        meta: { requireAuth: true }
      },
      // 学籍管理
      {
        path: 'student',
        component: () => import('@/views/stu/schoolroll/manage'),
        meta: { requireAuth: true },
      },
      // 学籍异动
      {
        path: 'trasaction',
        component: () => import('@/views/stu/schoolroll/trasaction'),
        meta: { requireAuth: true }
      },
      //异动审核
      {
        path: 'code',
        component: () => import('@/views/stu/schoolroll/code'),
        meta: { requireAuth: true }
      },
      // 照片管理
      {
        path: 'photo',
        component: () => import('@/views/stu/schoolroll/photo'),
        meta: { requireAuth: true }
      },
      // 免修免考申请
      {
        path: 'exemptionApplication',
        component: () => import('@/views/stu/discount/exemptionApplication'),
        meta: { requireAuth: true }
      },
      // 免修免考审核
      {
        path: 'exemptionCode',
        component: () => import('@/views/stu/discount/exemptionCode'),
        meta: { requireAuth: true }
      },
      // 学分优惠申请
      {
        path: 'creditApply',
        component: () => import('@/views/stu/discount/creditApply'),
        meta: { requireAuth: true }
      },
      // 学分优惠审核
      {
        path: 'creditCode',
        component: () => import('@/views/stu/discount/creditCode'),
        meta: { requireAuth: true }
      }
    ]
  },
  // 财务
  {
    path: 'finance',
    component: () => import('@/views/finance'),
    children: [
      {
        // 学分标准
        path: 'credit',
        component: () => import('@/views/finance/standard/credit'),
        meta: { requireAuth: true }
      },
      {
        // 专业标准
        path: 'major',
        component: () => import('@/views/finance/standard/major'),
        meta: { requireAuth: true }
      },
      {
        // 学费收费查询
        path: 'paylog',
        component: () => import('@/views/finance/manage/paylog'),
        meta: { requireAuth: true }
      },
      {
        // 学生应学费查询
        path: 'payable',
        component: () => import('@/views/finance/manage/payable'),
        meta: { requireAuth: true }
      },
      {
        // 学习中心收费汇总
        path: 'charge',
        component: () => import('@/views/finance/manage/charge'),
        meta: { requireAuth: true }
      },
      {
        // 学习中心欠费统计
        path: 'arrears',
        component: () => import('@/views/finance/manage/arrears'),
        meta: { requireAuth: true }
      },
      {
        // 学生减免查询
        path: 'reduce',
        component: () => import('@/views/finance/refund/reduce'),
        meta: { requireAuth: true }
      },
      {
        // 退费查询
        path: 'payback',
        component: () => import('@/views/finance/refund/payback'),
        meta: { requireAuth: true }
      }
    ]
  },

  //首页管理
  {
    path: 'homepage',
    component: () => import('@/views/homepage'),
    children: [
      {
        path: 'adv',
        component: () => import('@/views/homepage/adv'),
        children: [
          {
            path: 'pc',
            component: () => import('@/views/homepage/adv/pc'),
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: 'zone',
        component: () => import('@/views/homepage/zone'),
        children: [
          {
            path: 'pc',
            component: () => import('@/views/homepage/zone/pc'),
            meta: { requireAuth: true }
          },
          {
            path: 'course',
            meta: { title: '专区课程' },
            component: () => import('@/views/homepage/zone/course')
          }
        ]
      },
      {
        path: 'website',
        component: () => import('@/views/homepage/website'),
        children: [
          {
            path: 'navBar',
            component: () => import('@/views/homepage/website/navBar'),
            meta: { requireAuth: true }
          },
          {
            path: 'websiteLink',
            component: () => import('@/views/homepage/website/websiteLink'),
            meta: { requireAuth: true }
          },
          {
            path: 'websiteNav',
            component: () => import('@/views/homepage/website/websiteNav'),
            meta: { requireAuth: true }
          },
          {
            path: 'websiteNavArticle',
            component: () => import('@/views/homepage/website/websiteNavArticle'),
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  },
  //课程管理
  {
    path: 'course',
    component: () => import('@/views/course'),
    children: [
      {
        path: 'course',
        component: () => import('@/views/course/course'),
        children: [
          {// 课程列表
            path: 'course',
            component: () => import('@/views/course/course/course'),
            meta: { requireAuth: true }
          },
          {
            // 课程审核列表
            path: 'audit',
            component: () => import('@/views/course/course/audit'),
            meta: { requireAuth: true }
          }
        ]
      },
      {
        path: 'category',
        component: () => import('@/views/course/category'),
        children: [
          {
            // 课程分类列表
            path: 'category',
            component: () => import('@/views/course/category/category'),
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  },
  //系统管理
  {
    path: 'sys',
    component: () => import('@/views/sys'),
    children: [
      {
        // 权限管理
        path: 'pms',
        component: () => import('@/views/sys/pms'),
        children: [
          {
            // 用户管理
            path: 'user',
            component: () => import('@/views/sys/pms/user'),
            meta: { requireAuth: true }
          },
          {
            // 角色管理
            path: 'role',
            component: () => import('@/views/sys/pms/role'),
            meta: { requireAuth: true }
          },
          {
            // 菜单管理
            path: 'menu',
            component: () => import('@/views/sys/pms/menu'),
            meta: { requireAuth: true }
          },
          {
            // 字典管理
            path: 'dict',
            component: () => import('@/views/sys/pms/dict'),
            meta: { requireAuth: true }
          }
        ]
      },
      {// 消息管理
        path: 'msg',
        component: () => import('@/views/sys/msg'),
        children: [
          {
            // 消息管理
            path: 'template',
            component: () => import('@/views/sys/msg/template'),
            meta: { requireAuth: true }
          },
          {
            // 用户消息
            path: 'msgUser',
            component: () => import('@/views/sys/msg/msgUser'),
            meta: { requireAuth: true }
          },
          {
            // 站点消息
            path: 'msg',
            component: () => import('@/views/sys/msg/msg'),
            meta: { requireAuth: true }
          }
        ]
      },
      {// 站点管理
        path: 'website',
        component: () => import('@/views/sys/website'),
        children: [
          {
            // 站点设置
            path: 'website',
            component: () => import('@/views/sys/website/website'),
            meta: { requireAuth: true }
          },
          {
            // 系统设置
            path: 'sys',
            component: () => import('@/views/sys/website/sys'),
            meta: { requireAuth: true }
          }
        ]
      },
      {// 平台管理
        path: 'platform',
        component: () => import('@/views/sys/platform'),
        children: [
          {
            // 应用管理
            path: 'platform',
            component: () => import('@/views/sys/platform/platform'),
            meta: { requireAuth: true }
          }
        ]
      },
      {// 日志查看
        path: 'log',
        component: () => import('@/views/sys/log'),
        children: [
          {
            // 系统操作日志
            path: 'sys',
            component: () => import('@/views/sys/log/sys'),
            meta: { requireAuth: true }
          },
          {
            // 支付日志
            path: 'orderPay',
            component: () => import('@/views/sys/log/orderPay'),
            meta: { requireAuth: true }
          }
        ]
      }
    ]
  },
  // 系统消息
  {
    path: 'sysNotice',
    component: () => import('@/views/sysNotice'),
    children: [
      {
        // 公告
        path: 'notice',
        component: () => import('@/views/sysNotice/notice/index'),
        meta: { requireAuth: true }
      },
    ]
  },
  // 考务
  {
    path: 'exam',
    component: () => import('@/views/exam'),
    children: [
      {
        // 题库管理
        path: 'question',
        component: () => import('@/views/exam/question'),
        meta: { requireAuth: true }
      },
      {
        // 试卷管理
        path: 'test-paper',
        component: () => import('@/views/exam/testPaper'),
        meta: { requireAuth: true }
      },
      {
        // 考点
        path: 'test-center',
        component: () => import('@/views/exam/testCenter'),
        meta: { requireAuth: true }
      },
      {
        // 考场
        path: 'room',
        component: () => import('@/views/exam/room'),
        meta: { requireAuth: true }
      },
      {
        // 考试计划
        path: 'plan',
        component: () => import('@/views/exam/plan'),
        meta: { requireAuth: true }
      },
      {
        // 重考课程管理
        path: 're-test',
        component: () => import('@/views/exam/reTest'),
        meta: { requireAuth: true }
      },
      {
        // 重考课程审批
        path: 're-test-approve',
        component: () => import('@/views/exam/reTestApprove'),
        meta: { requireAuth: true }
      },
      {
        // 停开课程补考管理
        path: 'stop-test',
        component: () => import('@/views/exam/stopTest'),
        meta: { requireAuth: true }
      },
      {
        // 停开课程补考审批
        path: 'stop-test-approve',
        component: () => import('@/views/exam/stopTestApprove'),
        meta: { requireAuth: true }
      },
      {
        // 考试成绩查询
        path: 'test-score',
        component: () => import('@/views/exam/testScore'),
        meta: { requireAuth: true }
      },
      {
        // 巡考员安排
        path: 'inspector',
        component: () => import('@/views/exam/inspector'),
        meta: { requireAuth: true }
      },
      {
        // 巡考安排
        path: 'inspection',
        component: () => import('@/views/exam/inspection'),
        meta: { requireAuth: true }
      },
      {
        // 考辅人员管理
        path: 'coach',
        component: () => import('@/views/exam/coach'),
        meta: { requireAuth: true }
      },
      {
        // 考务小组管理
        path: 'group',
        component: () => import('@/views/exam/group'),
        meta: { requireAuth: true }
      },
      {
        // 监考人员分配
        path: 'invigilator',
        component: () => import('@/views/exam/invigilator'),
        meta: { requireAuth: true }
      },
      {
        // 缺考作弊管理
        path: 'cheat',
        component: () => import('@/views/exam/cheat'),
        meta: { requireAuth: true }
      }
    ]
  }
]

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index') },
  { path: '*', component: () => import('@/views/404') },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard', // 设置登陆系统默认页面
    children: [
      { path: 'iframe', component: () => import('@/views/iframe/index') },
      { path: 'redirect/:path*', component: () => import('@/views/redirect/index') },
      ...asyncRouterMap
    ]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
