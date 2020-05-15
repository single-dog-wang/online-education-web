import api from '@/webapi/api'

export default {
    // 获取权限列表
    getRightsList(type) {
        return api.get(`/rights/${type}`)
    },
}