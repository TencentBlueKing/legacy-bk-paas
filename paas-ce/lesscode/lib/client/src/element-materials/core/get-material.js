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

export default function (elementType) {
    const material = elementMap[elementType]
    if (!material) {
        return null
    }
    return _.cloneDeep(material)
}
