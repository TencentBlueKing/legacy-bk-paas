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
        <div
            class="remote-title"
            v-bk-tooltips="{
                content: tips,
                disabled: !tips,
                width: 290
            }">
            <span :class="{ 'under-line': tips }">
                {{ title === undefined ? ((name === 'remoteOptions' ? '动态配置' : '远程函数')) : title }}
            </span>
            <span
                class="remote-example"
                @click="handleShowExample">
                数据示例
            </span>
        </div>
        <div class="remote-content">
            <choose-function
                :choosen-function="remoteData"
                @change="changeFunc"
            ></choose-function>
            <bk-button
                @click="getApiData"
                theme="primary"
                class="mt10"
                size="small">
                获取数据
            </bk-button>
        </div>
        <remote-example
            ref="example"
            :data="exampleData" />
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import ChooseFunction from '@/components/methods/choose-function/index.vue'
    import { bus } from '@/common/bus'
    import { replaceFuncKeyword, replaceFuncParam } from 'shared/function'
    import { VARIABLE_TYPE, VARIABLE_VALUE_TYPE } from 'shared/variable'
    import remoteExample from './remote-example'

    export default {
        components: {
            ChooseFunction,
            remoteExample
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
                default: () => {
                }
            },
            remoteValidate: {
                type: Function,
                default: () => {
                }
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
                usedVariableMap: {}
            }
        },
        computed: {
            ...mapGetters('functions', ['functionList']),
            ...mapGetters('variable', ['variableList']),
            exampleData () {
                return { name: this.name, value: this.defaultValue }
            }
        },
        created () {
            this.remoteData = Object.assign({}, this.remoteData, this.payload)
        },
        methods: {
            changeFunc (val) {
                this.remoteData = Object.assign({}, val)
                this.change(this.name, this.defaultValue, this.type, val)
                if (this.autoGetData) {
                    this.getApiData()
                }
            },

            getVariableVal (variable) {
                const copyVariable = JSON.parse(JSON.stringify(variable))
                const { defaultValue, defaultValueType, valueType } = copyVariable
                let value = defaultValueType === VARIABLE_VALUE_TYPE.SAME ? defaultValue.all : defaultValue.stag
                // 计算变量，赋为空值
                if (valueType === VARIABLE_TYPE.COMPUTED.VAL) {
                    value = ''
                }
                // 对象类型，解析为object
                if (valueType === VARIABLE_TYPE.OBJECT.VAL && typeof value !== 'object') {
                    value = JSON.parse(value)
                }
                return value
            },

            processVarInFunApiData (str, funcName) {
                return replaceFuncParam(str || '', (variableCode) => {
                    const curVar = this.variableList.find((variable) => (variable.variableCode === variableCode))
                    if (curVar) {
                        this.usedVariableMap[variableCode] = this.getVariableVal(curVar)
                        return `this.${variableCode}`
                    } else {
                        throw new Error(`函数【${funcName}】Api Data里引用的变量【${variableCode}】不存在，请检查`)
                    }
                })
            },

            processVarInFunApiUrl (str, funcName) {
                return replaceFuncParam(str || '', (variableCode) => {
                    const curVar = this.variableList.find((variable) => (variable.variableCode === variableCode))
                    if (curVar) {
                        this.usedVariableMap[variableCode] = this.getVariableVal(curVar)
                        return `\${this.${variableCode}}`
                    } else {
                        throw new Error(`函数【${funcName}】Api Url里引用的变量【${variableCode}】不存在，请检查`)
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
                const hasAwait = /await\s/.test(returnMethod.funcBody)
                if (returnMethod.funcType === 1) {
                    const remoteParams = (returnMethod.remoteParams || []).join(', ')
                    /* eslint-disable @typescript-eslint/quotes */
                    const data = `{
                        url: \`${this.processVarInFunApiUrl(returnMethod.funcApiUrl, returnMethod.funcName)}\`,
                        type: '${returnMethod.funcMethod}',
                        apiData: ${this.processVarInFunApiData(returnMethod.funcApiData, returnMethod.funcName) || '\'\''},
                        withToken: ${returnMethod.withToken}
                    }`
                    returnMethod.funcStr = `const ${returnMethod.funcName} = ${hasAwait ? 'async ' : ''}(${funcParams}) => { return this.$store.dispatch('getApiData', ${data}).then((${remoteParams}) => { ${returnMethod.funcBody} }) };`
                } else {
                    returnMethod.funcStr = `const ${returnMethod.funcName} = ${hasAwait ? 'async ' : ''}(${funcParams}) => { ${returnMethod.funcBody} };`
                }
                return returnMethod.funcStr
            },

            getMethodByCode (methodCode) {
                const returnMethod = this.functionList.find(functionData => functionData.funcCode === methodCode)
                this.usedMethodMap[returnMethod.funcCode] = returnMethod
                returnMethod.funcBody = this.processFuncBody(returnMethod.funcName, returnMethod.funcBody)
                return returnMethod
            },

            processFuncBody (funcName, funcBody) {
                return replaceFuncKeyword(funcBody, (all, first, second, variableCode, funcStr, funcCode) => {
                    if (funcCode) {
                        const curFunc = this.usedMethodMap[funcCode] || this.getMethodByCode(funcCode)
                        if (curFunc.id) {
                            return `${curFunc.funcName}`
                        } else {
                            throw new Error(`函数【${funcName}】里引用的函数【${funcCode}】不存在，请检查`)
                        }
                    }
                    if (variableCode) {
                        const curVar = this.variableList.find((variable) => (variable.variableCode === variableCode))
                        if (curVar) {
                            this.usedVariableMap[variableCode] = this.getVariableVal(curVar)
                            return `this.${variableCode}`
                        } else {
                            throw new Error(`函数【${funcName}】里引用的变量【${variableCode}】不存在，请检查`)
                        }
                    }
                })
            },

            createSandBox (contextProxy = {}) {
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
                const context = createProxy(contextProxy)
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
                    this.$bkMessage({
                        theme: 'error',
                        message: '请先选择函数',
                        limit: 1
                    })
                    return
                }

                let methodStr
                try {
                    methodStr = this.generateMethod(this.remoteData.methodCode)
                } catch (error) {
                    this.$bkMessage({
                        theme: 'error',
                        message: error.message || error || '函数格式有误，请修改后再试',
                        limit: 1
                    })
                    return
                }
                
                try {
                    const sandBox = this.createSandBox(this.usedVariableMap)
                    const res = await sandBox.exec(methodStr, this.remoteData.params)
                    let message = this.remoteValidate(res)
                    if (message) {
                        message = '数据源设置成功，以下问题可能会导致组件表现异常，请检查：' + message
                        this.messageWarn(message)
                    } else {
                        this.change(this.name, res, this.type, JSON.parse(JSON.stringify(this.remoteData)))
                        if (this.name === 'remoteOptions') {
                            bus.$emit('update-chart-options', res)
                        }
                        this.$bkMessage({ theme: 'success', message: '获取数据成功', limit: 1 })
                    }
                } catch (error) {
                    this.$bkMessage({
                        theme: 'error',
                        message: error.message || error || '获取数据失败，请检查函数是否正确',
                        limit: 1
                    })
                }
            },

            handleShowExample () {
                this.$refs.example.isShow = true
            }
        }
    }
</script>

<style lang="postcss" scoped>
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

    .remote-button {
        margin-top: 10px;
    }

    .remote-example {
        color: #3a84ff;
        cursor: pointer;
        font-size: 12px
    }

    .form-title {
        font-weight: bold;
        color: #63656E;
        height: 22px;

        .form-tip {
            font-weight: normal;
            color: #979ba5;
        }
    }
</style>
