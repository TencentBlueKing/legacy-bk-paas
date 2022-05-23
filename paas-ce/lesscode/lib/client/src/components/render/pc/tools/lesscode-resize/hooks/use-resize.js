import {
    reactive,
    computed,
    toRefs,
    getCurrentInstance,
    onMounted,
    onBeforeUnmount,
    nextTick
} from '@vue/composition-api'
import _ from 'lodash'
import DragLine from '../../../../common/drag-line'

// const halfDotSize = 8

const hideStyles = {
    display: 'none'
}

const tipWithMouseOffset = 10

export default function () {
    const { proxy } = getCurrentInstance()

    let isWidthResizeable = false
    let isHeightResizeable = false
    let startScreenX = 0
    let startScreenY = 0
    let moveStartWidth = 0
    let moveStartHeight = 0
            
    const state = reactive({
        tipStyles: hideStyles,
        size: hideStyles
    })
    let dragLine = null

    const componentDataParentNode = computed(() => proxy.activeComponentData.parentNode)

    const calcPosition = (event) => {
        let newHeight = 0
        let newWidth = 0
        const { clientX } = event
        if (isWidthResizeable) {
            newWidth = Math.max(parseInt(clientX - startScreenX + moveStartWidth, 10), 0)
            proxy.activeComponentData.setStyle('width', `${newWidth}px`)
            // 指定了width，right不生效
            if (componentDataParentNode.value.type === 'free-layout') {
                proxy.activeComponentData.setStyle('right', '')
            }
        }
        const { clientY } = event
        if (isHeightResizeable) {
            newHeight = Math.max(parseInt(clientY - startScreenY + moveStartHeight, 10), 0)
            proxy.activeComponentData.setStyle('height', `${newHeight}px`)
            // 指定了height, bottom不生效
            if (componentDataParentNode.value.type === 'free-layout') {
                proxy.activeComponentData.setStyle('bottom', '')
            }
        }

        const {
            width,
            height
        } = proxy.activeComponentData.$elm.getBoundingClientRect()

        state.size = {
            width: newWidth || width,
            height: newHeight || height
        }
        
        nextTick(() => {
            const {
                top: containerTop,
                right: containerRight,
                bottom: containerBottom,
                left: containerLeft
            } = document.body.querySelector('#drawTarget').getBoundingClientRect()
            const {
                width: tipSafeWidth,
                height: tipSafeHieght
            } = proxy.tipRef.getBoundingClientRect()

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
                padding: '0 4px',
                fontSize: '12px',
                lineHeight: '24px',
                borderRadius: '2px',
                color: '#fff',
                whiteSpace: 'nowrap',
                background: 'rgba(0,0,0,.8)'
            }
        })
    }

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
        calcPosition(event)
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
        calcPosition(event)
    }
    /**
     * @desc 同时设置高度、宽度
     * @param { Event } event
     */
    const handleResizeBoth = (event) => {
        handleResizeWidth(event)
        handleResizeHeight(event)
        calcPosition(event)
    }
    
    /**
     * @desc mousemove 事件，动态更新容器宽度
     * @param {Object} event
     */
    const handleMousemove = _.throttle((event) => {
        if (!isWidthResizeable && !isHeightResizeable) {
            return
        }
        dragLine.check(proxy.activeComponentData.$elm, '[role="component-root"]')
        calcPosition(event)
    }, 30)

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
