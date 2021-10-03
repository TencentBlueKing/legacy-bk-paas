import App, { instanceMap } from './app'
import { patchElementPrototypeMethods } from './patch'

class LesscodeCanvas extends HTMLElement {
    // eslint-disable-next-line no-useless-constructor
    constructor () {
        super()

        patchElementPrototypeMethods()
    }

    static get observedAttributes () {
        return ['name', 'entry', 'route']
    }

    // 在 custom element 增加、删除或者修改某个属性时被调用。
    attributeChangedCallback (attrName, oldValue, newValue) {
        // console.warn(`attrName: ${attrName} --- oldValue: ${oldValue} --- newValue: ${newValue}`)
        // this.render()
        if (attrName === 'name' && !this.name && newValue) {
            this.name = newValue
        } else if (attrName === 'entry' && !this.entry && newValue) {
            this.entry = newValue
        } else if (attrName === 'route' && !this.route && newValue) {
            this.route = newValue
        }
    }

    // 当 custom element 首次被插入文档 DOM 时，被调用
    connectedCallback () {
        // console.warn('connectedCallback')
        // console.error(this)
        // console.warn(`name: ${this.name} --- entry: ${this.entry} --- route: ${this.route}`)
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

export default function defineElement () {
    window.customElements.define('lesscode-canvas', LesscodeCanvas)
}
