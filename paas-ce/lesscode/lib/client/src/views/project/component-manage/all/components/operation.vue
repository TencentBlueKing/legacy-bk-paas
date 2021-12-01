<template>
    <bk-sideslider
        class="component-operation-sideslider"
        transfer
        :is-show="isShow"
        @update:isShow="handleCancel"
        :width="796"
        :title="dialogTitle">
        <div slot="content" class="operation-content">
            <div class="component-guide">
                <a href="/help/custom" target="_blank">组件开发指引</a>
            </div>
            <bk-form ref="form" :label-width="90" :model="formData" :rules="rules">
                <bk-form-item label="组件包" required error-display-type="normal">
                    <bk-upload
                        class="component-upload"
                        :tip="uploadTips"
                        with-credentials
                        :url="uploadUrl"
                        :multiple="false"
                        :limit="1"
                        accept=".zip"
                        @on-success="handleUploadSuccess" />
                </bk-form-item>
                <bk-form-item label="组件名称" required property="name" error-display-type="normal">
                    <bk-input
                        :value="formData.displayName && formData.name ? `${formData.displayName}(${formData.name})` : ''"
                        placeholder="上传组件包后解析config.json内的displayName和name配置生成"
                        readonly />
                </bk-form-item>
                <bk-form-item label="组件ID" required property="type" error-display-type="normal">
                    <bk-input :value="formData.type" placeholder="上传组件包后解析config.json内的type配置生成" readonly />
                </bk-form-item>
                <bk-form-item label="所属分类" required property="categoryId" error-display-type="normal">
                    <bk-select v-model="formData.categoryId" :clearable="false">
                        <bk-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :id="item.id"
                            :name="item.name" />
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="组件介绍" required property="description" error-display-type="normal">
                    <bk-input v-model="formData.description" type="textarea" :maxlength="100" />
                </bk-form-item>
                <bk-form-item label="组件版本" required property="version" error-display-type="normal">
                    <div class="component-version-wraper">
                        <bk-input v-model="formData.version" placeholder="版本号格式：1.x.x" style="width: 300px" />
                        <span v-if="isEdit" class="last-version">上个版本为 {{ lastVersion }}</span>
                    </div>
                </bk-form-item>
                <bk-form-item ref="log" label="版本日志" required property="log" error-display-type="normal">
                    <mavon-editor
                        :external-link="false"
                        v-model="formData.log"
                        default-open="edit"
                        :placeholder="versionLogPlaceholder" />
                </bk-form-item>
            </bk-form>
        </div>
        <div slot="footer">
            <div class="sideslider-footer">
                <bk-button theme="primary" :loading="isSubmiting" @click="handleSubmit">提交</bk-button>
                <bk-button theme="default" @click="handleCancel">取消</bk-button>
            </div>
        </div>
    </bk-sideslider>
