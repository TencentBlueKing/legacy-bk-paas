import formMarket from './form-items/market.vue'
import formName from './form-items/name.vue'
import formCode from './form-items/code.vue'
import formCategory from './form-items/category.vue'
import formDetail from './form-items/detail.vue'
import formMonaco from '../monaco-func.vue'
import formProject from './form-items/project.vue'

const defaultForm = {
    projectId: '',
    funcName: '',
    funcCode: '',
    funcGroupId: '',
    funcType: 0,
    funcParams: [],
    remoteParams: [],
    withToken: 0,
    funcApiUrl: '',
    funcMethod: 'get',
    funcApiData: '',
    funcSummary: '',
    funcBody: '',
    id: undefined
}

export default {
    components: {
        formMarket,
        formName,
        formCode,
        formCategory,
        formDetail,
        formMonaco,
        formProject
    },

    props: {
        funcData: Object
    },

    data () {
        return {
            form: Object.assign({}, defaultForm),
            formChanged: false
        }
    },

    watch: {
        funcData: {
            handler (val) {
                const copyForm = JSON.parse(JSON.stringify(val), (a, b) => {
                    if (b !== undefined && b !== null) return b
                })
                Object.assign(this.form, defaultForm, copyForm)
                this.formChanged = !this.form.id
                this.clearError()
            },
            immediate: true,
            deep: true
        }
    },

    methods: {
        validate () {
            const refComponents = this.$refs || {}
            const componentKeys = Object.keys(refComponents)
            return Promise.all(componentKeys.map((key) => this.$refs[key] && this.$refs[key].validate())).then(() => {
                this.formChanged = false
                return this.form
            })
        },

        clearError () {
            const refComponents = this.$refs || {}
            const componentKeys = Object.keys(refComponents)
            componentKeys.map((key) => this.$refs[key] && this.$refs[key].clearError())
        }
    }
}
