
import bindFunctionToRawWidow from './bind-function'
import { EventCenterForMicroApp } from './data'
import { getEffectivePath, defer, unique, setCurrentAppName, removeDomScope, rawWindow, rawDocument } from './util'

// 记录addEventListener、removeEventListener原生方法
const rawWindowAddEventListener = window.addEventListener
const rawWindowRemoveEventListener = window.removeEventListener
export const version = '__VERSION__'

const unscopables = {
    undefined: true,
    Array: true,
    Object: true,
    String: true,
    Boolean: true,
    Math: true,
    Number: true,
    Symbol: true,
    parseFloat: true,
    Float32Array: true
}

// Variables that can escape to rawWindow
const staticEscapeProperties = [
    'System',
    '__cjsWrapper',
    '__REACT_ERROR_OVERLAY_GLOBAL_HOOK__'
]

const escapeSetterKeyList = [
    'location'
]

/**
 * 重写全局事件的监听和解绑
 * @param microWindow 原型对象
 */
function effect (microWindow) {
    // 使用Map记录全局事件
    const eventListenerMap = new Map()

    // 重写addEventListener
    microWindow.addEventListener = function (type, listener, options) {
        const listenerList = eventListenerMap.get(type)
        // 当前事件非第一次监听，则添加缓存
        if (listenerList) {
            listenerList.add(listener)
        } else {
            // 当前事件第一次监听，则初始化数据
            eventListenerMap.set(type, new Set([listener]))
        }
        // 执行原生监听函数
        return rawWindowAddEventListener.call(window, type, listener, options)
    }

    // 重写removeEventListener
    microWindow.removeEventListener = function (type, listener, options) {
        const listenerList = eventListenerMap.get(type)
        // 从缓存中删除监听函数
        if (listenerList && listenerList.size && listenerList.has(listener)) {
            listenerList.delete(listener)
        }
        // 执行原生解绑函数
        return rawWindowRemoveEventListener.call(window, type, listener, options)
    }

    // 清空残余事件
    return () => {
        console.log('需要卸载的全局事件', eventListenerMap)
        // 清空window绑定事件
        if (eventListenerMap.size) {
            // 将残余的没有解绑的函数依次解绑
            eventListenerMap.forEach((listenerList, type) => {
                if (listenerList.size) {
                    for (const listener of listenerList) {
                        rawWindowRemoveEventListener.call(window, type, listener)
                    }
                }
            })
            eventListenerMap.clear()
        }
    }
}

export default class SandBox {
    constructor (appName, url) {
        // 沙箱是否在运行
        this.active = false

        this.scopeProperties = ['webpackJsonp']
        this.escapeProperties = []

        // 代理的对象
        this.microWindow = {}
        // 新添加的属性，在卸载时清空
        this.injectedKeys = new Set()
        this.escapeKeys = new Set() // Properties escape to rawWindow, cleared when unmount

        const descriptorTargetMap = new Map()
        const hasOwnProperty = (key) => this.microWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key)
        this.inject(this.microWindow, appName, url)

        Object.assign(this, effect(this.microWindow))

        // 卸载钩子
        this.releaseEffect = effect(this.microWindow)

