<template>
    <section :class="size" class="add-function">
        <bk-form :label-width="84" :model="form" slot="content" class="add-main-form" ref="funcForm" :form-type="formType">
            <bk-form-item label="函数名称" :required="true" :rules="[requireRule('函数名称'), nameRepeatRule, groupNameRule]" :key="`${form.id}funcName`" property="funcName" error-display-type="normal">
                <bk-input v-model="form.funcName"></bk-input>
            </bk-form-item>
            <bk-form-item label="函数标识" :required="true" :rules="[requireRule('函数标识'), codeRepeatRule, codeRule, keyWordRule]" :key="`${form.id}funcCode`" property="funcCode" error-display-type="normal">
                <bk-input v-model="form.funcCode" :disabled="!!form.id"></bk-input>
            </bk-form-item>
            <bk-form-item label="所属分类" :required="true" :rules="[requireRule('所属分类')]" key="funcGroupId" property="funcGroupId" error-display-type="normal">
                <bk-select v-model="form.funcGroupId" :popover-options="{ appendTo: 'parent' }">
                    <bk-option v-for="option in funcGroups"
                        :key="option.id"
                        :id="option.id"
                        :name="option.groupName">
                    </bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item label="函数类型" :key="`${form.id}funcType`" property="funcType">
                <span v-for="temp in tempList"
                    :key="temp.id"
                    @click="changeTemType(temp.id)"
                    :class="['func-temp', { select: form.funcType === temp.id }]"
                >{{ temp.name }}
                    <i class="bk-icon icon-info" v-if="temp.info" v-bk-tooltips="{ content: `<pre class='component-method-tip'>${temp.info}</pre>` }"></i>
                </span>
            </bk-form-item>
            <bk-form-item label="参数" :key="`${form.id}funcParams`" property="funcParams" :rules="[nameRule]" error-display-type="normal" :desc="{ width: 350, content: '调用该函数传入的参数列表，如果函数用于组件事件，则这里是组件事件回调的参数，组件事件回调参数具体可见组件文档。输入后按回车添加参数' }">
                <bk-tag-input v-model="form.funcParams"
                    placeholder="请输入参数名称，由大小写英文字母、下划线、数字组成"
                    :list="[]"
                    :allow-create="true"
                    :has-delete-icon="true">
                </bk-tag-input>
            </bk-form-item>
            <template v-if="form.funcType === 1">
                <bk-form-item label="远程参数" :key="`${form.id}funcCallBackParams`" property="remoteParams" :rules="[nameRule]" error-display-type="normal" desc="接口回调函数的参数列表，输入后按回车添加参数">
                    <bk-tag-input v-model="form.remoteParams"
                        placeholder="请输入参数名称，由大小写英文字母、下划线、数字组成"
                        :list="[]"
                        :allow-create="true"
                        :has-delete-icon="true">
                    </bk-tag-input>
                </bk-form-item>
                <bk-form-item label="Api Url" :required="true" :rules="[requireRule('Api Url')]" :key="`${form.id}funcApiUrl`" property="funcApiUrl" error-display-type="normal" :desc="`请输入接口 URL，例如：{{domain}}/api/data/getMockData`">
                    <bk-input v-model="form.funcApiUrl"></bk-input>
                </bk-form-item>
                <bk-form-item label="Method" :required="true" :rules="[requireRule('Method')]" :key="`${form.id}funcMethod`" property="funcMethod" error-display-type="normal">
                    <bk-select v-model="form.funcMethod" :clearable="false" :popover-options="{ appendTo: 'parent' }">
                        <bk-option v-for="option in methodList"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="Api Data" :rules="[objRule]" property="funcApiData" :key="`${form.id}funcApiData`" error-display-type="normal" :desc="{ width: 350, content: 'HTTP 请求（例如 POST）的请求体数据包。如果是GET请求，请在 Api Url 中填写请求头参数' }">
                    <bk-input v-model="form.funcApiData" type="textarea" :rows="3" :maxlength="500" :placeholder="`请输入请求体数据包，例如：{ name: {{name}}, age: 17 }`"></bk-input>
                </bk-form-item>
            </template>
            <bk-form-item label="函数简介" property="funcSummary" :key="`${form.id}funcSummary`">
                <bk-input v-model="form.funcSummary" type="textarea" :rows="3" :maxlength="100"></bk-input>
            </bk-form-item>
        </bk-form>
        <monaco-func :value.sync="form.funcBody"
            :func-type="form.funcType"
            :height="monacoHeight"
            :width="monacoWidth"
            :func.sync="form"
            class="monaco"
            ref="monaco"
        >
            <template v-slot:tools>
                <slot name="tools"></slot>
            </template>
        </monaco-func>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import monacoFunc from './monaco-func.vue'
    import dayjs from 'dayjs'
    import { isJsKeyWord } from '@/common/util'

    export default {
        components: {
            monacoFunc
        },

        props: {
            funcData: {
                type: Object,
                default: {}
            },

            size: {
                type: String,
                default: 'normal'
            }
        },

        data () {
            return {
                form: {
                    funcName: '',
                    funcCode: '',
                    funcGroupId: undefined,
                    withToken: 0,
                    funcType: 0,
                    funcParams: [],
                    remoteParams: [],
                    funcApiUrl: '',
                    funcMethod: 'get',
                    funcApiData: '',
                    funcSummary: '',
                    funcBody: '',
                    id: undefined
                },
                hasToken: false,
                startInit: false,
                formChanged: false,
                formType: 'horizontal',
                monacoHeight: '100%',
                monacoWidth: '100%',
                groupNameRule: {
                    validator: val => /^[A-Za-z_][A-Za-z0-9]*[A-Za-z_0-9]?$/.test(val),
                    message: '由大小写英文字母、数字组成，开头和结尾可以是大小写英文字母、下划线、数字，且必须符合驼峰命名规范',
                    trigger: 'blur'
                },
                nameRule: {
                    validator: (val) => (val.every(x => /[A-Za-z_0-9]*/.test(x))),
                    message: '由大小写英文字母、下划线、数字组成',
                    trigger: 'blur'
                },
                codeRule: {
                    validator: (val) => /^[A-Za-z_0-9]*$/.test(val),
                    message: '由大小写英文字母、下划线、数字组成',
                    trigger: 'blur'
                },
                keyWordRule: {
                    validator: (val) => !isJsKeyWord(val),
                    message: '函数标识不能是 JavaScript 保留字',
                    trigger: 'blur'
                },
                objRule: {
                    validator: (val) => {
                        try {
                            const Fn = Function
                            const replaceVal = val.replace(/\{\{([^\}]+)\}\}/g, (all, code) => `this.${code}`)
                            const relVal = new Fn(`return ${replaceVal}`)()
                            const type = Object.prototype.toString.call(relVal)
                            return type === '[object Object]' || val === '' || this.form.funcType === 0
                        } catch (error) {
                            return false
                        }
                    },
                    message: 'apiData需要是json格式的数据',
                    trigger: 'blur'
                },
                tempList: [
                    { id: 0, name: '空白函数' },
                    { id: 1, name: '远程函数', info: '建议以下几种情况使用 "远程函数":\n1、远程API需要携带用户登录态认证\n2、远程API无法跨域或纯前端访问' }
                ],
                methodList: [
                    { name: 'GET', id: 'get' },
                    { name: 'POST', id: 'post' },
                    { name: 'PUT', id: 'put' },
                    { name: 'DELETE', id: 'delete' },
                    { name: 'HEAD', id: 'head' },
                    { name: 'OPTIONS', id: 'options' },
                    { name: 'TRACE', id: 'trace' },
                    { name: 'CONNECT', id: 'connect' },
                    { name: 'PATCH', id: 'patch' }
                ],
                nameRepeatRule: {
                    validator: (val) => {
                        return !this.funcGroups.some((group) => {
                            const functionList = group.functionList || []
                            return functionList.some((func) => (func.funcName === val && func.id !== this.form.id))
                        })
                    },
                    message: `函数名称在当前项目下重复，请修改后重试`,
                    trigger: 'blur'
                },
                codeRepeatRule: {
                    validator: (val) => {
                        return !this.funcGroups.some((group) => {
                            const functionList = group.functionList || []
                            return functionList.some((func) => (func.funcCode === val && func.id !== this.form.id))
                        })
                    },
                    message: `函数标识在当前项目下重复，请修改后重试`,
                    trigger: 'blur'
                }
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups']),

            projectId () {
                return this.$route.params.projectId
            }
        },

        watch: {
            funcData: {
                handler () {
                    const newFormData = JSON.parse(JSON.stringify(this.funcData), (a, b) => {
                        if (b !== undefined && b !== null) return b
                    })
                    const defaultForm = {
                        funcName: '',
                        funcCode: '',
                        funcGroupId: undefined,
                        funcType: 0,
                        funcParams: [],
                        withToken: 0,
                        funcApiUrl: '',
                        funcMethod: 'get',
                        funcApiData: '',
                        funcSummary: '',
                        funcBody: '',
                        id: undefined
                    }
                    Object.assign(this.form, defaultForm, newFormData)
                    this.startInit = true
                    this.formChanged = false
                },
                immediate: true
            },

            form: {
                handler (val) {
                    if (this.startInit) {
                        this.startInit = false
                        return
                    }
                    this.$emit('formChange', val)
                    this.formChanged = true
                },
                deep: true,
                immediate: true
            },

            size: {
                handler (val) {
                    if (val === 'small') {
                        this.formType = 'vertical'
                        this.monacoHeight = 'calc(100% - 30px)'
                    } else {
                        this.formType = 'horizontal'
                        this.monacoHeight = '458'
                    }
                },
                immediate: true
            }
        },

        methods: {
            judgeDisableToken () {
                this.isLoadingToken = true
                this.$store.dispatch('functions/getTokenList').then((res) => {
                    const tokenList = res.data || []
                    const firstToken = tokenList[0]
                    this.hasToken = firstToken && dayjs(firstToken.expiresTime).isAfter(dayjs())
                }).catch((err) => {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                }).finally(() => {
                    this.isLoadingToken = false
                })
            },

            requireRule (name) {
                return {
                    required: true,
                    message: `${name}是必填项，请修改后重试`,
                    trigger: 'blur'
                }
            },

            validate () {
                return new Promise((resolve, reject) => {
                    this.$refs.funcForm.validate().then(() => {
                        this.formChanged = false
                        resolve(this.form)
                    }, (validator) => {
                        resolve()
                        this.$bkMessage({ message: validator.content || validator, theme: 'error' })
                    })
                })
            },

            resizeMonaco (width) {
                const parent = document.querySelector('.method-layout')
                const parentWidth = parent.offsetWidth
                this.monacoWidth = parentWidth - width - 350
            },

            changeTemType (id) {
                this.form.funcType = id
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .add-function {
        padding: 20px 30px;
        .token-item {
            margin-top: 10px;
        }
        .func-temp {
            display: inline-block;
            width: 140px;
            max-width: calc(50% - 5px);
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #c4c6cc;
            border-radius: 2px 0px 0px 2px;
            color: #63656e;
            box-sizing: content-box;
            cursor: pointer;
            &:first-child {
                border-right: none;
            }
            &:last-child {
                border-left: none;
            }
            &.select {
                background: #e1ecff;
                border: 1px solid #3a84ff;
                color: #3a84ff;
            }
        }
        .monaco {
            margin-top: 20px;
        }
    }

    .small {
        padding: 0;
        .add-main-form{
            float: left;
            width: 350px;
            overflow-y: auto;
            margin: 7px 0;
            padding: 0 20px;
            &::-webkit-scrollbar {
                width: 6px;
                height: 5px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 20px;
                background-color: #dcdee5;
                -webkit-box-shadow: inset 0 0 6px hsla(0, 0%, 80%, .3);
            }
        }
        .monaco {
            margin: 0;
            height: 100%;
            margin-left: 350px;
        }
    }
</style>
<style lang="postcss">
    .token-tip {
        font-size: 12px;
        line-height: 16px;
        a {
            color: #3a84ff;
        }
    }
</style>
