import LC from '@/element-materials/core'

export default {
    name: 'render-component',
    functional: true,
    render (h, context) {
        const {
            componentData
        } = context.props

        const nativeComponentStyleReset = {
            // 修正组件会影响位置的样式
            'padding': '',
            'paddingTop': '',
            'paddingRight': '',
            'paddingBottom': '',
            'paddingLeft': '',
            'margin': '',
            'marginTop': '',
            'marginRight': '',
            'marginBottom': '',
            'marginLeft': '',
            'transform': ''
        }
        // 在 freelayout 里面时对组件进行位置修正，
        // 基础组件的根可能会有定位样式(relative, absolute)当top、right、bottom、left 生效时会导致偏移
        if (context.parent.attachToFreelayout) {
            Object.assign(nativeComponentStyleReset, {
                top: '',
                right: '',
                bottom: '',
                left: ''
            })
        }
        // 隔绝基础组件的鼠标事件响应
        if (context.parent.checkNativeComponent(componentData.type)) {
            Object.assign(nativeComponentStyleReset, {
                'pointer-events': 'none'
            })
        }

        // 如果是画布区域的 shadow 组件需要透传 componentData
        const props = Object.assign({}, componentData.prop, {
            'component-data': componentData
        })
        const events = {}

        // 交互式组件需要处理隐藏显示逻辑
        if (componentData.isInteractiveComponent) {
            props.value = componentData.interactiveShow
            events.input = value => {
                componentData.setProperty('interactiveShow', value)
            }
        }

        /** 设置了静态的变量，即使值改变，但不在画布中绑定和渲染 */
        for (const [key, value] of Object.entries(componentData.prop)) {
            if (Object.prototype.hasOwnProperty.call(value, 'staticValue')) {
                props[key] = value.staticValue
            }
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
            attrs: {
                role: componentData.type
            },
            on: events,
            scopedSlots: renderSlotMap,
            style: Object.assign({}, componentData.style, nativeComponentStyleReset)
        }, renderSlotMap.default && renderSlotMap.default())
    }
}
