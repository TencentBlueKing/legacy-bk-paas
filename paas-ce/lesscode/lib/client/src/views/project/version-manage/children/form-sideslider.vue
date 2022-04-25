<template>
    <bk-sideslider
        transfer
        class="version-sideslider"
        :is-show.sync="show"
        :width="796"
        :title="isEdit ? '编辑版本' : '新建版本'">
        <div slot="content" class="form-content">
            <bk-alert class="alert-info" type="info" title="基于“默认”版本内容新建" v-if="!isEdit"></bk-alert>
            <bk-form :label-width="90" :model="formData" :rules="rules" ref="form">
                <bk-form-item label="应用版本" :required="true" property="version" error-display-type="normal">
                    <bk-input
                        placeholder="请输入版本号，仅支持英文、数字、下划线、中划线和英文句号"
                        maxlength="30"
                        :disabled="isEdit"
                        v-model="formData.version">
                    </bk-input>
                </bk-form-item>
                <bk-form-item label="版本日志" :required="true" property="versionLog" error-display-type="normal" ref="versionLog">
                    <mavon-editor
                        :external-link="false"
                        v-model="formData.versionLog"
                        default-open="edit"
                        :placeholder="versionLogPlaceholder" />
                </bk-form-item>
            </bk-form>
            <div class="form-footer">
                <bk-button theme="primary" class="confirm-button" @click="handleConfirm" :loading="submitting">确定</bk-button>
                <bk-button @click="handleCancel" :disabled="submitting">取消</bk-button>
            </div>
        </div>
    </bk-sideslider>
</template>

<script>
    const generatorData = () => ({
        version: '',
        versionLog: ''
    })

    export default {
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                formData: generatorData(),
                submitting: false
            }
        },
        computed: {
            projectId () {
                return Number(this.$route.params.projectId)
            },
            isEdit () {
                return Boolean(this.data.id)
            },
            show: {
                get () {
                    return this.isShow
                },
                set (value) {
                    this.$emit('update:isShow', value)
                }
            }
        },
        watch: {
            data (newData) {
                const { version, versionLog } = newData
                this.formData = Object.assign({}, { version, versionLog })
            },
            'formData.versionLog' (versionLog) {
                if (versionLog) {
                    this.$refs.versionLog && this.$refs.versionLog.clearValidator()
                }
            }
        },
        created () {
            this.versionLogPlaceholder = 'eg: 新增 XXX 功能\n    优化 XXX 功能\n    修复 XXX 功能\n'
            this.rules = {
                version: [
                    { required: true, message: '应用版本不能为空', trigger: 'blur' },
                    {
                        validator: value => {
                            return /^[\w-\.]{1,40}$/.test(value)
                        },
                        message: '仅支持英文、数字、下划线、中划线和英文句号',
                        trigger: 'blur'
                    }
                ],
                versionLog: [
                    { required: true, message: '版本日志不能为空', trigger: 'blur' }
                ]
            }
        },
        methods: {
            async handleConfirm () {
                try {
                    await this.$refs.form.validate()
                } catch {
                    return
                }

                this.submitting = true
                try {
                    if (this.isEdit) {
                        const { version, ...editData } = this.formData
                        await this.$store.dispatch('projectVersion/update', {
                            ...editData,
                            id: this.data.id,
                            projectId: this.projectId
                        })
                        this.messageSuccess('版本编辑成功')
                    } else {
                        await this.$store.dispatch('projectVersion/create', {
                            ...this.formData,
                            projectId: this.projectId
                        })
                        this.messageSuccess('版本创建成功')
                    }
                    this.$emit('updated')
                    this.handleCancel()
                } catch (error) {
                    console.error(error)
                } finally {
                    this.submitting = false
                }
            },
            handleCancel () {
                this.formData = generatorData()
                this.$emit('update:isShow', false)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .version-sideslider {
        .form-content {
            padding: 10px 32px;

            .alert-info {
                margin-bottom: 16px;
            }
        }
        .form-footer {
            margin: 20px 0 0 90px;
            margin-top: 20px;

            .bk-button {
                & + .bk-button {
                    margin-left: 4px;
                }
            }
        }
    }
</style>
<style lang="postcss">
    .version-sideslider {
        .form-content {
            .markdown-body {
                height: 560px;
                box-shadow: none !important;
                border: 1px solid #C4C6CC;
                border-radius: 2px;
                .auto-textarea-input{
                    min-height: 100px;
                }

                &.fullscreen {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>
