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
        // console.log(`\n\n============= ${name} exec ==========\n\n`)
        const isActived = this.isActived
        fn.apply(this, arguments)
        // 节点没有被添加到Node tree 中不触发事件
        if (!this.parentNode) {
            return
        }
        triggerEventListener('update', this, name)
        console.log('from notif record = ', this.componentId, name, isActived, this.isActived)
        if (name === 'active' && isActived !== this.isActived) {
            triggerEventListener('active', this, name)
        }
        if (name === 'activeClear' && isActived !== this.isActived) {
            triggerEventListener('activeClear', this, name)
        }
        // console.log(`\n\n============= ${name} exec end ==========\n\n`)
    }
    return descriptor
}
