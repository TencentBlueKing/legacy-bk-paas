import { bus } from '@/common/bus'

export const addEventListener = (eventName, callback) => {
    bus.$on(eventName, callback)
}

export const removeEventListener = (eventName, callback) => {
    bus.$off(eventName, callback)
}

export const triggerEventListener = (...values) => {
    const eventName = values[0]
    bus.$emit(eventName, ...values.slice(1))
}
