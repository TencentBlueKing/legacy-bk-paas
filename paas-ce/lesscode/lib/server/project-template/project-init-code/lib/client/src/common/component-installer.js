export default function (component, afterInstall) {
    component.install = (Vue, options = {}) => {
        const props = component.props || {}
        Object.keys(options).forEach(key => {
            if (props.hasOwnProperty(key)) {
                if (typeof props[key] === 'function' || props[key] instanceof Array) {
                    props[key] = {
                        type: props[key],
                        default: options[key]
                    }
                } else {
                    props[key].default = options[key]
                }
            }
        })

        component.name = options.namespace ? component.name.replace('bk', options.namespace) : component.name

        Vue.component(component.name, component)

        typeof afterInstall === 'function' && afterInstall(Vue, options)
    }
}
