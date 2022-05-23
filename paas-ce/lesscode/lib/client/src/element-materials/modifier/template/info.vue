<template>
    <div class="project-info-modifier">
        <div>
            <div class="action-title">应用名称配置</div>
            <bk-input :value="siteName" @change="handleSiteNameChange" />
        </div>
        <div style="margin-top: 10px;">
            <div class="action-title">应用 LOGO 配置</div>
            <bk-input :value="logo" @change="handleLogoChange" />
        </div>
    </div>
</template>
<script>
    export default {
        name: '',
        props: {
            logo: String,
            siteName: String
        },
        methods: {
            handleSiteNameChange (value) {
                this.$emit('on-change', 'siteName', value)
            },
            handleLogoChange (value) {
                this.$emit('on-change', 'logo', value)
            }
        }
    }
</script>
