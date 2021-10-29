const transformProps = (props, type) => {
    const renderProps = Object.keys(props).reduce((result, prop) => {
        if (props[prop].hasOwnProperty('val') && props[prop].val !== '') {
            result[prop] = props[prop]
        }
        return result
    }, {})
    if (['bk-dialog', 'bk-sideslider'].includes(type)) {
        renderProps.transfer = {
            type: 'boolean',
            val: false
        }
    }
    return renderProps
}

export default transformProps
