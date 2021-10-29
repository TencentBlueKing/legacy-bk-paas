import { instanceMap } from './app'
import { removeDomScope } from './util'

// 发布订阅系统
class EventCenter {
    constructor () {
        // 缓存数据和绑定函数
        this.eventList = new Map()
    }

    /**
     * 绑定监听函数
     * @param name 事件名称
     * @param f 绑定函数
     */
    on (name, f) {
        let eventInfo = this.eventList.get(name)
        // 如果没有缓存，则初始化
        if (!eventInfo) {
            eventInfo = {
                data: {},
                callbacks: new Set()
            }
            // 放入缓存
            this.eventList.set(name, eventInfo)
        }

        eventInfo.callbacks.add(f)
    }

    // 解除绑定
    off (name, f) {
        const eventInfo = this.eventList.get(name)
        if (eventInfo) {
            if (typeof f === 'function') {
                eventInfo.callbacks.delete(f)
            } else {
                eventInfo.callbacks.clear()
            }
        }
    }

    // 发送数据
    dispatch (name, data) {
        let eventInfo = this.eventList.get(name)
        if (eventInfo) {
            // 当数据不相等时才更新
            if (eventInfo.data !== data) {
                eventInfo.data = data
                // 遍历执行所有绑定函数
                for (const f of eventInfo.callbacks) {
                    f(data)
                }
            }
        } else {
            eventInfo = {
                data: data,
                callbacks: new Set()
            }
            this.eventList.set(name, eventInfo)
        }
    }

    getData (name) {
        const eventInfo = this.eventList.get(name)
        return (eventInfo && eventInfo.data) || null
    }
}

// 实例化发布订阅对象
const eventCenter = new EventCenter()

/**
 * 格式化事件名称，保证基座应用和子应用的绑定通信
 * @param appName 应用名称
 * @param fromBaseApp 是否从基座应用发送数据
 */
function formatEventName (appName, fromBaseApp) {
    if (typeof appName !== 'string' || !appName) return ''
    return fromBaseApp ? `__from_base_app_${appName}__` : `__from_micro_app_${appName}__`
}

class EventCenterForGlobal {
    /**
     * add listener of global data
     * @param cb listener
     */
    addGlobalDataListener (cb) {
        const appName = this.appName
        // if appName exists, this is in sub app
        if (appName) {
            cb.__APP_NAME__ = appName
        }
        eventCenter.on('global', cb)
    }

    /**
     * remove listener of global data
     * @param cb listener
     */
    removeGlobalDataListener (cb) {
        if (typeof cb === 'function') {
            eventCenter.off('global', cb)
        }
    }

    /**
     * dispatch global data
     * @param data data
     */
    setGlobalData (data) {
        eventCenter.dispatch('global', data)
    }

    /**
     * clear all listener of global data
     * if appName exists, only the specified functions is cleared
     * if appName not exists, only clear the base app functions
     */
    clearGlobalDataListener () {
        const appName = this.appName
        const eventInfo = eventCenter.eventList.get('global')
        if (eventInfo) {
            for (const cb of eventInfo.callbacks) {
                if ((appName && appName === cb.__APP_NAME__) || !(appName || cb.__APP_NAME__)) {
                    eventInfo.callbacks.delete(cb)
                }
            }
        }
    }
}

// 基座应用的数据通信方法集合
export class EventCenterForBaseApp extends EventCenterForGlobal {
    /**
     * add listener
     * @param appName app.name
     * @param cb listener
     */
    addDataListener (appName, cb) {
        eventCenter.on(formatEventName(appName, false), cb)
    }

    /**
     * remove listener
     * @param appName app.name
     * @param cb listener
     */
    removeDataListener (appName, cb) {
        if (typeof cb === 'function') {
            eventCenter.off(formatEventName(appName, false), cb)
        }
    }

    /**
     * 向指定子应用发送数据
     * @param appName 子应用名称
     * @param data 对象数据
     */
    setData (appName, data) {
        eventCenter.dispatch(formatEventName(appName, true), data)
    }

    /**
     * get data from micro app or base app
     * @param appName app.name
     * @param fromBaseApp whether get data from base app, default is false
     */
    getData (appName, fromBaseApp = false) {
        return eventCenter.getData(formatEventName(appName, fromBaseApp))
    }

    /**
     * 清空某个应用的所有监听函数
     * @param appName 子应用名称
     */
    clearDataListener (appName) {
        eventCenter.off(formatEventName(appName, false))
    }
}

// 子应用的数据通信方法集合
export class EventCenterForMicroApp extends EventCenterForGlobal {
    constructor (appName) {
        super()
        this.appName = appName
    }

    /**
     * 监听基座应用发送的数据
     * @param cb 绑定函数
     */
    addDataListener (cb) {
        eventCenter.on(formatEventName(this.appName, true), cb)
    }

    /**
     * 解除监听函数
     * @param cb 绑定函数
     */
    removeDataListener (cb) {
        if (typeof cb === 'function') {
            eventCenter.off(formatEventName(this.appName, true), cb)
        }
    }

    /**
     * get data from base app
     */
    getData () {
        return eventCenter.getData(formatEventName(this.appName, true))
    }

    /**
     * 向基座应用发送数据
     * @param data 对象数据
     */
    dispatch (data) {
        removeDomScope()
        eventCenter.dispatch(formatEventName(this.appName, false), data)
        const app = instanceMap.get(this.appName)
        if (app && app.container) {
            // 子应用以自定义事件的形式发送数据
            const event = new CustomEvent('datachange', {
                detail: {
                    data
                }
            })

            app.container.dispatchEvent(event)
        }
    }

    /**
     * 清空当前子应用绑定的所有监听函数
     */
    clearDataListener () {
        eventCenter.off(formatEventName(this.appName, true))
    }
}
