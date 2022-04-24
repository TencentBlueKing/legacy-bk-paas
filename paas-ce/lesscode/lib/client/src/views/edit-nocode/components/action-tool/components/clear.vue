<template>
    <menu-item :item="item" />
</template>

<script>
    import MenuItem from '@/views/index/components/action-tool/components/menu-item'
    
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
                const me = this
                me.$bkInfo({
                    title: '确定清空？',
                    subTitle: '清空',
                    confirmFn () {
                        alert('清空')
                    }
                })
            }
        }
    }
</script>
