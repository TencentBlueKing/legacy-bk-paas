import App, { instanceMap } from './app'
import { patchElementPrototypeMethods } from './patch'

class LesscodeCanvas extends HTMLElement {
    // eslint-disable-next-line no-useless-constructor
    constructor () {
        super()

        const location = window.location
        this.host = location.protocol + '//' + location.host

        patchElementPrototypeMethods()
    }

    static get observedAttributes () {
        return ['name', 'host', 'path', 'route']
    }

    /**
     * 在 custom element 增加、删除或者修改某个属性时被调用
     *
     * @param {string} attrName 变化的属性
     * @param {string} oldValue 变化前的值
     * @param {string} newValue 变化后的值
     *
     * name: 子应用名字
     * host: 子应用的 host
     *      dev 时开启另一个端口，便于 hotreload
     *      生产环境时为空，使用当前父应用的 host，为了满足生产环境不便于启动多端口的情况
     * path: 拉取子应用入口 html 的 path。
     *      子应用入口 html 完整路径为 host + path。同时此 path 还要适配子应用中动态插入的静态资源的路径
     * route: 子应用的 base route，会挂载到 window.__MICRO_APP_BASE_ROUTE__ 便于子应用获取
     */
    attributeChangedCallback (attrName, oldValue, newValue) {
        console.error('-------- attributeChangedCallback --------')
        console.warn(`attrName: ${attrName} --- oldValue: ${oldValue} --- newValue: ${newValue}`)
        if (newValue) {
            this[attrName] = newValue
        }
    }

    // 当 custom element 首次被插入文档 DOM 时，被调用
    connectedCallback () {
        console.error('-------- connectedCallback --------')
        // console.log('connectedCallbackconnectedCallbackconnectedCallback')
        this.entry = this.host.replace(/\/$/, '') + '/' + this.path.replace(/^\//, '')
        console.log(this.name, this.host, this.path, this.route, this.entry)
        const app = new App({
            name: this.name,
            entry: this.entry,
            route: this.route,
            container: this
        })
        // 记入缓存，用于后续功能
        instanceMap.set(this.name, app)
    }

    // 当 custom element 被移动到新的文档时，被调用
    adoptedCallback () {
        console.warn('-------- adoptedCallback --------')
    }

    // 当 custom element 从文档 DOM 中删除时，被调用
    disconnectedCallback () {
        console.warn('-------- disconnectedCallback --------')
    }
}

function start () {
    window.customElements.define('lesscode-canvas', LesscodeCanvas)
}

export default {
    start
}
