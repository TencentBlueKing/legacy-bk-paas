import LC from '@/element-materials/core'

export default {
    name: 'render-component',
    functional: true,
    render (h, context) {
        const {
            componentData
        } = context.props

        // fix
        const nativeComponentStyleReset = {
            // 修正组件会影响位置的样式
            'margin': '',
            'marginTop': '',
            'marginRight': '',
            'marginBottom': '',
            'marginLeft': '',
            'transform': '',
            // 修正会产生叠加效果的样式
            border: '',
            'box-shadow': ''
        }
        // fix
        // - 在 freelayout 里面时对组件进行位置修正
        // - 对非交互式组件对组件进行位置修正
        // 基础组件的根可能会有定位样式(relative, absolute)当top、right、bottom、left 生效时会导致偏移
        if (context.parent.attachToFreelayout
            || componentData.isInteractiveComponent) {
            Object.assign(nativeComponentStyleReset, {
                position: '',
                top: '',
                right: '',
                bottom: '',
                left: ''
            })
        }
        
        if (!context.parent.isShadowComponent) {
            Object.assign(nativeComponentStyleReset, {
                // fix: 基础组件的层级最低（基础组件可能本身有 border 样式，保证组件选中和 hover 时的边框效果能显示出来）
                'z-index': 0,
                // fix: 隔绝基础组件的鼠标事件响应
                'pointer-events': 'none'
            })
        }

        // 如果是画布区域的 shadow 组件需要透传 componentData
        const props = Object.assign({}, componentData.prop, {
            'component-data': componentData,
            'show-mask': false
        })
        const events = {}

        // 交互式组件需要处理隐藏显示逻辑
        if (componentData.isInteractiveComponent) {
            props.value = componentData.interactiveShow
            events.input = value => {
                componentData.setProperty('interactiveShow', value)
            }
        }

        const attrs = {
            role: componentData.type
        }
        
        Object.keys(context.parent.material.props || {}).forEach(propName => {
            const propConfig = context.parent.material.props[propName]
            // prop 被标记为 staticValue，在画布编辑时不动态改变
            // 永远使用默认值
            if (Object.prototype.hasOwnProperty.call(propConfig, 'staticValue')) {
                props[propName] = propConfig.staticValue
            }
            // fix: vue 特性，class、style默认会被子组件继承
            if (['class', 'style'].includes(propName)) {
                attrs[propName] = componentData.prop[propName]
            }
        })
        
        // 为基础组件打上标记
        if (!context.parent.isShadowComponent) {
            attrs['data-base-component'] = true
        }

        const renderSlotMap = Object.keys(componentData.slot).reduce((result, slotName) => {
            const slotList = Array.isArray(componentData.slot[slotName])
                ? componentData.slot[slotName]
                : [componentData.slot[slotName]]

            result[slotName] = () => slotList.map(slot => {
                // 如果是组件渲染组件
                if (LC.isNode(slot)) {
                    return h('resolve-component', {
                        props: {
                            componentData: slot
                        },
                        key: slot.renderKey
                    })
                }
                // 渲染组件slot配置
                return h('render-slot', {
                    props: {
                        slotData: slot
                    }
                })
            })
            return result
        }, {})

        return h(componentData.type, {
            key: componentData.renderKey,
            props,
            attrs,
            on: events,
            scopedSlots: renderSlotMap,
            style: Object.assign({}, componentData.style, nativeComponentStyleReset)
        }, renderSlotMap.default && renderSlotMap.default())
    }
}
