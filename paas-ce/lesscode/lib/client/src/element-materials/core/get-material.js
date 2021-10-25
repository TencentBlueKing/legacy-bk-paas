import cloneDeep from 'lodash.clonedeep'
import ElementMaterials from '../materials'

const {
    bk,
    element
} = ElementMaterials

const allElementList = [
    ...bk,
    ...element
]

export default function (elementType) {
    const material = allElementList.find(elementMaterial => elementMaterial.type === elementType)
    if (!material) {
        return null
    }
    return cloneDeep(material)
}
