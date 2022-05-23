import { getActualTop, getActualLeft } from '@/common/util'

function setLines () {
    const lines = {
        // 横轴 上方的线
        xt: null,
        // 横轴 中间的线
        xc: null,
        // 横轴 下方的线
        xb: null,
        // 纵轴 左边的线
        yl: null,
        // 纵轴 中间的线
        yc: null,
        // 纵轴 右边的线
        yr: null
    }

    // 置入参考线
    for (const p in lines) {
        const node = lines[p] = document.createElement('div')

        node.classList.add('drag-line', p)
        node.style.cssText = `
            display: none;
            opacity: 0.7;
            position: absolute;
            background-color: #ff9700;
            z-index: 999999990;
            left: 0;
            top: 0;
            ${p[0] === 'x' ? 'width: 100%; height: 1px;' : 'width: 1px; height: 100%;'}
        `

        node.show = function () {
            this.style.display = 'block'
        }
        node.hide = function () {
            this.style.display = 'none'
        }
        node.isShow = function () {
            return this.style.display !== 'none'
        }
        node.setTranslateX = function (x) {
            node.setAttribute('translate-x', x)
            const translateY = node.getAttribute('translate-y') || 0
            node.style.transform = `translateX(${x}px) translateY(${translateY}px)`
        }
        node.setTranslateY = function (y) {
            node.setAttribute('translate-y', y)
            const translateX = node.getAttribute('translate-x') || 0
            node.style.transform = `translateX(${translateX}px) translateY(${y}px)`
        }
        document.body.appendChild(node)
    }

    return lines
}

const lines = setLines()

export default class DragLine {
    constructor (options = {}) {
        this.options = Object.assign({
            gap: 0
        }, options)
        this.setContainer(this.options.container || '')

        // 交互式组件使用了transform属性，对定位有影响。因此在定位时，需要加上偏移
        this.offset = this.options.offset || { top: 0, left: 0 }

        this.docBody = document.body

        this.hasNavLayout = !document.querySelector('.lesscode-layout-empty')

        this.mainContentNode = document.querySelector('#drawTarget')

        this.contentNode = this.mainContentNode
    }

    setContainer (container) {
        if (container) {
            if (typeof container === 'string') {
                this.options.container = document.querySelector(container)
            } else {
                this.options.container = container
            }
        } else {
            this.options.container = document.body
        }

        this.containerTop = getActualTop(this.options.container)
        this.containerLeft = getActualLeft(this.options.container)
    }

    /**
     * 检测
     *
     * @param dragNode {Element} 拖拽的那个元素
     * @param checkNodes {String|Element} 进行检测的所有元素集合
     */
    check (dragNode, checkNodes) {
        checkNodes = typeof checkNodes === 'string' ? document.querySelectorAll(checkNodes) : checkNodes

        const dragRect = dragNode.getBoundingClientRect()

        this.uncheck()
        Array.from(checkNodes).forEach(item => {
            item.classList.remove('drag-line-active')

            if (item === dragNode) {
                return
            }

            const {
                top,
                height,
                bottom,
                left,
                width,
                right
            } = item.getBoundingClientRect()

            const dragWidthHalf = dragRect.width / 2
            const itemWidthHalf = width / 2
            const dragHeightHalf = dragRect.height / 2
            const itemHeightHalf = height / 2

            // const actualTop = top - this.containerTop
            // const actualLeft = left - this.containerLeft

            const conditions = {
                top: [
                    // xt-top
                    {
                        isNearly: this._isNearly(dragRect.top, top),
                        lineNode: lines.xt,
                        lineValue: top,
                        dragValue: top
                    },
                    // xt-bottom
                    {
                        isNearly: this._isNearly(dragRect.bottom, top),
                        lineNode: lines.xt,
                        lineValue: top,
                        dragValue: top - dragRect.height
                    },
                    // xc
                    {
                        isNearly: this._isNearly(dragRect.top + dragHeightHalf, top + itemHeightHalf),
                        lineNode: lines.xc,
                        lineValue: top + itemHeightHalf,
                        dragValue: top + itemHeightHalf - dragHeightHalf
                    },
                    // xb-top
                    {
                        isNearly: this._isNearly(dragRect.bottom, bottom),
                        lineNode: lines.xb,
                        lineValue: bottom,
                        dragValue: bottom - dragRect.height
                    },
                    // xb-bottom
                    {
                        isNearly: this._isNearly(dragRect.top, bottom),
                        lineNode: lines.xb,
                        lineValue: bottom,
                        dragValue: bottom
                    }
                ],

                left: [
                    // yl-left
                    {
                        isNearly: this._isNearly(dragRect.left, left),
                        lineNode: lines.yl,
                        lineValue: left,
                        dragValue: left
                    },
                    // yl-right
                    {
                        isNearly: this._isNearly(dragRect.right, left),
                        lineNode: lines.yl,
                        lineValue: left,
                        dragValue: left - dragRect.width
                    },
                    // yc
                    {
                        isNearly: this._isNearly(dragRect.left + dragWidthHalf, left + itemWidthHalf),
                        lineNode: lines.yc,
                        lineValue: left + itemWidthHalf,
                        dragValue: left + itemWidthHalf - dragWidthHalf
                    },
                    // yr-left
                    {
                        isNearly: this._isNearly(dragRect.right, right),
                        lineNode: lines.yr,
                        lineValue: right,
                        dragValue: right - dragRect.width
                    },
                    // yr-right
                    {
                        isNearly: this._isNearly(dragRect.left, right),
                        lineNode: lines.yr,
                        lineValue: right,
                        dragValue: right
                    }
                ]
            }

            for (const key in conditions) {
                conditions[key].forEach(condition => {
                    if (!condition.isNearly) {
                        return
                    }

                    item.classList.add('drag-line-active')

                    if (key === 'left') {
                        condition.lineNode.setTranslateX(condition.lineValue)
                    } else {
                        condition.lineNode.setTranslateY(condition.lineValue)
                    }
                    condition.lineNode.show()
                })
            }
        })
    }

    uncheck () {
        Object.values(lines).forEach(item => item.hide())
        Array.from(document.querySelectorAll('.drag-line-active'))
            .forEach(item => item.classList.remove('drag-line-active'))
    }

    _isNearly (dragValue, targetValue) {
        return Math.abs(dragValue - targetValue) <= this.options.gap
    }
}
