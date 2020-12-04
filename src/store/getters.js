const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  organList: state => state.app.organList,
  schoolList: state => state.app.schoolList,
  teacherList: state => state.app.teacherList,
  schoolOrgansList: state => state.app.schoolOrgansList,
  schoolYearOptions: state => state.app.schoolYearOptions,
  yearAndSemester: state => state.app.yearAndSemester,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userOrganId: state => state.user.organId,
  property: state => state.user.property,
  name: state => state.user.name,
  roles: state => state.user.roles,
  menu: state => state.menu,
  menuArr: state => state.menu.menuArr,
  menuList: state => state.menu.menuList,
  visitedViews: state => state.tags.visitedViews,
  cachedViews: state => state.tags.cachedViews,
  identificationList: state => state.app.identificationList
}
export default getters
