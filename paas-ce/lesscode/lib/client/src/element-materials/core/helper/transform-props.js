export default function (props, defaultRenderProps = {}, type = '') {
    const renderProps = Object.keys(props).reduce((result, propName) => {
        if (props[propName].hasOwnProperty('val')
            && props[propName].val !== '') {
            const {
                type,
                val,
                payload = {}
            } = props[propName]
            result[propName] = {
                format: 'value',
                code: val,
                renderValue: val,
                valueType: Array.isArray(type) ? type[0] : type,
                payload
            }
        }
        return result
    }, {})
    
    Object.keys(defaultRenderProps).forEach(propName => {
        const {
            type,
            val,
            payload = {}
        } = defaultRenderProps[propName]

        renderProps[propName] = {
            format: 'value',
            code: val,
            valueType: type,
            payload,
            renderValue: val
        }
    })
    if (['bk-dialog', 'bk-sideslider'].includes(type)) {
        renderProps.transfer = {
            type: 'v-bind',
            prop: 'transfer',
            format: 'value',
            code: false,
            valueType: 'boolean'
        }
    }

    return renderProps
}
