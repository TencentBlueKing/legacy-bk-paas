import _ from 'lodash'
import ElementMaterials from '../materials'

const {
    bk,
    element
} = ElementMaterials

const elementMap = [
    ...bk,
    ...element
].reduce((result, item) => {
    result[item.type] = item
    return result
}, {})

const registerMemo = {}

export const registerMaterial = (type, config) => {
    if (elementMap[type]) {
        console.error(`registerMaterial: 组件 ${type} 已存在`)
        return
    }
    elementMap[type] = config
    registerMemo[type] = true
}

export const unregisterMaterial = () => {
    Object.keys(registerMemo).forEach(type => {
        delete registerMemo[type]
        delete elementMap[type]
    })
}

export default function (elementType) {
    const material = elementMap[elementType]
    if (!material) {
        return null
    }
    return _.cloneDeep(material)
}
