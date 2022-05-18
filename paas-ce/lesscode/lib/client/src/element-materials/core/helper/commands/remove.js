import { bkInfoBox, bkMessage } from 'bk-magic-vue'
import LC from '../../index'

let bkInfoInstance = null

export const remove = () => {
    if (bkInfoInstance !== null) return false
    const activeNode = LC.getActiveNode()
    if (!activeNode) {
        return false
    }
    const parentNode = activeNode.parentNode
    if (!parentNode) {
        return false
    }
    let msg = ''
    if (!parentNode.layoutType) {
        msg = `组件 ${parentNode.type} 的 slot 容器不能刪除`
    } else if (parentNode.type === 'widget-form-item') {
        msg = '表单内元素不可删除,请在右侧面板编辑'
    } else if (activeNode.type === 'render-column') {
        if (parentNode.children.length <= 2) {
            msg = '列数至少为 2 列'
        }
    }

    if (msg) {
        bkMessage({
            theme: 'warning',
            limit: 1,
            message: msg
        })
        return false
    }
    // infobox弹出后监听enter事件
    window.addEventListener('keydown', keyDownCallback)

    const { name, componentId } = activeNode
    bkInfoInstance = bkInfoBox({
        title: '删除',
        subTitle: `确认删除 ${name}(${componentId}) 组件？`,
        confirmFn: () => {
            parentNode.removeChild(activeNode)
            window.removeEventListener('keydown', keyDownCallback)
            bkInfoInstance = null
        },
        cancelFn: () => {
            window.removeEventListener('keydown', keyDownCallback)
            bkInfoInstance = null
        }
    })
}

function keyDownCallback (event) {
    if (event.keyCode === 13 && bkInfoInstance) {
        const activeNode = LC.getActiveNode()
        const parentNode = activeNode.parentNode
        parentNode.removeChild(activeNode)
        window.removeEventListener('keydown', keyDownCallback)
        bkInfoInstance.close()
        bkInfoInstance = null
    }
}
