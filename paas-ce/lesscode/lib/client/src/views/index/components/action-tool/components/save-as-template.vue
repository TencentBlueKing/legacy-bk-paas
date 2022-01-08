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
                    icon: 'bk-drag-icon bk-drag-template-fill',
                    text: '存为模板',
                    tips: '将画布内容区域（不包含导航部分）存为模板',
                    func: this.toggleShowTemplateDialog
                }
            }
        },
        methods: {
            toggleShowTemplateDialog () {
                const activeNode = LC.getRoot()
                LC.triggerEventListener('saveTemplate', {
                    target: activeNode,
                    type: 'saveTemplate',
                    isWholePage: true,
                    value: JSON.parse(JSON.stringify(activeNode))
                })
            }
        }
        
    }
</script>
