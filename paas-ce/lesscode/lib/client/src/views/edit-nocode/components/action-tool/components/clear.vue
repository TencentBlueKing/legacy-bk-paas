<template>
    <menu-item :item="item" />
</template>

<script>
    import MenuItem from '@/views/index/components/action-tool/components/menu-item'
    import { bus } from '@/common/bus'
    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-delete',
                    text: '清空',
                    func: this.handleClearAll
                }
            }
        },
        methods: {
            async handleClearAll () {
                this.$bkInfo({
                    title: '确定清空？',
                    subTitle: '清空',
                    confirmFn: () => {
                        this.$store.commit('nocode/formSetting/restFieldList')
                        bus.$emit('restFieldList')
                    }
                })
            }
        }
    }
</script>
