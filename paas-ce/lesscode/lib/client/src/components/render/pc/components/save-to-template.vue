<template>
    <div
        :class="$style['button']"
        @click="handleSaveTemplate"
        role="save-template"
        data-render-drag="disabled">
        <i class="bk-drag-icon bk-drag-template-fill" />
        存为模板
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        name: '',
        data () {
            return {}
        },
        methods: {
            handleSaveTemplate (event) {
                event.stopPropagation()
                event.preventDefault()
                const activeNode = LC.getActiveNode()
                const newTemplateNode = activeNode.cloneNode()
                let templateJSON = {}
                if (newTemplateNode.type === 'render-column') {
                    // render-column 不能单独存在必须和 render-grid 配套存在
                    templateJSON = LC.createNode('render-grid').toJSON()
                    newTemplateNode.setStyle('width', '100%')
                    templateJSON.renderSlots.default = [newTemplateNode.toJSON()]
                } else {
                    templateJSON = newTemplateNode.toJSON()
                }
                LC.triggerEventListener('saveTemplate', {
                    target: activeNode,
                    type: 'saveTemplate',
                    isWholePage: false,
                    value: templateJSON
                })
            }
        }
    }
</script>
<style lang="postcss" module>
    .button{
        height: 20px;
        padding: 2px 5px;
        font-size: 12px;
        color: #fff;
        background: #3a84ff;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        cursor: pointer;
        pointer-events: all !important;
        &:hover {
            background: #1964E1;
        }
    }
</style>
