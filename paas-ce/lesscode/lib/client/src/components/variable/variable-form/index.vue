<template>
    <bk-sideslider :is-show="variableFormData.show" :before-close="hidden" :quick-close="true" :width="796" :title="isAdd ? '新增变量' : '编辑变量'">
        <section slot="content" class="variable-form-main">
            <bk-form :label-width="84" :model="copyForm" ref="variableForm">
                <bk-form-item label="变量名称" :required="true" :rules="[requireRule('变量名称'), nameRule]" property="variableName" error-display-type="normal">
                    <bk-input v-model="copyForm.variableName"></bk-input>
                </bk-form-item>
                <bk-form-item label="变量标识" :required="true" :rules="[requireRule('变量标识'), codeRule, repeatRule, projectOnlyRule, keyWordRule]" property="variableCode" error-display-type="normal">
                    <bk-input v-model="copyForm.variableCode" :disabled="!isAdd"></bk-input>
                </bk-form-item>
                <bk-form-item label="初始类型" :required="true" property="valueType" error-display-type="normal">
                    <bk-radio-group v-model="copyForm.valueType" @change="resetValue">
                        <template v-for="type in jsTypes">
                            <bk-radio-button :key="type.id" :value="type.id" v-if="!type.hidden || !type.hidden()">{{ type.label }}</bk-radio-button>
                        </template>
                    </bk-radio-group>
                </bk-form-item>
                <bk-form-item label="默认值" :required="true" property="defaultValue" error-display-type="normal">
                    <!-- <bk-radio-group v-model="copyForm.defaultValueType">
                        <bk-radio :value="0" class="type-radio">环境统一配置</bk-radio>
                        <bk-radio :value="1" :disabled="copyForm.valueType === 6">分环境配置</bk-radio>
                    </bk-radio-group> -->
                    <component :is="renderComponent"
                        :value.sync="copyForm.defaultValue"
                        :type="copyForm.defaultValueType"
                        :value-type="copyForm.valueType"
                    />
                </bk-form-item>
                <bk-form-item label="生效范围" :required="true" property="effectiveRange" error-display-type="normal">
                    <bk-radio-group v-model="copyForm.effectiveRange">
                        <bk-radio :value="0" class="range-radio" :disabled="copyForm.valueType === 6">本项目</bk-radio>
                        <bk-radio :value="1" v-if="pageId">本页面</bk-radio>
                    </bk-radio-group>
                </bk-form-item>
                <bk-form-item label="变量说明" property="description" error-display-type="normal">
                    <bk-input v-model="copyForm.description" type="textarea"></bk-input>
                </bk-form-item>
            </bk-form>
            <bk-button theme="primary" class="confirm-button" @click="confirm" :loading="isSaving">确定</bk-button>
            <bk-button @click="hidden" :disabled="isSaving">取消</bk-button>
        </section>
    </bk-sideslider>
</template>

