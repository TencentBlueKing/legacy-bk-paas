/**
const eventEmitter = new EventEmitter()
function ttt (data) {
    console.log(data)
}
eventEmitter.on('test', ttt)

eventEmitter.dispatch('test', { xx: 11 })
*/

export default class EventEmitter {
    constructor () {
        this.eventList = {}
    }

    /**
     * 订阅
     */
    on (name, fn) {
        const me = this
        if (!me.eventList[name]) {
            me.eventList[name] = []
        }
        me.eventList[name].push(fn)
        return me
    }

    /**
     * 订阅一次
     */
    once (name, fn) {
        const me = this
        function on () {
            me.off(name, on)
            fn.apply(me, arguments)
        }
        on.fn = fn
        me.on(name, on)
        return me
    }

    /**
     * 取消订阅
     */
    off (name, fn) {
        const me = this
        const fnList = me.eventList[name]
        // 如果缓存列表中没有相应的 fn，返回false
        if (!fnList) {
            return false
        }

        // 不传入具体函数则是清空
        if (!fn) {
            fnList && (fnList.length = 0)
        } else {
            let callback
            for (let i = 0, len = fnList.length; i < len; i++) {
                callback = fnList[i]
                if (callback === fn || callback.fn === fn) {
                    fnList.splice(i, 1)
                    break
                }
            }
        }
        return me
    }

    /**
     * 发布
     */
    dispatch () {
        const me = this
        const name = [].shift.call(arguments)
        const fns = [...me.eventList[name]]
        if (!fns || fns.length === 0) {
            return false
        }
        fns.forEach(fn => {
            fn.apply(me, arguments)
        })
        return me
    }
}
