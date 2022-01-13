import { bkInfoBox, bkMessage } from 'bk-magic-vue'
import LC from '../index'

export const remove = node => {
    if (node.parentNode) {
        node.parentNode.removeChild(node)
    }
}

export const clearLayout = node => {
    if (node.layoutType) {
        if (node.type === 'render-grid') {
            // 如果是grid 清空 column 下面的节点
            const columnNode = node.children[0]
            columnNode.children.forEach(child => {
                columnNode.removeChild(child)
            })
        } else {
            node.children.forEach(child => {
                node.removeChild(child)
            })
        }
    }
}

export const popDeleteConfirm = (activeNode) => {
    const { name, componentId } = activeNode
    bkInfoBox({
        title: '删除',
        subTitle: `确认删除${name}组件【${componentId}】？`,
        confirmFn: () => {
            remove(activeNode)
        }
    })
}

export const popClearLayout = (activeNode) => {
    const { name, componentId } = activeNode
    bkInfoBox({
        title: '清空',
        subTitle: `确认清空${name}组件【${componentId}】？`,
        confirmFn: () => {
            clearLayout(activeNode)
        }
    })
}

export const removeCallBack = () => {
    const activeNode = LC.getActiveNode()
    const rootNode = LC.getRoot()
    console.log(rootNode, 'rootNode')
    let msg = ''
    const { type, componentId, slotContainer } = activeNode
    if (slotContainer === true) {
        msg = 'slot容器不能刪除'
    } else if (type === 'render-grid'
        && componentId === rootNode.slot.default[0].componentId
    ) {
        msg = '画布中至少要有一个栅格布局'
    } else if (activeNode.parentNode.name === 'form-item') {
        msg = '表单内元素不可删除,请在右侧面板编辑'
    }
    if (msg) {
        bkMessage({
            theme: 'warning',
            limit: 1,
            message: msg
        })
        return false
    }
    return popDeleteConfirm(activeNode)
}
