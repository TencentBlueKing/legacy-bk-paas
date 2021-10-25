export default {
    name: 'component-wrapper',
    functional: true,
    render (h, context) {
        const {
            renderData,
            bindProps,
            componentData,
            refreshKey
        } = context.props

        const {
            interactiveComponents
        } = context.parent

        const dynamicProps = interactiveComponents.includes(renderData.type)
            ? {
                'value': renderData.interactiveShow
            } : {}
        const dynamicEvent = interactiveComponents.includes(renderData.type)
            ? {
                input: (event) => {
                    renderData.interactiveShow = event
                }
            } : {}

        /** 设置了静态的变量，即使值改变，但不在画布中绑定和渲染 */
        const renderPropsObj = renderData.renderProps
        for (const [key, value] of Object.entries(renderPropsObj)) {
            if (Object.prototype.hasOwnProperty.call(value, 'staticValue')) {
                bindProps[key] = value.staticValue
            }
        }
        const params = Object.assign({
            ...bindProps,
            'component-type': componentData.type,
            'component-data': componentData
        }, dynamicProps)

        const renderStyles = Object.assign({}, renderData.renderStyles, renderData.renderStyles.customStyle || {})

        const widthChangeableCompoennts = ['img', 'p', 'span', 'bk-link', 'el-link']
        if (!widthChangeableCompoennts.includes(componentData.type)) delete renderStyles.width

        const scopedSlots = context.children.reduce((acc, cur) => {
            const slotKey = cur.data && cur.data.slot
            if (slotKey) {
                if (!acc[slotKey]) {
                    acc[slotKey] = () => acc[slotKey].slots
                    acc[slotKey].slots = []
                }
                acc[slotKey].slots.push(cur)
            }
            return acc
        }, {})
        // 画布margin属性加在上一层、不直接加在组件上
        const marginStyle = { margin: 0, marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 }
        
        return h('span',
            {
                style: { 'font-size': 'initial', width: params['component-type'] === 'bk-color-picker' ? 'inherit' : '' }
            },
            [
                h(renderData.type, {
                    key: params['component-type'] === 'bk-sideslider' ? 'bk-slider' : refreshKey, // sideSlider 固定key，防止属性修改动画刷新
                    props: params,
                    attrs: params,
                    on: {
                        ...dynamicEvent
                    },
                    scopedSlots,
                    style: Object.assign({}, renderStyles, renderStyles.customStyle || {}, { top: 0, left: 0 }, marginStyle),
                    ref: renderData.componentId
                }, context.children)
            ])
    }
}
