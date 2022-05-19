import http from '@/api'
export default {
    namespaced: true,
    state: {
    },
    mutations: {
    },
    getters: {
    },
    actions: {
        // 导出列表组件的数据
        exportData (_, params) {
            return http.post('/engine/data/export_list_component_data/', params, { responseType: 'arraybuffer' }).then(respond => respond.data)
        }
    }
}
