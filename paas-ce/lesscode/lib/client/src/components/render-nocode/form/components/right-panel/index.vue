<template>
    <div>
        <layout-setting v-if="editType === 'layout'" />
        <form-setting v-else />
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
            }
        },
        data () {
            return {
            }
        }
    }
</script>
