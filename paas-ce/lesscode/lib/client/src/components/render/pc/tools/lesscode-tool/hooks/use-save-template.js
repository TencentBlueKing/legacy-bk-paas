import LC from '@/element-materials/core'

export default function () {
    return (event) => {
        event.stopPropagation()
        event.preventDefault()
        const activeNode = LC.getActiveNode()
        const newTemplateNode = activeNode.cloneNode()
        let templateJSON = {}
        if (newTemplateNode.type === 'render-column') {
        // render-column 存为模板时用 render-block承载
            templateJSON = LC.createNode('render-block').toJSON()
            newTemplateNode.setStyle('width', '100%')
            templateJSON.renderSlots.default = newTemplateNode.toJSON().renderSlots.default
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
