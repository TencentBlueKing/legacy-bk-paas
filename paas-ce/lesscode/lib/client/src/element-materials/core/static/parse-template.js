import { camelCase, camelCaseTransformMerge } from 'change-case'
import { parseTemplate } from './parse-data'

const updateFormItemVMode = (formNode) => {
    formNode.children.forEach(formItemNode => {
        formItemNode.children.forEach(inputNode => {
            inputNode.renderDirectives.forEach(directiveItem => {
                if (directiveItem.type === 'v-model') {
                    directiveItem.code = `${camelCase(formNode.componentId, { transform: camelCaseTransformMerge })}model.${formItemNode.prop.property}`
                }
            })
        })
    })
}

const syncFormModel = node => {
    if (node.type === 'widget-form') {
        updateFormItemVMode(node)
    } else {
        node.children.forEach(childNode => {
            syncFormModel(childNode)
        })
    }
    
    return node
}

export default function (data) {
    const templateNode = parseTemplate([data])

    return syncFormModel(templateNode)
}
