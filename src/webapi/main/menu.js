import api from '../api'

export default {
  // 获取所有的菜单
  getMainMenus () {
    return api.get('/menus')
  }
}
