import api from '@/webapi/api'

export default {
    // 获取所有的列表
    getRolesList() {
        return api.get('/roles')
    },

    // 删除权限（一级 or 二级 or 三级权限）
    deleteRights(roleId, rightId) {
        return api.delete(`/roles/${roleId}/rights/${rightId}`)
    },

    // 获取所有的权限列表
    getRightsList(type) {
        return api.get(`/rights/${type}`)
    },

    // 给角色分配权限
    insertRights(roleId, str) {
        return api.post(`/roles/${roleId}/rights`, {rids: str})
    },
}