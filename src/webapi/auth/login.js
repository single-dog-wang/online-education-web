import api from '../api'

export default {
  // 登录
  loginByPassword (data) {
    return api.post('/login', data)
  }
}
