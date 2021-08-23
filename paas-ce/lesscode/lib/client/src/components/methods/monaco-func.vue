<template>
    <monaco v-bind="$props" class="monaco-func" @change="change">
        <template v-slot:tools>
            <i class="bk-icon icon-info-circle icon-style" v-bk-tooltips="methodTip()"></i>
            <i class="bk-drag-icon bk-drag-fix icon-style" @click="fixMethod" v-bk-tooltips="fixMethodTips"></i>
            <slot name="tools"></slot>
        </template>
    </monaco>
</template>

<script>
    import monaco from './monaco.vue'
    import { mapActions } from 'vuex'

    export default {
        components: {
            monaco
        },
        props: {
            value: String,
            width: {
                type: [String, Number],
                default: 'auto'
            },
            height: {
                type: [String, Number],
                default: 320
            },
            options: Object,
            func: {
                type: Object
            },
            title: String
        },
        data () {
            return {
                fixMethodTips: {
                    content: '自动修复 Eslint',
                    theme: 'light',
                    placements: ['top'],
                    appendTo: 'parent',
                    boundary: 'window'
                }
            }
        },
        methods: {
            ...mapActions('functions', ['fixFunByEslint']),

            methodTip () {
                const commentMap = {
                    0: ` 1. 空白函数，函数内容完全由用户编写\r\n 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n 4. 用于事件时：函数将在事件触发时执行\r\n 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n 7. 用于属性时示例如下：\r\n    return Promise.all([\r\n        this.$http.get(\'${location.origin}/api/data/getMockData\'),\r\n        this.$http.post(\'${location.origin}/api/data/postMockData\', { value: 2 })\r\n    ]).then(([getDataRes, postDataRes]) => {\r\n        return [...getDataRes.data, ...postDataRes.data]\r\n    })\r\n`,
                    1: ` 1. 远程函数，系统将会根据参数组成 Ajax 请求，由用户在这里编写 Ajax 回调函数\r\n 2. 这里编辑管理的函数，用于画布页面的属性配置和事件绑定\r\n 3. 用于属性时：函数需要返回值，该返回值将会赋值给属性\r\n 4. 用于事件时：事件触发时候，系统将发起 Ajax 请求，然后执行用户编写的回调函数\r\n 5. 可以使用 lesscode.变量标识，必须通过编辑器自动补全功能选择对应变量，来获取或者修改变量值\r\n 6. 可以使用 lesscode.方法名，必须通过编辑器自动补全功能选择对应函数，来调用项目中的函数\r\n 7. 示例如下：return res.data`
                }
                return {
                    placement: 'top-start',
                    theme: 'light',
                    content: `<pre class="component-method-tip">${commentMap[+this.func.funcType]}</pre>`,
                    appendTo: 'parent',
                    boundary: 'window'
                }
            },

            fixMethod () {
                this.fixFunByEslint(this.func).then((res = {}) => {
                    const { code, message } = res.data || {}
                    if (code) this.$emit('update:value', code)
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
                this.$emit('update:value', val)
                this.$emit('change', val)
            }
        }
    }
</script>

<style lang="postcss">
    .component-method-tip {
        font-family: Consolas;
        font-weight: normal;
        font-size: 12px;
        font-feature-settings: "liga" 0, "calt" 0;
        line-height: 16px;
        letter-spacing: 0px;
    }
</style>
