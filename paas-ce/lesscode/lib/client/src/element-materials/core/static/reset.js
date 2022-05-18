import getRoot from './get-root'
import {
    triggerEventListener
} from '../event'

/**
 * @desc 重置画布数据
 */
export default function () {
    const root = getRoot()
    root.children.forEach(children => {
        root.removeChild(children)
    })
    triggerEventListener('reset')
    return true
}
