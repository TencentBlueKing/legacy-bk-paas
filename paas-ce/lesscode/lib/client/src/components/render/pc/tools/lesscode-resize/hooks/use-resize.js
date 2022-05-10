import {
    reactive,
    toRefs,
    getCurrentInstance,
    onMounted,
    onBeforeUnmount,
    nextTick
} from '@vue/composition-api'
import _ from 'lodash'
import DragLine from '../../../../common/drag-line'

// const halfDotSize = 8

const tipWithMouseOffset = 10

export default function () {
    const { proxy } = getCurrentInstance()

    console.log('adfafadafadfadfa', getCurrentInstance().proxy)
    let isWidthResizeable = false
    let isHeightResizeable = false
    let startScreenX = 0
    let startScreenY = 0
    let moveStartWidth = 0
    let moveStartHeight = 0
            
    const state = reactive({
        tipStyles: {},
        size: {}
    })
    let dragLine = null
    /**
     * @desc 设置宽度
     * @param { Event } event
     */
    const handleResizeWidth = (event) => {
        isWidthResizeable = true
        startScreenX = event.clientX
        const $target = proxy.activeComponentData.$elm
        const {
            width
        } = $target.getBoundingClientRect()
        document.body.style.userSelect = 'none'
        moveStartWidth = width
        if (!dragLine) {
            dragLine = new DragLine({
                container: proxy.activeComponentData.parentNode.$elm
            })
        }
    }
    /**
     * @desc 设置高度
     * @param { Event } event
     */
    const handleResizeHeight = (event) => {
        isHeightResizeable = true
        startScreenY = event.clientY
        const $target = proxy.activeComponentData.$elm
        const {
            height
        } = $target.getBoundingClientRect()
        document.body.style.userSelect = 'none'
        moveStartHeight = height
        if (!dragLine) {
            dragLine = new DragLine({
                container: proxy.activeComponentData.parentNode.$elm
            })
        }
    }
    /**
     * @desc 同时设置高度、宽度
     * @param { Event } event
     */
    const handleResizeBoth = (event) => {
        handleResizeWidth(event)
        handleResizeHeight(event)
    }
    /**
     * @desc 放开鼠标取消拖动状态
     */
    const handleMouseup = () => {
        isHeightResizeable = false
        isWidthResizeable = false
        document.body.style.userSelect = ''
        state.tipStyles = {
            display: 'none'
        }
        if (dragLine) {
            dragLine.uncheck()
            dragLine = null
        }
    }
    /**
     * @desc mousemove 事件，动态更新容器宽度
     * @param {Object} event
     */
    const eventMousemove = (event) => {
        if (!isWidthResizeable && !isHeightResizeable) {
            return
        }
        let newHeight = 0
        let newWidth = 0
        const { clientX } = event
        if (isWidthResizeable) {
            newWidth = Math.max(parseInt(clientX - startScreenX + moveStartWidth, 10), 0)
            proxy.activeComponentData.setStyle('width', `${newWidth}px`)
        }
        const { clientY } = event
        if (isHeightResizeable) {
            newHeight = Math.max(parseInt(clientY - startScreenY + moveStartHeight, 10), 0)
            proxy.activeComponentData.setStyle('height', `${newHeight}px`)
        }

        const {
            width,
            height
        } = proxy.activeComponentData.$elm.getBoundingClientRect()

        state.size = {
            width: newWidth || width,
            height: newHeight || height
        }

        dragLine.check(proxy.activeComponentData.$elm, '[role="component-root"]')

        nextTick(() => {
            const {
                top: containerTop,
                right: containerRight,
                bottom: containerBottom,
                left: containerLeft
            } = document.body.querySelector('#lesscodeDrawHorizontalWrapper').getBoundingClientRect()
            const {
                width: tipSafeWidth,
                height: tipSafeHieght
            } = proxy.tipRef.getBoundingClientRect()

            console.log('from evemoveuse = ', clientY, containerTop)
            let tipTop = clientY - containerTop + tipWithMouseOffset
            let tipLeft = clientX - containerLeft + tipWithMouseOffset
            if (clientY + tipSafeHieght + tipWithMouseOffset > containerBottom) {
                tipTop = clientY - containerTop - tipSafeHieght - tipWithMouseOffset
            }
            if (clientX + tipSafeWidth + tipWithMouseOffset > containerRight) {
                tipLeft = clientX - containerLeft - tipSafeWidth - tipWithMouseOffset
            }

            state.tipStyles = {
                position: 'absolute',
                top: `${tipTop}px`,
                left: `${tipLeft}px`,
                zIndex: 98,
                padding: '0 2px',
                fontSize: '12px',
                lineHeight: '24px',
                borderRadius: '2px',
                color: '#fff',
                whiteSpace: 'nowrap',
                background: 'rgba(0,0,0,.8)'
            }
        })
    }

    const handleMousemove = _.throttle(eventMousemove, 30)

    onMounted(() => {
        document.body.addEventListener('mousemove', handleMousemove)
        document.body.addEventListener('mouseup', handleMouseup)
    })

    onBeforeUnmount(() => {
        document.body.removeEventListener('mousemove', handleMousemove)
        document.body.removeEventListener('mouseup', handleMouseup)
    })

    return {
        ...toRefs(state),
        handleResizeWidth,
        handleResizeHeight,
        handleResizeBoth
    }
}
