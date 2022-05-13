import http from '@/api'
import regexList from '@/components/render-nocode/common/regexlist.json'
export default {
    namespaced: true,
    state: {
        fieldsList: []
    },
    mutations: {
        setFieldsList (state, fieldsList) {
            state.fieldsList = fieldsList || []
        }
    },
    getters: {
    },
    actions: {
        // 获取字段的校验方式
        getRegexList (_, params) {
            // return http.get('/workflow/templates/get_regex_choice/', { params }).then(response => response.data)\
            return new Promise(resolve => resolve(regexList))
        },
        // 获取第三方接口数据
        getSourceData (_, params) {
            return http.post('/ticket/receipts/api_field_choices/', params).then(response => response.data)
        },
        // 根据条件查询表单数据
        getWorksheetData (_, params) {
            return http.post('/engine/data/worksheet_data/', params).then(response => response.data)
        }
    }
}