        this.proxyWindow = new Proxy(this.microWindow, {
            get: (target, key) => {
                if (key === Symbol.unscopables) {
                    return unscopables
                }
                if (['window', 'self', 'globalThis'].includes(key)) {
                    return this.proxyWindow
                }
                if (key === 'top' || key === 'parent') {
                    if (rawWindow === rawWindow.parent) { // not in iframe
                        return this.proxyWindow
                    }
                    return Reflect.get(rawWindow, key) // iframe
                }
                if (key === 'hasOwnProperty') {
                    return hasOwnProperty
                }
                if (key === 'document' || key === 'eval') {
                    if (this.active) {
                        setCurrentAppName(appName)
                        defer(() => setCurrentAppName(null))
                    }
                    switch (key) {
                        case 'document':
                            return rawDocument
                        case 'eval':
                            // eslint-disable-next-line no-eval
                            return eval
                    }
                }
                if (this.scopeProperties.includes(key)) {
                    return Reflect.get(target, key)
                }
                if (Reflect.has(target, key)) {
                    return Reflect.get(target, key)
                }
                const rawValue = Reflect.get(rawWindow, key)
                return bindFunctionToRawWidow(rawWindow, rawValue)
            },
            set: (target, key, value) => {
                if (this.active) {
                    if (escapeSetterKeyList.includes(key)) {
                        Reflect.set(rawWindow, key, value)
                    } else if (!target.hasOwnProperty(key)
                        && rawWindow.hasOwnProperty(key)
                        && !this.scopeProperties.includes(key)) {
                        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key)
                        const { writable, configurable, enumerable } = descriptor
                        if (writable) {
                            Object.defineProperty(target, key, {
                                configurable,
                                enumerable,
                                writable,
                                value
                            })
                            this.injectedKeys.add(key)
                        }
                    } else {
                        Reflect.set(target, key, value)
                        this.injectedKeys.add(key)
                    }
                    if ((this.escapeProperties.includes(key)
                        || (staticEscapeProperties.includes(key) && !Reflect.has(rawWindow, key)))
                        && !this.scopeProperties.includes(key)) {
                        Reflect.set(rawWindow, key, value)
                        this.escapeKeys.add(key)
                    }
                }
                return true
            },
            has: (target, key) => {
                if (this.scopeProperties.includes(key)) {
                    return key in target
                }
                return key in unscopables || key in target || key in rawWindow
            },
            getOwnPropertyDescriptor: (target, key) => {
                if (target.hasOwnProperty(key)) {
                    descriptorTargetMap.set(key, 'target')
                    return Object.getOwnPropertyDescriptor(target, key)
                }
                if (rawWindow.hasOwnProperty(key)) {
                    descriptorTargetMap.set(key, 'rawWindow')
                    const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key)
                    if (descriptor && !descriptor.configurable) {
                        descriptor.configurable = true
                    }
                    return descriptor
                }
                return undefined
            },
            defineProperty: (target, key, value) => {
                const from = descriptorTargetMap.get(key)
                if (from === 'rawWindow') {
                    return Reflect.defineProperty(rawWindow, key, value)
                }
                return Reflect.defineProperty(target, key, value)
            },
            ownKeys: (target) => {
                return unique(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)))
            },
            deleteProperty: (target, key) => {
                if (target.hasOwnProperty(key)) {
                    if (this.escapeKeys.has(key)) {
                        Reflect.deleteProperty(rawWindow, key)
                    }
                    return Reflect.deleteProperty(target, key)
                }
                return true
            }
        })
    }

    // 启动
    start (baseroute) {
        if (!this.active) {
            this.active = true
            this.microWindow.__MICRO_APP_BASE_ROUTE__ = this.microWindow.__MICRO_APP_BASE_URL__ = baseroute
        }
    }

    // 停止
    stop () {
        if (this.active) {
            this.active = false

            // 清空变量
            this.injectedKeys.forEach((key) => {
                Reflect.deleteProperty(this.microWindow, key)
            })
            this.injectedKeys.clear()

            // 卸载全局事件
            this.releaseEffect()

            // 清空所有绑定函数
            this.microWindow.microApp.clearDataListener()
        }
    }

    // 绑定js作用域
    bindScope (code) {
        rawWindow.__MICRO_APP_PROXY_WINDOW__ = this.proxyWindow
        return `;(function(window, self){with(window){;${code}\n}}).call(window.__MICRO_APP_PROXY_WINDOW__, window.__MICRO_APP_PROXY_WINDOW__, window.__MICRO_APP_PROXY_WINDOW__);`
        // window.proxyWindow = this.proxyWindow
        // return `;(function(window, self){with(window){;${code}\n}}).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`
    }

    /**
     * nject global properties to microWindow
     * @param microWindow micro window
     * @param appName app name
     * @param url app url
     */
    inject (microWindow, appName, url) {
        microWindow.__MICRO_APP_ENVIRONMENT__ = true
        microWindow.__MICRO_APP_NAME__ = appName
        microWindow.__MICRO_APP_PUBLIC_PATH__ = getEffectivePath(url)

        // 创建数据通信对象
        microWindow.microApp = new EventCenterForMicroApp(appName)
        microWindow.rawWindow = rawWindow
        microWindow.rawDocument = rawDocument
        microWindow.removeDomScope = removeDomScope
    }
}
