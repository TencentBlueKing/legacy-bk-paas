<template>
    <bk-sideslider :is-show="isShow" @update:isShow="handleCancel" quick-close :width="796" title="新建自定义组件">
        <div slot="content" class="component-operation">
            <bk-form :label-width="90">
                <bk-form-item label="组件包" required>
                    <bk-upload
                        tip="只允许上传ZIP的文件"
                        with-credentials
                        :url="uploadUrl"
                        accept="application/zip"
                        @on-success="handleUploadSuccess" />
                </bk-form-item>
                <bk-form-item label="组件名称" required>
                    <bk-input :value="formData.compName" placeholder="上传组件包后解析生成" readonly />
                </bk-form-item>
                <bk-form-item label="组件ID" required>
                    <bk-input :value="formData.compCode" placeholder="上传组件包后解析生成" readonly />
                </bk-form-item>
                <bk-form-item label="组件版本" required>
                    <bk-input v-model="formData.version" type="number" style="width: 120px" />
                </bk-form-item>
                <bk-form-item label="所属分类" required>
                    <bk-select v-model="formData.categoryId">
                        <bk-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :id="item.id"
                            :name="item.category" />
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="是否公开" required>
                    <bk-switcher v-model="formData.isPublic" theme="primary" />
                </bk-form-item>
                <bk-form-item label="组件介绍" required>
                    <bk-input v-model="formData.description" type="textarea" :maxlength="100" />
                </bk-form-item>
                <bk-form-item label="版本日志" required>
                    <bk-input v-model="formData.log" />
                </bk-form-item>
            </bk-form>
        </div>
        <div slot="footer">
            <div class="sideslider-footer">
                <bk-button theme="primary" @click="handleSubmit">提交</bk-button>
                <bk-button theme="default" @click="handleCancel">取消</bk-button>
            </div>
        </div>
    </bk-sideslider>
</template>
<script>
    const generatorData = () => ({
        package: '',
        compName: '',
        compCode: '',
        compPath: '',
        version: '',
        categoryId: '',
        isPublic: 0,
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
            id: {
                type: Number
            }
        },
        data () {
            return {
                formData: generatorData(),
                categoryList: []
            }
        },

        watch: {
            isShow (isShow) {
                if (isShow && this.id) {
                    this.fetchDetail()
                }
            }
        },
        created () {
            this.fetchCategoryList()
            this.uploadUrl = `${AJAX_URL_PREFIX}/component/upload`
        },
        methods: {
            async fetchCategoryList () {
                this.categoryList = await this.$store.dispatch('components/categoryList')
            },
            async fetchDetail () {
                const data = await this.$store.dispatch('components/detail', {
                    id: this.id
                })
                this.formData = data
            },
            handleUploadSuccess (payload) {
                const { compName, compCode, compPath } = payload.responseData.data
                this.formData.compName = compName
                this.formData.compCode = compCode
                this.formData.compPath = compPath
            },
            async handleSubmit () {
                await this.$store.dispatch('components/create', this.formData)
                this.$emit('on-update')
                this.handleCancel()
                this.messageSuccess('添加组件成功')
            },
            handleCancel () {
                this.formData = generatorData()
                this.$emit('update:isShow', false)
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .component-operation{
        padding: 25px 30px;
    }
    .sideslider-footer{
        padding-left: 120px;
    }
</style>
