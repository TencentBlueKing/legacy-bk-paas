import { bus } from '@/common/bus'

import formMarket from './form-items/market.vue'
import formName from './form-items/name.vue'
import formCode from './form-items/code.vue'
import formCategory from './form-items/category.vue'
import formDetail from './form-items/detail.vue'
import formMonaco from './form-items/monaco.vue'
import formProject from './form-items/project.vue'
import formApiData from './form-items/api-data.vue'
import formSummary from './form-items/summary.vue'

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
    funcBody: '/**\r\n'
    + '* 1. 空白函数，函数内容完全由用户编写\r\n'
    + '* 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n'
    + '* 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n'
    + '* 4. 用于事件时：函数将在事件触发时执行\r\n'
    + '* 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n'
    + '* 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n'
    + '* 7. 用于属性时示例如下：\r\n'
    + '* return Promise.all([\r\n'
    + `*     this.$http.get('${location.origin}/api/data/getMockData'),\r\n`
    + `*     this.$http.post('${location.origin}/api/data/postMockData', { value: 2 })\r\n`
    + '* ]).then(([getDataRes, postDataRes]) => {\r\n'
    + '*     return [...getDataRes.data, ...postDataRes.data]\r\n'
    + '* })\r\n'
    + '*/\r\n',
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
            handler (val) {
                const copyForm = JSON.parse(JSON.stringify(val), (a, b) => {
                    if (b !== undefined && b !== null) return b
                })
                Object.assign(this.form, defaultForm, copyForm)
                this.formChanged = !this.form.id
                this.clearError()
                console.log('from funcData change switch-fun-form')
                bus.$emit('switch-fun-form', this.form)
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
            componentKeys.forEach((key) => this.$refs[key] && this.$refs[key].clearError())
        }
    }
}
