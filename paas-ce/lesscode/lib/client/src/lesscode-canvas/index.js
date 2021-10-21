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

    // 在 custom element 增加、删除或者修改某个属性时被调用。
    attributeChangedCallback (attrName, oldValue, newValue) {
        // console.warn(`attrName: ${attrName} --- oldValue: ${oldValue} --- newValue: ${newValue}`)
        if (newValue) {
            this[attrName] = newValue
        }
        // if (attrName === 'name' && !this.name && newValue) {
        //     this.name = newValue
        // } else if (attrName === 'entry' && !this.entry && newValue) {
        //     this.entry = newValue
        // } else if (attrName === 'route' && !this.route && newValue) {
        //     this.route = newValue
        // }
    }

    // 当 custom element 首次被插入文档 DOM 时，被调用
    connectedCallback () {
        // console.log('connectedCallbackconnectedCallbackconnectedCallback')
        this.entry = this.host.replace(/\/$/, '') + '/' + this.path.replace(/^\//, '')
        console.warn(this.name, this.host, this.path, this.route, this.entry)
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
        console.warn('adoptedCallback')
    }

    // 当 custom element 从文档 DOM 中删除时，被调用
    disconnectedCallback () {
        console.warn('disconnectedCallback')
    }
}

function start () {
    window.customElements.define('lesscode-canvas', LesscodeCanvas)
}

export default {
    start
}
