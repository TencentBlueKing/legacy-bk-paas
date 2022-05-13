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
        },
        restFieldList (state) {
            state.fieldsList = []
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
        },
        // 获取第三方系统列表
        getRemoteSystem () {
            return http.get('/postman/remote_system/').then(response => response.data)
        },
        // 获取特定第三方系统api列表
        getSystemApis (_, params) {
            return http.get('/postman/remote_api/', { params }).then(response => response.data)
        },
        // 获取节点变量列表
        getNodeVars (_, params) {
            return http.get(`/workflow/states/${params.state}/variables/`, { params }).then(response => response.data)
        },
        //  获取对某个应用授权的应用
        getProjectGranted (_, params) {
            return http.get('/project/project_white/get_project_granted_by/', { params }).then(response => response.data)
        },
        // 获取表单列表
        getFormList (_, params) {
            return http.get('/worksheet/sheets/', { params }).then(response => response.data)
        },
        // 获取表单字段列表
        getFormFields (_, formId) {
            const params = { worksheet_id: formId }
            return http.get('/worksheet/fields/', { params }).then(response => response.data)
        }
    }
}
