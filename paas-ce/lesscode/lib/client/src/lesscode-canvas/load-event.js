function eventHandler (event, element) {
    Object.defineProperties(event, {
        currentTarget: {
            get () {
                return element
            }
        },
        srcElement: {
            get () {
                return element
            }
        },
        target: {
            get () {
                return element
            }
        }
    })
}

export function dispatchOnLoadEvent (element) {
    const event = new CustomEvent('load')
    eventHandler(event, element)
    if (typeof element.onload === 'function') {
        element.onload(event)
    } else {
        element.dispatchEvent(event)
    }
}

export function dispatchOnErrorEvent (element) {
    const event = new CustomEvent('error')
    eventHandler(event, element)
    if (typeof element.onerror === 'function') {
        element.onerror(event)
    } else {
        element.dispatchEvent(event)
    }
}
