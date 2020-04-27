import Vue from 'vue'
let hasInitZIndex = false
let zIndex

(function () {
    if (!window['__bk_zIndex_manager']) {
        const zIndexManager = {
            nextZIndex: function (zIndex = 'default') {
                return zIndex === 'default' ? zIndexManager.zIndex++ : zIndex
            }
        }
        Object.defineProperty(zIndexManager, 'zIndex', {
            configurable: true,
            get () {
                if (!hasInitZIndex) {
                    zIndex = zIndex || (Vue.prototype.$BK_EL || {}).zIndex || 2000
                    hasInitZIndex = true
                }
                return zIndex
            },
            set (value) {
                zIndex = value
            }
        })
        window['__bk_zIndex_manager'] = zIndexManager
    }
})()

export default window['__bk_zIndex_manager']
