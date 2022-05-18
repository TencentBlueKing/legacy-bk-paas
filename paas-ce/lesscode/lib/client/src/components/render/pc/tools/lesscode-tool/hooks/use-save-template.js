import LC from '@/element-materials/core'

export default function () {
    return (event) => {
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
            type: 'saveTemplate',
            target: activeNode,
            value: templateJSON
        })
    }
}
