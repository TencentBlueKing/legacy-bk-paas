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
                const newTemplateNode = activeNode.cloneNode()
                const excludeInteractiveChildrenJSON = newTemplateNode.children.reduce((result, node) => {
                    if (!node.isInteractiveComponent) {
                        result.push(node.toJSON())
                    }
                    return result
                }, [])
                if (excludeInteractiveChildrenJSON.length < 1) {
                    this.messageError('页面模板不能为空')
                    return
                }
                const girdNodeJSON = LC.createNode('render-grid').toJSON()
                const columnNodeJSON = LC.createNode('render-column').setStyle('width', '100%').toJSON()
                columnNodeJSON.renderSlots.default = excludeInteractiveChildrenJSON
                girdNodeJSON.renderSlots.default = [columnNodeJSON]
                LC.triggerEventListener('saveTemplate', {
                    target: activeNode,
                    type: 'saveTemplate',
                    value: girdNodeJSON
                })
            }
        }
        
    }
</script>
