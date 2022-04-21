<template>
    <menu-item :item="item" />
</template>

<script>
    import MenuItem from './menu-item'
    import LC from '@/element-materials/core'
    
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
                // const isLock = await this.checkLockStatus('lock')
                // if (isLock) return // 如果被锁，不可清空

                const me = this
                me.$bkInfo({
                    title: '确定清空所有组件元素？',
                    subTitle: '包含的已下架自定义组件将不能再被使用',
                    confirmFn () {
                        const root = LC.getRoot()
                        root.setRenderSlots([])
                    }
                })
            }
        }
    }
</script>
