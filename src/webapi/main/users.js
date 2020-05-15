import api from '@/webapi/api'

export default {
  // 获取所有的用户（分页查询）
  getUsers (data) {
    return api.get('/users', { params: data })
  },

  // 改变用户状态
  changeUserStatus (data) {
    return api.put(`/users/${data.uid}/state/${data.type}`)
  },

  // 添加用户
  insertUser (data) {
    return api.post('/users', data)
  },

  // 根据用户id查询用户信息
  queryUserById (id) {
    return api.get(`/users/${id}`)
  },

  // 修改用户
  updateUser (id, data) {
    return api.put(`/users/${id}`, data)
  },

  // 删除用户
  deleteUser(id) {
    return api.delete(`/users/${id}`)
  },

  // 修改用户的权限
  updateUserRole(id, roleId) {
    return api.put(`/users/${id}/role`, {rid: roleId})
  },
}
