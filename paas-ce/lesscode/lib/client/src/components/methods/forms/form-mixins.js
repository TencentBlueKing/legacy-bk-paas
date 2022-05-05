import { getDefaultFunction } from 'shared/function'

import formMarket from './form-items/market.vue'
import formName from './form-items/name.vue'
import formCode from './form-items/code.vue'
import formGroup from './form-items/group.vue'
import formDetail from './form-items/detail.vue'
import formMonaco from './form-items/monaco.vue'
import formProject from './form-items/project.vue'
import formApiData from './form-items/api-data.vue'
import formSummary from './form-items/summary.vue'

const defaultForm = getDefaultFunction()

export default {
    components: {
        formMarket,
        formName,
        formCode,
        formGroup,
        formDetail,
        formMonaco,
        formProject,
        formApiData,
        formSummary
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
            handler (val = {}) {
                const copyForm = JSON.parse(JSON.stringify(val), (a, b) => {
                    if (b !== undefined && b !== null) return b
                })
                Object.assign(this.form, defaultForm, copyForm)
                this.formChanged = false
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
                return this.form
            })
        },

        clearError () {
            const refComponents = this.$refs || {}
            const componentKeys = Object.keys(refComponents)
            componentKeys.forEach((key) => this.$refs[key] && this.$refs[key].clearError())
        }
    }
}
