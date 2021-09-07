<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <section>
        <div class="remote-title" v-bk-tooltips="{ content: tips, disabled: !tips, width: 290 }">
            <span :class="{ 'under-line': tips }">{{ title === undefined ? ((name === 'remoteOptions' ? '动态配置' : '远程函数')) : title }}</span>
            <span class="remote-example" @click="handleShowExample">数据示例</span>
        </div>
        <div class="remote-content">
            <select-func v-model="remoteData" @change="changeFunc"></select-func>
            <bk-button @click="getApiData" theme="primary" class="remote-button" size="small">获取数据</bk-button>
        </div>
        <bk-dialog
            v-model="isShow"
            :position="{ top: 100 }"
            render-directive="if"
            width="800"
            :title="'数据示例'"
            header-position="left"
            :mask-close="false"
            :show-footer="false"
            ext-cls="remote-example-dialog">
            <div class="remote-example-viewer" ref="remoteViewer"></div>
        </bk-dialog>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import selectFunc from '@/components/methods/select-func'
    import { bus } from '@/common/bus'
    import functionHelper from '@/components/methods/function-helper'

    export default {
        components: {
            selectFunc
        },
        props: {
            name: String,
            type: String,
            payload: {
                type: Object,
                default: () => ({})
            },
            defaultValue: {
                type: [Object, Array, Number, String]
            },
            change: {
                type: Function,
                default: () => {}
            },
            remoteValidate: {
                type: Function,
                default: () => {}
            },
            autoGetData: {
                type: Boolean,
                default: true
            },
            title: {
                type: String
            },
            tips: {
                type: String
            }
        },
        data () {
            return {
                remoteData: {
                    methodCode: '',
                    params: []
                },
                usedMethodMap: {},
                isShow: false,
                editor: {}
            }
        },
        computed: {
            ...mapGetters('functions', ['funcGroups']),
            ...mapGetters('drag', ['targetData']),
            ...mapGetters('variable', ['variableList'])
        },
        created () {
            this.remoteData = Object.assign({}, this.remoteData, this.payload)
            this.saveChange()
        },
        methods: {
            changeFunc () {
                this.saveChange()
                if (this.autoGetData) {
                    this.getApiData()
                }
            },

            saveChange () {
                this.change(this.name, this.defaultValue, this.type, JSON.parse(JSON.stringify(this.remoteData)))
            },

            getVariableVal (variable) {
                const { defaultValue, defaultValueType, valueType } = variable
                let value = defaultValueType === 0 ? defaultValue.all : defaultValue.stag
                if (valueType === 6) value = ''
                if (valueType === 0) value = `'${value}'`

                // 对象类型，加上 ()，让直接 . 引用属性不会报错
                if (valueType === 4) value = `(${value})`
                return value
            },

            processVarInFunParams (str, funcName) {
                return (str || '').replace(/\{\{([^\}]+)\}\}/g, (all, variableCode) => {
                    const curVar = this.variableList.find((variable) => (variable.variableCode === variableCode))
                    if (curVar) {
                        return this.getVariableVal(curVar)
                    } else {
                        throw new Error(`函数【${funcName}】里引用的变量【${variableCode}】不存在，请检查`)
                    }
                })
            },

            generateMethod (methodCode) {
                const firstMethod = this.getMethodByCode(methodCode)
                let funcStr = ''
                Object.values(this.usedMethodMap).forEach((method) => {
                    funcStr += this.getMethodStr(method)
                })
                const execParam = this.remoteData.params.map(x => x.value).filter(x => x).join(', ')
                funcStr += `return ${firstMethod.funcName}(${execParam})`
                return funcStr
            },

            getMethodStr (returnMethod) {
                const funcParams = (returnMethod.funcParams || []).join(', ')
                if (returnMethod.funcType === 1) {
                    const remoteParams = (returnMethod.remoteParams || []).join(', ')
                    const data = `{
                        url: '${this.processVarInFunParams(returnMethod.funcApiUrl, returnMethod.funcName)}',
                        type: '${returnMethod.funcMethod}',
                        apiData: ${this.processVarInFunParams(returnMethod.funcApiData, returnMethod.funcName) || "''"},
                        withToken: ${returnMethod.withToken}
                    }`
                    returnMethod.funcStr = `const ${returnMethod.funcName} = (${funcParams}) => { return this.$store.dispatch('getApiData', ${data}).then((${remoteParams}) => { ${returnMethod.funcBody} }) };`
                } else {
                    returnMethod.funcStr = `const ${returnMethod.funcName} = (${funcParams}) => { ${returnMethod.funcBody} };`
                }
                return returnMethod.funcStr
            },

            getMethodByCode (methodCode) {
                let returnMethod
                this.funcGroups.forEach((group) => {
                    const funChildren = group.functionList || []
                    const method = funChildren.find(x => x.funcCode === methodCode)
                    if (method) {
                        returnMethod = JSON.parse(JSON.stringify(method))
                    }
                })
                this.usedMethodMap[returnMethod.funcCode] = returnMethod
                returnMethod.funcBody = this.processFuncBody(returnMethod.funcName, returnMethod.funcBody)
                return returnMethod
            },

            processFuncBody (funcName, funcBody) {
                return functionHelper.replaceFuncKeyword(funcBody, (all, first, second, dirKey, funcStr, funcCode) => {
                    if (funcCode) {
                        const curFunc = this.usedMethodMap[funcCode] || this.getMethodByCode(funcCode)
                        if (curFunc.id) {
                            return `${curFunc.funcName}`
                        } else {
                            throw new Error(`函数【${funcName}】里引用的函数【${funcCode}】不存在，请检查`)
                        }
                    }
                    if (dirKey) {
                        const curVar = this.variableList.find((variable) => (variable.variableCode === dirKey))
                        if (curVar) return this.getVariableVal(curVar)
                        else throw new Error(`函数【${funcName}】里引用的变量【${dirKey}】不存在，请检查`)
                    }
                })
            },

            createSandBox () {
                const Fn = Function
                const global = Fn('return this')()
                const vm = this
                const createProxy = (context) => {
                    const proxy = new Proxy(context, {
                        set (target, p, value) {
                            target[p] = value
                            return true
                        },
                        get (target, p) {
                            switch (p) {
                                case 'document':
                                case 'window':
                                case 'global':
                                case 'self':
                                case 'globalThis':
                                    return proxy
                                case 'Function':
                                    return (...args) => Fn(...args).bind(proxy)
                                case 'eval':
                                    return code => Fn(`return ${code}`).bind(proxy)
                            }
                            if (!(p in target) && p in global) {
                                const value = global[p]
                                if (typeof value === 'function' && !value.prototype) return value.bind(global)
                                return value
                            }
                            if (!(p in target) && p in vm) {
                                const value = vm[p]
                                if (typeof value === 'function' && !value.prototype) return value.bind(vm)
                                return value
                            }
                            return target[p]
                        },
                        has () {
                            return true
                        }
                    })
                    return proxy
                }
                const context = createProxy({})
                const sandbox = (script) => {
                    const hasAwait = /await\s/.test(script)
                    const Fn = Function
                    const AsyncFunction = new Fn('return Object.getPrototypeOf(async function(){}).constructor')()
                    const createFunc = hasAwait ? AsyncFunction : Fn.constructor
                    return createFunc(
                        'context',
                        `
                        with (context) {
                            return (function() {
                                "use strict"
                                ${script}
                            }).bind(global)()
                        }
                        `
                    )(context)
                }
                sandbox.context = context
                sandbox.exec = sandbox
                return sandbox
            },

            async getApiData () {
                if (!this.remoteData.methodCode) {
                    this.$bkMessage({ theme: 'error', message: '请先选择函数', limit: 1 })
                    return
                }

                let methodStr
                try {
                    methodStr = this.generateMethod(this.remoteData.methodCode)
                } catch (error) {
                    this.$bkMessage({ theme: 'error', message: error.message || error || '函数格式有误，请修改后再试', limit: 1 })
                    return
                }

                try {
                    const sandBox = this.createSandBox()
                    const res = await sandBox.exec(methodStr, this.remoteData.params)
                    let message = this.remoteValidate(res)
                    if (message) {
                        message = '数据源设置成功，以下问题可能会导致组件表现异常，请检查：' + message
                        this.$bkMessage({ theme: 'warning', message })
                    } else {
                        this.change(this.name, res, this.type, JSON.parse(JSON.stringify(this.remoteData)))
                        if (this.name === 'remoteOptions') {
                            bus.$emit('update-chart-options', res)
                        }
                        this.$bkMessage({ theme: 'success', message: '获取数据成功', limit: 1 })
                    }
                } catch (error) {
                    this.$bkMessage({ theme: 'error', message: error.message || error || '获取数据失败，请检查函数是否正确', limit: 1 })
                }
            },

            handleShowExample () {
                this.isShow = true
                this.$nextTick(() => {
                    this.initMonaco()
                })
            },
            getDefaultData () {
                let defaultData
                switch (this.name) {
                    case 'initFormData':
                        defaultData = { string: '', boolean: false, array: [1, 2, 3] }
                        break
                    default:
                        let dataString
                        try {
                            dataString = JSON.stringify(this.defaultValue)
                        } catch (e) {
                            dataString = JSON.stringify(this.defaultValue, function (key, value) {
                                if (key === 'parent') {
                                    return
                                }
                                return value
                            })
                        }
                        defaultData = JSON.parse(dataString)
                        break
                }
                return JSON.stringify(defaultData, null, '\t')
            },
            initMonaco () {
                monaco.editor.defineTheme('remote-viewer', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [{ background: '#242424' }],
                    colors: {
                        'editor.background': '#242424'
                    }
                })

                const value = this.getDefaultData()
                this.editor = monaco.editor.create(this.$refs.remoteViewer, {
                    value: value,
                    theme: 'remote-viewer',
                    readOnly: true,
                    fontSize: 14,
                    fontFamily: 'Consolas',
                    cursorBlinking: 'solid',
                    automaticLayout: true,
                    minimap: {
                        enabled: false // 关闭小地图
                    }
                })
            }
        }
    }
</script>

<style lang="postcss">
    .remote-title {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        line-height: 24px;
        font-size: 12px;
        &:first-child {
            margin-top: 0;
        }
    }
    .under-line {
        line-height: 24px;
        border-bottom: 1px dashed #979ba5;
    }
    .remote-example{
        color: #3a84ff;
        cursor: pointer;
    }
    .form-title {
        font-weight: bold;
        color: #63656E;
        height:22px;

        .form-tip{
            font-weight: normal;
            color: #979ba5;
        }
    }

    .remote-example-viewer{
        height: 403px;
    }
    .remote-content {
        background: #f0f1f5;
        .remote-button {
            margin: 0 0 10px 6px;
        }
    }
</style>
