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

        const params = Object.assign({
            ...bindProps,
            'component-type': componentData.type,
            'component-data': componentData
        }, dynamicProps)

        const renderStyles = Object.assign({}, renderData.renderStyles)
        if (componentData.type !== 'img') delete renderStyles.width

        return h(renderData.type, {
            key: refreshKey,
            props: params,
            attrs: params,
            on: {
                ...dynamicEvent
            },
            style: Object.assign({}, renderStyles, renderStyles.customStyle || {}, { top: 0, left: 0 }),
            ref: renderData.componentId
        }, context.children)
    }
}