<script>
    import { isJsKeyWord } from '@/common/util'
    import { mapActions, mapGetters } from 'vuex'
    import variableSwitcher from './variable-switcher'
    import variableCode from './variable-code'
    import variableInput from './variable-input'
    import variableJson from './variable-json'
    import variableUpload from './variable-upload'

    export default {
        components: {
            variableSwitcher,
            variableCode,
            variableInput,
            variableJson,
            variableUpload
        },

        data () {
            return {
                jsTypes: [
                    { label: 'String', id: 0 },
                    { label: 'Number', id: 1 },
                    { label: 'Boolean', id: 2 },
                    { label: 'Array', id: 3 },
                    { label: 'Object', id: 4 },
                    // { label: '图片地址', id: 5 },
                    { label: '计算变量', id: 6, hidden: () => (this.copyForm.effectiveRange === 0) }
                ],
                copyForm: {},
                isSaving: false,
                allProjectVariableList: [],
                repeatRule: {
                    validator: (variableCode) => (!this.variableList.find(variable => variable.variableCode === variableCode && this.copyForm.id !== variable.id)),
                    message: '标识不能与其他变量重复',
                    trigger: 'blur'
                },
                codeRule: {
                    validator: (val) => (/^[A-Za-z_][A-Za-z_0-9]{0,19}$/.test(val)),
                    message: '由大小写英文字母、下划线开头，后面可以是大小写英文字母、下划线和数字，长度小于20个字符',
                    trigger: 'blur'
                },
                nameRule: {
                    validator: (val) => (/^[\u4e00-\u9fa5a-zA-Z0-9-]{0,20}$/.test(val)),
                    message: '由汉字、英文字母、数字、连字符(-)组成，长度小于20个字符',
                    trigger: 'blur'
                },
                projectOnlyRule: {
                    validator: (variableCode) => {
                        const repeatVailable = this.allProjectVariableList.find(variable => variable.variableCode === variableCode && this.copyForm.id !== variable.id)
                        return this.copyForm.effectiveRange === 1 || (this.copyForm.effectiveRange === 0 && !repeatVailable)
                    },
                    message: '项目级变量，变量标识全局唯一',
                    trigger: 'blur'
                },
                keyWordRule: {
                    validator: (val) => !isJsKeyWord(val),
                    message: '变量标识不能是 JavaScript 保留字',
                    trigger: 'blur'
                }
            }
        },

        computed: {
            ...mapGetters('variable', ['variableFormData', 'variableList']),
            ...mapGetters('page', ['pageDetail']),
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),

            isAdd () {
                return this.copyForm.id === undefined
            },

            projectId () {
                return this.$route.params.projectId
            },

            pageId () {
                return this.$route.params.pageId
            },

            renderComponent () {
                let renderComponent = ''
                switch (this.copyForm.valueType) {
                    case 0:
                        renderComponent = 'variableInput'
                        break
                    case 1:
                        renderComponent = 'variableInput'
                        break
                    case 2:
                        renderComponent = 'variableSwitcher'
                        break
                    case 3:
                        renderComponent = 'variableJson'
                        break
                    case 4:
                        renderComponent = 'variableJson'
                        break
                    case 5:
                        renderComponent = 'variableUpload'
                        break
                    case 6:
                        renderComponent = 'variableCode'
                        break
                }
                return renderComponent
            }
        },

        watch: {
            'variableFormData.show' (val) {
                if (val) {
                    this.initData()
                }
            }
        },

        methods: {
            ...mapActions('variable', ['getAllProjectVariable', 'getAllVariable', 'addVariable', 'editVariable', 'setVariableFormData']),

            initData () {
                const defaultForm = {
                    variableCode: '',
                    variableName: '',
                    valueType: 0,
                    defaultValueType: 0,
                    defaultValue: { all: '', prod: '', stag: '' },
                    description: '',
                    effectiveRange: this.pageId ? 1 : 0,
                    projectId: this.projectId,
                    versionId: this.versionId,
                    pageCode: this.pageDetail.pageCode
                }
                this.copyForm = Object.assign(defaultForm, JSON.parse(JSON.stringify(this.variableFormData.form)))
                this.getAllProjectVariable({ projectId: this.projectId, versionId: this.versionId }).then((res) => {
                    this.allProjectVariableList = res || []
                }).catch((err) => {
                    this.$bkMessage({ message: err.message, theme: 'error' })
                })
            },

            resetValue () {
                let defaultItemValue = ''
                switch (this.copyForm.valueType) {
                    case 0:
                        defaultItemValue = ''
                        break
                    case 1:
                        defaultItemValue = 0
                        break
                    case 2:
                        defaultItemValue = false
                        break
                    case 3:
                        defaultItemValue = '[]'
                        break
                    case 4:
                        defaultItemValue = '{}'
                        break
                    case 5:
                        defaultItemValue = ''
                        break
                    case 6:
                        // eslint-disable-next-line @typescript-eslint/quotes
                        defaultItemValue = `return ''\r\n`
                        break
                }
                if (this.copyForm.valueType === 6) this.copyForm.defaultValueType = 0
                this.copyForm.defaultValue = { all: defaultItemValue, prod: defaultItemValue, stag: defaultItemValue }
            },

            requireRule (name) {
                return {
                    required: true,
                    message: `${name}是必填项，请修改后重试`,
                    trigger: 'blur'
                }
            },

            confirm () {
                const confirmMethod = this.isAdd ? this.addVariable : this.editVariable
                this.copyForm.pageCode = this.copyForm.effectiveRange === 0 ? '' : this.pageDetail.pageCode
                this.isSaving = true
                this.$refs.variableForm.validate(() => {
                    return confirmMethod(this.copyForm).then(() => {
                        this.$bkMessage({ theme: 'success', message: this.isAdd ? '新增变量成功' : '编辑变量成功' })
                        this.hidden()
                        const params = { projectId: this.projectId, versionId: this.versionId, effectiveRange: 0 }
                        if (this.pageId) {
                            params.pageCode = this.pageDetail.pageCode
                        }
                        return this.getAllVariable(params)
                    }).catch((err) => {
                        this.messageHtmlError(err.message)
                    }).finally(() => {
                        this.isSaving = false
                    })
                }).catch((validator) => {
                    this.isSaving = false
                    this.$bkMessage({ theme: 'error', message: validator.content || '数据校验不通过，请修改后重试' })
                })
            },

            hidden () {
                const data = { show: false, form: {} }
                this.setVariableFormData(data)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .variable-form-main {
        padding: 21px 34px;
    }
    .type-radio {
        margin-right: 50px;
    }
    .range-radio {
        margin-right: 65px;
    }
    .confirm-button {
        margin: 19px 10px 0 84px;
        +button {
            margin-top: 19px;
        }
    }
</style>
