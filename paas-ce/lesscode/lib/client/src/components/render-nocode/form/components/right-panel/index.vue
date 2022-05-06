<template>
    <div>
        <layout-setting v-if="editType === 'layout'" />
        <form-setting v-else :field="field" :list="list" />
    </div>
</template>

<script>
    import FormSetting from './form-setting'
    import layoutSetting from './layout-setting'
    export default {
        components: {
            FormSetting,
            layoutSetting
        },
        props: {
            editType: {
                type: String,
                default: 'form'
            },
            appId: String,
            field: {
                type: Object,
                default: () => ({})
            },
            list: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
            }
        }
    }
</script>