</template>
<script>
    import { mapGetters } from 'vuex'
    import tnpmVersionValid from '@/common/tnpm-version-valid'

    const generatorData = () => ({
        name: '',
        displayName: '',
        type: '',
        dest: '',
        version: '',
        categoryId: '',
        description: '',
        log: ''
    })
    export default {
        name: '',
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            defaultCategory: {
                type: Number
            },
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                isSubmiting: false,
                formData: generatorData(),
                lastVersion: '',
                categoryList: []
            }
        },
        computed: {
            ...mapGetters('project', ['currentProject']),
            dialogTitle () {
                return this.data.id ? '更新自定义组件' : '新建自定义组件'
            },
            isEdit () {
                return this.data.id
            },
            uploadUrl () {
                return `${AJAX_URL_PREFIX}/component/upload?belongProjectId=${this.belongProjectId}&id=${this.data.id ? this.data.id : ''}`
            }
        },
        watch: {
            isShow (isShow) {
                if (isShow) {
                    this.formData.categoryId = this.defaultCategory
                    this.fetchCategoryList()
                }
            },
            data (newData) {
                if (!newData.id) {
                    return
                }
                const {
                    name,
                    displayName,
                    type,
                    dest,
                    categoryId,
                    version,
                    description,
                    versionLog
                } = newData
                this.formData.name = name
                this.formData.displayName = displayName
                this.formData.type = type
                this.formData.dest = dest
                this.formData.categoryId = categoryId
                this.formData.description = description
                this.formData.log = versionLog
                this.lastVersion = version
            },
            'formData.log' (log) {
                if (log) {
                    this.$refs.log && this.$refs.log.clearValidator()
                }
            }
        },
        created () {
            this.belongProjectId = parseInt(this.$route.params.projectId)
            this.uploadTips = `只允许上传ZIP包；
            组件ID对应的组件包内config.json里的type配置，上传成功后会自动添加项目ID(${this.currentProject.projectCode})前缀，即：${this.currentProject.projectCode}-xxx；
            组件源码须使用平台提供的打包工具打包生成min.js文件后再上传。
            `
            this.versionLogPlaceholder = 'eg: 新增 XXX 功能\n    优化 XXX 功能\n    修复 XXX 功能\n'

            this.markdownOption = {
                defaultOpen: 'edit'
            }
            this.rules = {
                name: [
                    { required: true, message: '请先上传组件', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请先上传组件', trigger: 'blur' },
                    {
                        validator: value => /^[a-z][a-z\d]*(-[a-z\d]+)*$/.test(value),
                        message: '组件type格式：以a-z开头，只允许a-z、0-9、-',
                        trigger: 'blur'
                    }
                ],
                version: [
                    { required: true, message: '组件版本不能为空', trigger: 'blur' },
                    {
                        validator: value => {
                            return /^\d/.test(value) && tnpmVersionValid.re[tnpmVersionValid.t.FULL].test(value)
                        },
                        message: '版本号格式：0.x.x',
                        trigger: 'blur'
                    }
                ],
                categoryId: [
                    { required: true, message: '所属分类不能为空', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '组件介绍不能为空', trigger: 'blur' }
                ],
                log: [
                    { required: true, message: '版本日志不能为空', trigger: 'blur' }
                ]
            }
        },
        methods: {
            async fetchCategoryList () {
                this.categoryList = await this.$store.dispatch('components/categoryList', {
                    belongProjectId: parseInt(this.$route.params.projectId)
                })
            },
            handleUploadSuccess (payload) {
                const { name, displayName, type, dest } = payload.responseData.data
                this.formData.name = name
                this.formData.displayName = displayName
                this.formData.type = type
                this.formData.dest = dest
            },
            async handleSubmit () {
                try {
                    await this.$refs.form.validate()
                } catch {
                    return
                }

                this.isSubmiting = true
                try {
                    if (this.isEdit) {
                        await this.$store.dispatch('components/update', {
                            ...this.formData,
                            id: this.data.id,
                            belongProjectId: this.belongProjectId
                        })
                        this.messageSuccess('编辑组件成功')
                    } else {
                        await this.$store.dispatch('components/create', {
                            ...this.formData,
                            belongProjectId: this.belongProjectId
                        })
                        this.messageSuccess('添加组件成功')
                    }
                    this.$emit('on-add')
                    this.$emit('on-update')
                    this.handleCancel()
                } catch (error) {
                    this.messageError(error.message)
                } finally {
                    this.isSubmiting = false
                }
            },
            handleCancel () {
                this.formData = generatorData()
                this.$emit('update:isShow', false)
            }
        }
    }
</script>
<style lang='postcss'>
    .component-operation-sideslider{
        .operation-content{
            padding: 25px 30px;
            .component-guide{
                padding-bottom: 10px;
                margin-top: -15px;
                font-size: 12px;
                text-align: right;
                a{
                    color: #3a84ff;
                }
            }
            .markdown-body{
                max-height: 300px;
                box-shadow: none !important;
                border: 1px solid #C4C6CC;
                border-radius: 2px;
                .auto-textarea-input{
                    min-height: 100px;
                }
            }
            .component-upload{
                .file-name{
                    display: block !important;
                }
                .progress-bar-wrapper{
                    margin-top: 16px !important;
                }
                .tip{
                    line-height: 20px;
                    white-space: pre-line;
                }
            }
            .component-version-wraper{
                display: flex;
                align-items: center;
                .last-version{
                    margin-left: 10px;
                    font-size: 12px;
                    color: #979BA5;
                }
            }
        }
        .sideslider-footer{
            padding-left: 120px;
        }
    }
</style>
