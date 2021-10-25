const transformProps = (props, type) => {
    const renderProps = Object.keys(props).reduce((result, k) => {
        if (props[k].hasOwnProperty('val') && props[k].val !== '') {
            result[k] = props[k]
        }
        return result
    }, {})
    if (['bk-dialog', 'bk-sideslider'].includes(type)) {
        renderProps.transfer = {
            type: Boolean,
            val: false
        }
    }
    return renderProps
}

export default transformProps
