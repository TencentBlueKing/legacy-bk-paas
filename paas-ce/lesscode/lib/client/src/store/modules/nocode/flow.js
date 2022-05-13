import http from '@/api'

export default {
    namespaced: true,
    actions: {
        // 获取项目下流程列表
        getFlowList (state, params) {
            debugger
            return http.get('', { params }).then(response => response.data)
        },
        // 创建流程
        createFlow (state, params) {
            return http.post('', params).then(response => response.data)
        }
    }
}
