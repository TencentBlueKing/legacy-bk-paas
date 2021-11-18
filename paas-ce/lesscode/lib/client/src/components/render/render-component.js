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
            'padding': 'initial',
            'paddingTop': 'initial',
            'paddingRight': 'initial',
            'paddingBottom': 'initial',
            'paddingLeft': 'initial',
            'margin': 'initial',
            'marginTop': 'initial',
            'marginRight': 'initial',
            'marginBottom': 'initial',
            'marginLeft': 'initial',
            'transform': 'initial'
        }
        if (context.parent.attachToFreelayout) {
            // 在 freelayout 里面时对组件进行位置修正，
            // 基础组件的根可能会有定位样式(relative, absolute)当top、right、bottom、left 生效时会导致偏移
            Object.assign(nativeComponentStyleReset, {
                top: 'initial',
                right: 'initial',
                bottom: 'initial',
                left: 'initial'
            })
        }

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

        // const widthChangeableCompoennts = ['img', 'p', 'span', 'bk-link', 'el-link']
        // if (!widthChangeableCompoennts.includes(componentData.type)) {
        //     delete renderStyles.width
        // }

        const renderSlotMap = Object.keys(componentData.slot).reduce((result, slotName) => {
            const slotList = Array.isArray(componentData.slot[slotName])
                ? componentData.slot[slotName]
                : [componentData.slot[slotName]]

            result[slotName] = () => slotList.map(slot => {
                // 如果是组件渲染组件
                if (LC.isNode(slot)) {
                    return h('ResolveComponent', {
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

        return h('span',
            {
                style: {
                    'font-size': 'initial'
                }
            },
            [
                h(componentData.type, {
                    // key: params['component-type'] === 'bk-sideslider' ? 'bk-slider' : refreshKey, // sideSlider 固定key，防止属性修改动画刷新
                    key: componentData.renderKey,
                    props,
                    attrs: {
                        role: componentData.type
                    },
                    on: events,
                    scopedSlots: renderSlotMap,
                    style: Object.assign({}, componentData.style, nativeComponentStyleReset)
                }, renderSlotMap.default && renderSlotMap.default())
            ])
    }
}
