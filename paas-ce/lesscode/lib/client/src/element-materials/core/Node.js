import { uuid } from '@/common/util'

import active from './extends/active'
import activeClear from './extends/active-clear'
import appendChild from './extends/append-child'
import removeChild from './extends/remove-child'
import rerender from './extends/rerender'
import setRenderSlots from './extends/set-render-slots'
import setRenderEvents from './extends/set-render-events'
import setRenderProps from './extends/set-render-props'
import setRenderStyles from './extends/set-render-styles'
import setRenderDirectives from './extends/set-render-directives'
import setStyle from './extends/set-style'

import {
    notify,
    readonly
} from './helper/decorator'

import transformProps from './helper/transform-props'
import transformSlots from './helper/transform-slots'
import findParent from './helper/find-parent'
import flatneChildren from './helper/flatne-chilren'

import getRoot from './get-root'
import getMaterial from './get-material'

export default class Node {
    constructor ({
        name = '',
        type = '',
        props = {},
        directives = [],
        slots = {},
        renderStyles = {},
        interactiveShow = false,
        isComplexComponent = false,
        isCustomComponent = false
    }) {
        const uid = uuid()
            
        this.tabPanelActive = 'props' // 默认tab选中的面板
        this.componentId = `${name}-${uid}`
        this.renderKey = uuid()
        this.name = name
        this.type = type
        this.renderStyles = renderStyles
        this.renderProps = transformProps(props, type)
        this.renderSlots = transformSlots(slots)
        this.renderDirectives = directives
        this.renderEvents = {}
        // 交互式组件的显示状态
        this.interactiveShow = interactiveShow
        // 交互式组件
        this.isInteractiveComponent = false
        // 复合组件
        this.isComplexComponent = isComplexComponent
        // 自定义组件
        this.isCustomComponent = isCustomComponent
        // 组件被选中
        this.isActived = false
        // 附加属性
        this.attributes = {}
    }
    /**
     * @desc 组件 material 配置
     * @returns { Boolean }
     */
    get material () {
        return getMaterial(this.type)
    }
    /**
     * @desc 布局类型的组件
     * @returns { Boolean }
     */
    get layoutType () {
        return [
            'render-grid',
            'render-column',
            'free-layout'
        ].includes(this.type)
    }
    /**
     * @desc 组件的slot支持拖拽
     * @returns { Boolean }
     */
    get layoutSlot () {
        const material = getMaterial(this.type)
        if (!material) {
            return true
        }
        for (const slotName in material.slots) {
            const slot = material.slots[slotName]
            const slotComponentNameArr = Array.isArray(slot.name) ? slot.name : [slot.name]
            if (slotComponentNameArr.includes('layout')) {
                return true
            }
        }
        return false
    }
    /**
     * @desc 支持拖拽的 slot 的 layout 类型
     * @returns { Boolean }
     */
    get layoutSlotType () {
        const material = getMaterial(this.type)
        const memo = {}
        if (!material) {
            return memo
        }
        
        for (const slotName in material.slots) {
            const {
                name,
                type
            } = material.slots[slotName]
            const slotComponentNameArr = Array.isArray(name) ? name : [name]
            if (slotComponentNameArr.includes('layout')) {
                memo[slotName] = type[0]
            }
        }
        return memo
    }
    /**
     * @desc css 样式
     * @returns { Object }
     */
    get style () {
        const style = Object.keys(this.renderStyles).reduce((result, key) => {
            result[key] = this.renderStyles[key]
            return result
        }, {})
        const {
            customStyle = {}
        } = this.renderStyles
        return Object.seal(Object.assign(style, customStyle))
    }
    /**
     * @desc 组件 props
     * @returns { Object }
     */
    get prop () {
        const props = Object.keys(this.renderProps).reduce((result, propKey) => {
            result[propKey] = this.renderProps[propKey].val
            return result
        }, {})
        return Object.seal(props)
    }
    /**
     * @desc 组件 slot
     * @returns { Object }
     */
    get slot () {
        const slot = Object.keys(this.renderSlots).reduce((result, key) => {
            result[key] = this.renderSlots[key]
            return result
        }, {})
        return Object.seal(slot)
    }
    /**
     * @desc 父节点
     * @returns { Node }
     */
    get parentNode () {
        const root = getRoot()
        return findParent(root, this.componentId)
    }
    /**
     * @desc 子节点节点列表，将所有 slot 展开合并
     * @returns { Array  }
     */
    get children () {
        return flatneChildren(this)
    }

    /**
     * @desc 设置节点属性
     * @param { String } key 属性名
     * @param { Any } value 属性值
     * @returns { Node }
     */
    @readonly
    @notify
    setProperty (key, value) {
        const setKeyList = [
            'tabPanelActive',
            'renderKey',
            'interactiveShow',
            'isCustomComponent',
            'isComplexComponent'
        ]
        if (setKeyList.includes(key)) {
            this[key] = value
        }
    }

    /**
     * @desc 设置节点附加属性
     * @returns { Node }
     */
    @readonly
    @notify
    setAttribute (key, value) {
        this.attributes[key] = value
        return this
    }

    /**
     * @desc 选中组件
     * @returns { Node }
     */
    @readonly
    @notify
    active () {
        active(this)
    }
    /**
     * @desc 取消选中组件
     * @returns { Node }
     */
    @readonly
    @notify
    activeClear () {
        activeClear(this)
    }

    /**
     * @desc 重新渲染组件
     * @returns { Node }
     */
    @readonly
    @notify
    rerender () {
        rerender(this)
        return this
    }

    /**
     * @desc 添加子组件
     * @param { Node } child
     * @param { String } slotName
     * @returns { Node }
     */
    @readonly
    @notify
    appendChild (child, slotName = 'default') {
        appendChild(this, child, slotName)
        return this
    }

    /**
     * @desc 移除子组件
     * @param { Node } child
     * @returns { Node }
     */
    @readonly
    @notify
    removeChild (child) {
        removeChild(this, child)
        return this
    }

    /**
     * @desc 设置style
     * @param { Object } styles
     * @returns { Node }
     */
    @readonly
    @notify
    setRenderStyles (styles = {}) {
        setRenderStyles(this, styles)
        return this
    }

    /**
     * @desc 设置slot
     * @param { Object } slots
     * @param { String } slotName
     * @returns { Node }
     */
    @readonly
    @notify
    setRenderSlots (slots, slotName = 'default') {
        setRenderSlots(this, slots, slotName)
        return this
    }

    /**
     * @desc 设置事件
     * @param { Array } events
     * @returns { Node }
     */
    @readonly
    @notify
    setRenderEvents (events = {}) {
        setRenderEvents(this, events)
        return this
    }

    /**
     * @desc 设置属性
     * @param { Object } props
     * @returns { Node }
     */
    @readonly
    @notify
    setRenderProps (props = {}) {
        setRenderProps(this, props)
        return this
    }

    /**
     * @desc 设置指令
     * @param { Array } directives
     * @returns { Node }
     */
    @readonly
    @notify
    setRenderDirectives (directives = []) {
        setRenderDirectives(this, directives)
        return this
    }
    /**
     * @desc 设置指令
     * @param { String | Object } params1
     * @param { Number | String } params2
     * @returns { Node }
     */
    @readonly
    @notify
    setStyle (params1, params2) {
        setStyle(this, params1, params2)
        return this
    }
}
