import loadHtml from './source'
import Sandbox from './sandbox'

export const instanceMap = new Map()

export default class App {
    constructor ({ name, entry, route, container }) {
        this.name = name
        this.entry = entry
        this.container = container
        this.route = route || ''
        this.status = 'loading'
        loadHtml(this)
        this.sandbox = new Sandbox(name, entry)
    }

    // created/loading/mounted/unmount
    status = 'created'

    // 存放应用的静态资源
    source = {
        links: new Map(), // link元素对应的静态资源
        scripts: new Map() // script元素对应的静态资源
    }

    // 资源加载完时执行
    onLoad (elem) {
        if (this.status !== 'unmount') {
            // 记录DOM结构用于后续操作
            this.source.html = elem
            // 执行mount方法
            this.mount()
        }
    }

    // 资源加载完成后进行渲染
    mount () {
        // 克隆DOM节点
        const cloneHtml = this.source.html.cloneNode(true)
        // 创建一个fragment节点作为模版，这样不会产生冗余的元素
        const fragment = document.createDocumentFragment()
        Array.from(cloneHtml.childNodes).forEach(node => {
            fragment.appendChild(node)
        })

        // 将格式化后的DOM结构插入到容器中
        this.container.appendChild(fragment)

        this.sandbox.start(this.route)

        console.error(this.source.scripts)

        // 执行js
        this.source.scripts.forEach(info => {
            // eslint-disable-next-line no-eval
            // (0, eval)(this.sandbox.bindScope(info.code))
            try {
                const code = this.sandbox.bindScope(info.code)
                console.warn(code)
                // eslint-disable-next-line no-new-func
                Function(code)()
            } catch (e) {
                console.error('[lesscode-canvas from runScript]', e)
            }
        })

        // 标记应用为已渲染
        this.status = 'mounted'
    }

    // 卸载应用
    unmount (destory) {
        // 更新状态
        this.status = 'unmount'
        // 清空容器
        this.container = null
        this.sandbox.stop()
        // destory为true，则删除应用
        if (destory) {
            instanceMap.delete(this.name)
        }
    }
}
