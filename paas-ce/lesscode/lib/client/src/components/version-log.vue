<template>
    <bk-dialog
        class="component-version-log-dialog"
        :title="dialogTitle"
        :value="isShow"
        @cancel="handleCancel"
        quick-close
        :width="860"
        header-position="left">
        <mavon-editor :value="data.versionLog" :external-link="false" :editable="false" :subfield="false" :toolbars-flag="false" default-open="preview" />
        <div slot="footer">
            <bk-button @click="handleCancel">关闭</bk-button>
        </div>
    </bk-dialog>
</template>
<script>
    export default {
        name: '',
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            data: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            dialogTitle () {
                if (this.title) {
                    return this.title
                }
                return `${this.data.name}  ${this.data.version}版本日志`
            }
        },
        methods: {
            handleCancel () {
                this.$emit('update:isShow', false)
            }
        }
    }
</script>
<style lang="postcss">
    .component-version-log-dialog {
        .markdown-body{
            box-shadow: none !important;
            .v-show-content {
                padding: 0 !important;
                background: #fff !important;
            }
        }
    }
</style>
