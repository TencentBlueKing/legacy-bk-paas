<template>
    <menu-item
        v-bkloading="{ isLoading }"
        :item="item"
        :class="{
            disabled: isLocked
        }" />
</template>

<script>
    import { mapGetters } from 'vuex'
    import MenuItem from '@/views/index/components/action-tool/components/menu-item'
    
    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                isLoading: false,
                isLocked: false,
                item: {
                    icon: 'bk-drag-icon bk-drag-save',
                    text: '保存',
                    func: this.handleSubmit
                }
            }
        },
        computed: {
            ...mapGetters('page', ['pageDetail']),
            nocodeType () {
                return this.pageDetail.nocodeType || ''
            },
            projectId () {
                return this.$route.params.projectId
            }
        },
        methods: {
            async handleSubmit () {
                if (this.nocodeType === 'FORM') {
                    const content = this.$store.state.formSetting.fieldsList
                    const formData = {
                        content,
                        tableName: this.pageDetail.pageCode,
                        projectId: this.projectId
                    }
                    let action = 'updateForm'
                    if (!this.pageDetail.formId) {
                        action = 'createForm'
                        Object.assign(formData, { pageId: this.pageDetail.id })
                    } else {
                        Object.assign(formData, { id: this.pageDetail.formId })
                    }
                    const res = await this.$store.dispatch(`form/${action}`, formData)
                    if (res) {
                        this.$bkMessage({
                            theme: 'success',
                            message: '保存成功'
                        })
                    }
                }
            }
        }
    }
</script>
