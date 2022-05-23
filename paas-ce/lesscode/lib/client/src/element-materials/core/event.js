import Vue from 'vue'

const bus = new Vue()

/**
 * EVENT LIST:
 *
 * ready
 * error
 * activeClear
 * active
 * appendChild
 * cloneNode
 * insertAfter
 * insertBefore
 * pasteNode
 * removeChild
 * rerender
 * setProp
 * setRenderDirectives
 * setRenderEvents
 * setRenderProps
 * setRenderSlots
 * setRenderStyles
 * setSlot
 * setStyle
 * toggleInteractive
 * componentHover
 * componentMouserleave
 * appendChild
 * removeChild
 * moveChild
 * mobilePreviewSwitch
 */

export const resetEventListener = () => {
    Object.keys(bus._events).forEach(event => {
        bus._events[event].forEach(callback => {
            bus.$off(event, callback)
        })
    })
}

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
