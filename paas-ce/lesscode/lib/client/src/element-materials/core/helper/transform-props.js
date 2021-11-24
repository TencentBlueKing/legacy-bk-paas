import _ from 'lodash'

const transformProps = (props, type) => {
    const renderProps = Object.keys(props).reduce((result, propName) => {
        if (props[propName].hasOwnProperty('val') && props[propName].val !== '') {
            result[propName] = Object.assign(_.cloneDeep(props[propName]), {
                type: Array.isArray(props[propName].type) ? props[propName].type[0] : props[propName].type
            })
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
