// select、multiselect、checkbox、radio 组件支持配置表单数据源
// 数据源类型分为 custom（用户手动输入）、api（第三方系统接口返回）、worksheet（其他表单字段）
export default {
    props: {
        useFixedDataSource: { // 使用静态数据，不通过接口请求远程数据源
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            sourceDataLoading: false, // 数据源loading
            sourceData: [], // 表单数据源数据
            isOpenApi: ''
        }
    },
    created () {
        this.setSourceData()
    },
    methods: {
        setSourceData () {
            if (this.field.source_type === 'CUSTOM' || this.useFixedDataSource) {
                this.sourceData = this.field.choice
            } else if (this.field.source_type === 'API') {
                this.setApiData()
            } else if (this.field.source_type === 'WORKSHEET') {
                this.setWorksheetData()
            }
        },
        async setApiData () {
            try {
                this.sourceDataLoading = true
                const { id, api_info, api_instance_id, kv_relation } = this.field
                const params = {
                    id,
                    api_instance_id,
                    kv_relation,
                    api_info: {
                        api_instance_info: api_info,
                        remote_api_info: api_info.remote_api_info
                    }
                }
                const resp = await this.$store.dispatch('formSetting/getSourceData', params)
                this.sourceData = resp.data.map((item) => {
                    const { key, name } = item
                    return { key, name }
                })
                this.sourceDataLoading = false
            } catch (e) {
                console.error(e)
            }
        },
        async setWorksheetData () {
            try {
                this.sourceDataLoading = true
                const { field, conditions } = this.field.meta.data_config
                let params
                if (!conditions.connector && !conditions.expressions.every(i => i)) {
                    params = {
                        token: this.field.token,
                        fields: [field],
                        conditions: {}
                    }
                } else {
                    params = {
                        token: this.field.token,
                        fields: [field],
                        conditions
                    }
                }
                const resp = await this.$store.dispatch('formSetting/getWorksheetData', params)
                this.sourceData = resp.data.map((item) => {
                    const val = item[field]
                    return { key: val, name: val }
                })
                this.sourceDataLoading = false
            } catch (e) {
                console.error(e)
            }
        }
    }
}
