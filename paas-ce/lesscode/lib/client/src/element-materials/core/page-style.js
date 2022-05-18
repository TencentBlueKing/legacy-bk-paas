import {
    triggerEventListener
} from './event'
import { toHyphenate } from './helper/utils'

const config = {}

export const getPageStyle = function () {
    const style = {}
    Object.keys(config).forEach(key => {
        if (key !== 'customStyle') {
            style[toHyphenate(key)] = config[key]
        }
    })
    const {
        customStyle = {}
    } = config
    Object.keys(customStyle).forEach(key => {
        style[toHyphenate(key)] = customStyle[key]
    })
    
    return style
}

export const setPageStyle = function (value) {
    Object.assign(config, value)
    triggerEventListener('setPageStyle')
}
