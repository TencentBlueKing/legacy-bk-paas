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
        const rederPropsObj = renderData.renderProps
        for (const [key, value] of Object.entries(rederPropsObj)) {
            if (Object.prototype.hasOwnProperty.call(value, 'staticValue')) {
                bindProps[key] = value.staticValue
            }
        }
        const params = Object.assign({
            ...bindProps,
            'component-type': componentData.type,
            'component-data': componentData
        }, dynamicProps)

        const renderStyles = Object.assign({}, renderData.renderStyles)
        if (componentData.type !== 'img') delete renderStyles.width

        return h(renderData.type, {
            key: params['component-type'] === 'bk-sideslider' ? 'bk-slider' : refreshKey, // sideSlider 固定key，防止属性修改动画刷新
            props: params,
            attrs: params,
            on: {
                ...dynamicEvent
            },
            scopedSlots: context.children.reduce((acc, cur) => {
                const slotKey = cur.data && cur.data.slot
                if (slotKey) {
                    acc[slotKey] = () => cur
                }
                return acc
            }, {}),
            style: Object.assign({}, renderStyles, renderStyles.customStyle || {}, { top: 0, left: 0 }),
            ref: renderData.componentId
        }, context.children)
    }
}
