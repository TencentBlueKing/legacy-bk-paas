import { instanceMap } from './app'

// 发布订阅系统
class EventCenter {
  // 缓存数据和绑定函数
  eventList = new Map()
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

      // 记录绑定函数
      eventInfo.callbacks.add(f)
  }

  // 解除绑定
  off (name, f) {
      const eventInfo = this.eventList.get(name)
      // eventInfo存在且f为函数则卸载指定函数
      if (eventInfo && typeof f === 'function') {
          eventInfo.callbacks.delete(f)
      }
  }

  // 发送数据
  dispatch (name, data) {
      const eventInfo = this.eventList.get(name)
      // 当数据不相等时才更新
      if (eventInfo && eventInfo.data !== data) {
          eventInfo.data = data
          // 遍历执行所有绑定函数
          for (const f of eventInfo.callbacks) {
              f(data)
          }
      }
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

// 基座应用的数据通信方法集合
export class EventCenterForBaseApp {
    /**
   * 向指定子应用发送数据
   * @param appName 子应用名称
   * @param data 对象数据
   */
    setData (appName, data) {
        eventCenter.dispatch(formatEventName(appName, true), data)
    }

    /**
   * 清空某个应用的监听函数
   * @param appName 子应用名称
   */
    clearDataListener (appName) {
        eventCenter.off(formatEventName(appName, false))
    }
}

// 子应用的数据通信方法集合
export class EventCenterForMicroApp {
    constructor (appName) {
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
   * 向基座应用发送数据
   * @param data 对象数据
   */
    dispatch (data) {
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
