<template>
    <monaco
        :value.sync="copyForm.funcBody"
        :height="height"
        @change="change">
        <template v-slot:tools>
            <i class="bk-drag-icon bk-drag-fix icon-style" @click="fixMethod" v-bk-tooltips="fixMethodTips"></i>
            <slot name="tools"></slot>
        </template>
    </monaco>
</template>

<script>
    import monaco from '../../monaco.vue'
    import mixins from './form-item-mixins'
    import { mapActions } from 'vuex'
    import { bus } from '@/common/bus'

    const defaultMultVal = {
        0: '/**\r\n'
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
        1: '/**\r\n'
            + '* 1. 远程函数，系统将会根据参数组成 Ajax 请求，由用户在这里编写 Ajax 回调函数\r\n'
            + '* 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n'
            + '* 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n'
            + '* 4. 用于事件时：事件触发时候，系统将发起 Ajax 请求，然后执行用户编写的回调函数\r\n'
            + '* 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n'
            + '* 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n'
            + '* 7. 例如 Api 返回数据使用参数 res 接收，则代码示例如下：return res.data\r\n'
            + '*/\r\n'
    }

    export default {
        components: {
            monaco
        },

        mixins: [mixins],

        props: {
            height: {
                type: [Number, String],
                default: 458
            }
        },

        data () {
            return {
                fixMethodTips: {
                    content: '自动修复 Eslint',
                    theme: 'light',
                    placements: ['top'],
                    appendTo: 'parent',
                    boundary: 'window'
                },
                multVal: {
                    ...defaultMultVal
                }
            }
        },

        watch: {
            'copyForm.funcType': {
                handler (type) {
                    this.change(this.multVal[type])
                }
            }
        },

        created () {
            bus.$on('switch-fun-form', this.initMultVal)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('switch-fun-form', this.initMultVal)
            })
            this.initMultVal()
        },

        methods: {
            ...mapActions('functions', ['fixFunByEslint']),

            initMultVal (func = this.copyForm) {
                this.multVal = {
                    ...defaultMultVal,
                    [func.funcType]: func.funcBody
                }
            },

            fixMethod () {
                this.fixFunByEslint(this.copyForm).then((res = {}) => {
                    const { code, message } = res.data || {}
                    if (code) {
                        this.change(code)
                    }
                    if (message) {
                        this.messageHtmlError(message)
                    } else {
                        this.messageSuccess('函数修复成功')
                    }
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            change (val) {
                this.multVal[this.copyForm.funcType] = val
                this.updateValue('funcBody', val)
            }
        }
    }
</script>
