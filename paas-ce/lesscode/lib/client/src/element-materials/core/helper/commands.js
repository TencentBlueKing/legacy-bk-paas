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
        subTitle: `确认删除 ${name}(${componentId}) 组件？`,
        confirmFn: () => {
            remove(activeNode)
        }
    })
}

export const popClearLayout = (activeNode) => {
    const { type, componentId } = activeNode
    bkInfoBox({
        title: '清空',
        subTitle: `确认清空 ${type}(${componentId}) 组件？`,
        confirmFn: () => {
            clearLayout(activeNode)
        }
    })
}

export const removeCallBack = () => {
    const activeNode = LC.getActiveNode()
    let msg = ''
    const parentNode = activeNode.parentNode
    if (!parentNode.layoutType) {
        msg = `组件 ${parentNode.type} 的 slot 容器不能刪除`
    } else if (parentNode.type === 'widget-form-item') {
        msg = '表单内元素不可删除,请在右侧面板编辑'
    } else if (parentNode.type === 'root'
        && parentNode.children.length < 2) {
        msg = '画布中至少要有一个布局组件'
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
