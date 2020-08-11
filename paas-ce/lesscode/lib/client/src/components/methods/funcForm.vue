<template>
    <section :class="size" class="add-function">
        <bk-form :label-width="84" :model="form" slot="content" class="add-main-form" ref="funcForm" :form-type="formType">
            <bk-form-item label="函数名称" :required="true" :rules="[requireRule('函数名称'), nameRepeatRule, groupNameRule]" :key="`${form.id}funcName`" property="funcName" error-display-type="normal">
                <bk-input v-model="form.funcName"></bk-input>
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
            <bk-form-item label="模板" :key="`${form.id}funcType`" property="funcType">
                <span v-for="temp in tempList"
                    :key="temp.id"
                    @click="form.funcType = temp.id"
                    :class="['func-temp', { select: form.funcType === temp.id }]"
                >{{ temp.name }}</span>
            </bk-form-item>
            <bk-form-item label="参数" :key="`${form.id}funcParams`" property="funcParams" :rules="[nameRule]" error-display-type="normal">
                <bk-tag-input v-model="form.funcParams"
                    placeholder="请输入参数名称，由大小写英文字母、下划线、数字组成"
                    :list="[]"
                    :allow-create="true"
                    :has-delete-icon="true">
                </bk-tag-input>
            </bk-form-item>
            <template v-if="form.funcType === 1">
                <bk-form-item label="远程参数" :key="`${form.id}funcCallBackParams`" property="remoteParams" :rules="[nameRule]" error-display-type="normal">
                    <bk-tag-input v-model="form.remoteParams"
                        placeholder="请输入参数名称，由大小写英文字母、下划线、数字组成"
                        :list="[]"
                        :allow-create="true"
                        :has-delete-icon="true">
                    </bk-tag-input>
                </bk-form-item>
                <bk-form-item label="Api Url" :required="true" :rules="[requireRule('Api Url')]" :key="`${form.id}funcApiUrl`" property="funcApiUrl" error-display-type="normal">
                    <bk-input v-model="form.funcApiUrl" :placeholder="`请输入接口URL，例如：${locationOrigin}/api/data/getMockData`"></bk-input>
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
                <bk-form-item label="Api Data" :key="`${form.id}funcApiData`" property="funcApiData">
                    <bk-input v-model="form.funcApiData" type="textarea" :rows="3" :maxlength="100" placeholder="请输入请求体数据包，例如：{ name: 'jack', age: 17 }"></bk-input>
                </bk-form-item>
            </template>
            <bk-form-item label="函数简介" property="funcSummary" :key="`${form.id}funcSummary`">
                <bk-input v-model="form.funcSummary" type="textarea" :rows="3" :maxlength="100"></bk-input>
            </bk-form-item>
        </bk-form>
        <monaco :value.sync="form.funcBody" :height="monacoHeight" :width="monacoWidth" :full-screen="size !== 'small'" class="monaco" ref="monaco"></monaco>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import monaco from './monaco'

    export default {
        components: {
            monaco
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
                    funcGroupId: undefined,
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
                locationOrigin: location.origin,
                startInit: false,
                formChanged: false,
                formType: 'horizontal',
                monacoHeight: '100%',
                monacoWidth: '100%',
                groupNameRule: {
                    validator: val => /[A-Za-z_0-9]*/.test(val),
                    message: '由大小写英文字母、下划线、数字组成',
                    trigger: 'blur'
                },
                nameRule: {
                    validator: (val) => (val.every(x => /[A-Za-z_0-9]*/.test(x))),
                    message: '由大小写英文字母、下划线、数字组成',
                    trigger: 'blur'
                },
                tempList: [
                    { id: 0, name: '空白函数' },
                    { id: 1, name: '远程函数' }
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
                }
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups'])
        },

        watch: {
            funcData: {
                handler () {
                    const newFormData = JSON.parse(JSON.stringify(this.funcData), (a, b) => {
                        if (b !== undefined && b !== null) return b
                    })
                    const defaultForm = {
                        funcName: '',
                        funcGroupId: undefined,
                        funcType: 0,
                        funcParams: [],
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
                        this.monacoHeight = '100%'
                    } else {
                        this.formType = 'horizontal'
                        this.monacoHeight = '488'
                    }
                },
                immediate: true
            }
        },

        methods: {
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

            resize (width) {
                const parent = document.querySelector('.method-layout')
                const parentWidth = parent.offsetWidth
                this.monacoWidth = 333 / 1033 * (parentWidth - width)
                this.$nextTick(this.$refs.monaco.resize)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .add-function {
        padding: 20px 30px;
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
        display: flex;
        flex-direction: row;
        padding: 0;
        .add-main-form{
            flex: 333;
            max-height: 100%;
            min-width: 180px;
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
            flex: 700;
            height: 100%;
        }
    }
</style>
