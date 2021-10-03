import { isFunction } from './util'

const boundedMap = new WeakMap()
export function isBoundedFunction (value) {
    if (boundedMap.has(value)) {
        return boundedMap.get(value)
    }

    // bind function
    const boundFunction = value.name.indexOf('bound ') === 0 && !value.hasOwnProperty('prototype')

    boundedMap.set(value, boundFunction)

    return boundFunction
}

const constructorMap = new WeakMap()
function isConstructor (value) {
    if (constructorMap.has(value)) {
        return constructorMap.get(value)
    }

    const valueStr = value.toString()

    const result = (value.prototype && value.prototype.constructor === value && Object.getOwnPropertyNames(value.prototype).length > 1)
        || /^function\s+[A-Z]/.test(valueStr)
        || /^class\s+/.test(valueStr)

    constructorMap.set(value, result)

    return result
}

const rawWindowMethodMap = new WeakMap()
export default function bindFunctionToRawWidow (rawWindow, value) {
    if (rawWindowMethodMap.has(value)) {
        return rawWindowMethodMap.get(value)
    }

    if (isFunction(value) && !isConstructor(value) && !isBoundedFunction(value)) {
        const bindRawWindowValue = value.bind(rawWindow)

        for (const key in value) {
            bindRawWindowValue[key] = value[key]
        }

        if (value.hasOwnProperty('prototype') && !bindRawWindowValue.hasOwnProperty('prototype')) {
            bindRawWindowValue.prototype = value.prototype
        }

        rawWindowMethodMap.set(value, bindRawWindowValue)
        return bindRawWindowValue
    }

    return value
}
