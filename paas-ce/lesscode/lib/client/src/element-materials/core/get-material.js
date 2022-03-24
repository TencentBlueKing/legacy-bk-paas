import _ from 'lodash'
import ElementMaterials from '../materials'

const {
    bk,
    element,
    vant
} = ElementMaterials

const materialMap = {
    'root': {
        type: 'root',
        name: 'root'
    }
}

const register = (lib) => {
    lib.forEach(item => {
        materialMap[item.type] = item
    })
}

register(bk)
register(element)
register(vant)

const registerCustomMemo = {}

export const registerMaterial = (type, config) => {
    if (materialMap[type]) {
        console.error(`registerMaterial: 组件 ${type} 已存在`)
        return
    }
    materialMap[type] = config
    registerCustomMemo[type] = true
}

export const unregisterMaterial = () => {
    Object.keys(registerCustomMemo).forEach(type => {
        delete registerCustomMemo[type]
        delete materialMap[type]
    })
}

export default function (elementType) {
    const material = materialMap[elementType]
    if (!material) {
        return null
    }
    return _.cloneDeep(material)
}
