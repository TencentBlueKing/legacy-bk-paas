import {
    triggerEventListener
} from '../event'

export function readonly (target, name, descriptor) {
    descriptor.writable = false
    return descriptor
}

export function notify (target, name, descriptor) {
    const fn = descriptor.value
    descriptor.value = function () {
        const isActived = this.isActived
        fn.apply(this, arguments)
        // 节点没有被添加到Node tree 中不触发事件
        if (!this.parentNode && this.type !== 'root') {
            return
        }
        triggerEventListener('update', this, name)
        if (name === 'active' && isActived !== this.isActived) {
            triggerEventListener('active', this, name)
        }
        if (name === 'activeClear' && isActived !== this.isActived) {
            triggerEventListener('activeClear', this, name)
        }
    }
    return descriptor
}
