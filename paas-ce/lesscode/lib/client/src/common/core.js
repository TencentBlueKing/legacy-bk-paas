import cloneDeep from 'lodash.clonedeep'
import store from '@/store'
import { uuid } from '@/common/util'
import componentList from '@/element-materials/materials'

function T (componentType, payload) {
    const component = componentList.bk.find(_ => _.name === componentType)
    const {
        name = '',
        type = '',
        props = {},
        directives = []
    } = component
    const {
        style: initStyle,
        prop: initProp,
        directive: initDirective
    } = payload
    // 初始化  prop
    const renderProps = {}
    for (const propName in props) {
        if (props[propName].hasOwnProperty('val') && props[propName].val !== '') {
            renderProps[propName] = cloneDeep(props[propName])
        }
    }
    for (const propName in initProp) {
        renderProps[propName].val = initProp[propName]
    }
    // 初始化 style
    const renderStyles = {}
    for (const styleName in initStyle) {
        renderStyles[styleName] = initStyle[styleName]
    }
    // 初始化 directive
    const renderDirectives = directives.map(_ => cloneDeep(_))
    for (const directiveType in initDirective) {
        const curDirective = renderDirectives.find(_ => _.type === directiveType)
        if (curDirective) {
            curDirective.val = initDirective[directiveType]
        }
    }

    this.componentId = `${name}-${uuid()}`
    this.renderKey = uuid()
    this.name = name
    this.type = type
    this.renderProps = renderProps
    this.renderStyles = renderStyles
    this.renderEvents = {}
    this.renderDirectives = renderDirectives
    return this
}
T.prototype = {
    appendSlot: function () {

    },
    cloneNode: function () {
        
    }
}
export const ls = function () {
    return store.getters['drag/targetData']
}
ls.createNode = function (componentType, payload) {
    return new T(componentType, payload)
}
ls.getNodeById = function () {
    
}
ls.getNodesByType = function () {

}
ls.toString = function () {
    return store.getters['drag/targetData']
}
