<template>
    <menu-item
        v-bkloading="{ isLoading }"
        :item="item"
        :class="{
            disabled: isLocked
        }" />
</template>

<script>
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
        methods: {
            async handleSubmit () {
                const fieldsList = this.$store.state.fromSetting.fieldsList
                console.log(fieldsList)
            }
        }
    }
</script>
