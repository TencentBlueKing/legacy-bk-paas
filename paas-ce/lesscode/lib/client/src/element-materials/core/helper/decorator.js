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
        const event = {
            type: name,
            target: this
        }
        triggerEventListener('update', event)
        if (name === 'toggleInteractive') {
            event.interactiveShow = this.interactiveShow
            triggerEventListener('toggleInteractive', event)
        }
        if (name === 'active' && isActived !== this.isActived) {
            event.isActived = this.isActived
            triggerEventListener('active', event)
        }
        if (name === 'activeClear' && isActived !== this.isActived) {
            event.isActived = false
            triggerEventListener('activeClear', event)
        }
    }
    return descriptor
}
