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
        const interactiveShow = this.interactiveShow
        const result = fn.apply(this, arguments)
        // 节点没有被添加到Node tree 中不触发事件
        if (!this.parentNode && this.type !== 'root') {
            return result
        }
        const event = {
            type: name,
            target: this
        }
        triggerEventListener('update', event)
        if (name === 'toggleInteractive') {
            event.interactiveShow = this.interactiveShow
            triggerEventListener('toggleInteractive', event)
        }
        if (name === 'hideInteractive' && !interactiveShow) {
            event.interactiveShow = false
            triggerEventListener('hideInteractive', event)
        }
        if (name === 'active' && isActived !== this.isActived) {
            event.isActived = true
            triggerEventListener('active', event)
        }
        if (name === 'activeClear' && isActived !== this.isActived) {
            event.isActived = false
            triggerEventListener('activeClear', event)
        }
        return result
    }
    return descriptor
}
