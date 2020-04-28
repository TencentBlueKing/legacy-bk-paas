
// 获取唯一随机数
function uuid () {
    let id = ''
    const randomNum = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

    for (let i = 0; i < 7; i++) {
        id += randomNum
    }
    return id
}

(function () {
    if (!window['__bk_pop_manager']) {
        const __containerId = `bk_pop_${new Date().getTime()}`
        const __maskId = `bk_pop_mask_${new Date().getTime()}`
        const __defaultKey = `bk_pop_key_${new Date().getTime()}`
        let __popInstances = []
        const popManager = {
            containerId: __containerId,
            maskId: __maskId,
            defaultKey: __defaultKey,
            formatKey: function (key) {
                return String(key).replace(/#/g, '_')
            },
            /**
             * 显示弹框
             * key： 唯一ID，可以是组件Name
             * instance： 弹出DOM实例
             * options： tplAction，弹出模式（keepAll，保持所有弹出；onlyone，只保留最后一个）
             */
            show: function (key, instance, options = { tplAction: 'keepAll', zIndex: '', beforeHide: () => {} }) {
                key = (key === undefined || key === null || Number.isNaN(key)) ? this.defaultKey : key
                key = this.formatKey(key)
                const uid = uuid()
                let isAppendToBody = false
                if (options.tplAction === 'onlyone') {
                    this.clearByTpl(key)
                }

                if (this.shouldAppendToBody(key)) {
                    isAppendToBody = true
                    this.showModalMask(options.zIndex)
                    this.container.append(instance)
                } else {
                    isAppendToBody = false
                    this.showModalMask(options.zIndex - 1)
                }
                this.instances.push({ uid: uid, ins: instance, tplName: key, beforeHide: options.beforeHide, zIndex: options.zIndex, isAppendToBody: isAppendToBody })
                return `${uid}#${key}`
            },
            shouldAppendToBody: function (tplName) {
                return this.instances.some(item => item.tplName === tplName)
            },
            hide: function (popId, options) {
                options = options || { action: 'hideUid' }
                switch (options.action) {
                    /** 收起所有弹框 */
                    case 'hideAll':
                        this.clearAll()
                        break
                    /** 收起指定ID的弹框 */
                    case 'hideUid':
                        this.clearByUid(popId)
                        break
                    /** 收起同一模板的弹框 */
                    case 'hideSameTpl':
                        this.clearByTpl(popId)
                        break
                    default:
                        this.autoClear(popId)
                        break
                }

                this.updateModalMaskIndex()
            },

            updateModalMaskIndex: function () {
                if (this.instances.length) {
                    const lastIns = this.instances.slice(-1)[0]
                    const lastInsZindex = lastIns.isAppendToBody ? lastIns.zIndex : lastIns.zIndex - 1
                    this.showModalMask(lastInsZindex)
                } else {
                    this.hideModalMask()
                }
            },
            autoClear: function (uid = '') {
                if (uid.indexOf('#') > 0) {
                    this.clearByUid(uid)
                } else {
                    this.clearByTpl()
                }
            },
            clearByTpl: function (uid) {
                const keyStr = uid.split('#')
                const tplName = keyStr.slice(-1)[0]
                this.instances = this.instances.filter(item => {
                    if (item.tplName === tplName) {
                        this.__hideInstance(item)
                        return false
                    } else {
                        return true
                    }
                })
            },
            clearByUid: function (uid) {
                const keyStr = uid.split('#')
                const instanceUid = keyStr[0]
                const tplName = keyStr[1]
                const index = this.instances.findIndex(ins => ins.uid === instanceUid && ins.tplName === tplName)
                if (index >= 0) {
                    this.__hideInstance(this.instances[index])
                    this.instances.splice(index, 1)
                } else {
                    console.warn('Can not find pop instance with index ' + index)
                }
            },
            clearAll: function () {
                this.instances.forEach(item => this.__hideInstance(item))
                this.instances = []
            },
            showModalMask: function (zIndex) {
                this.dialogMask.setAttribute('style', `z-index:${zIndex}; display: block;`)
                document.body.style.overflow = 'hidden'
            },
            hideModalMask: function () {
                this.dialogMask.setAttribute('style', `display: none;`)
                document.body.style.overflow = ''
            },
            __hideInstance: function (instance) {
                if (typeof instance.beforeHide === 'function') {
                    instance.beforeHide()
                    setTimeout(() => {
                        if (instance.isAppendToBody) {
                            instance.ins.remove()
                        }
                    })
                } else {
                    if (instance.isAppendToBody) {
                        instance.ins.remove()
                    }
                }
            }
        }

        Object.defineProperty(popManager, 'container', {
            get: function () {
                let container = document.querySelector('[data-bkpop-container]')
                if (!container) {
                    container = document.createElement('div')
                    container.setAttribute('id', this.containerId)
                    container.setAttribute('data-bkpop-container', 'true')
                    document.body.append(container)
                }
                return container
            }
        })

        Object.defineProperty(popManager, 'dialogMask', {
            get: function () {
                let mask = document.querySelector('[data-bkpop-mask]')
                if (!mask) {
                    mask = document.createElement('div')
                    mask.setAttribute('id', this.maskId)
                    mask.setAttribute('class', 'bk-dialog-mask')
                    mask.setAttribute('data-bkpop-mask', 'true')
                    this.container.append(mask)
                }
                return mask
            }
        })

        Object.defineProperty(popManager, 'instances', {
            get: function () {
                return __popInstances
            },
            set: function (val) {
                __popInstances = val
            }
        })
        window['__bk_pop_manager'] = popManager
    }
})()

export default window['__bk_pop_manager']
