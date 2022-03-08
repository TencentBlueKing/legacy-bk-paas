import { bkInfoBox, bkMessage } from 'bk-magic-vue'
import LC from '../../index'

export const remove = () => {
    const activeNode = LC.getActiveNode()
    const parentNode = activeNode.parentNode
    if (!parentNode) {
        return
    }
    let msg = ''
    if (!parentNode.layoutType) {
        msg = `组件 ${parentNode.type} 的 slot 容器不能刪除`
    } else if (parentNode.type === 'widget-form-item') {
        msg = '表单内元素不可删除,请在右侧面板编辑'
    } else if (parentNode.root
        && parentNode.children.length < 2) {
        msg = '画布中至少要有一个布局组件'
    } else if (activeNode.type === 'render-column') {
        if (parentNode.children.length <= 1) {
            msg = '列数至少为 1 列'
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
    const { name, componentId } = activeNode
    bkInfoBox({
        title: '删除',
        subTitle: `确认删除 ${name}(${componentId}) 组件？`,
        confirmFn: () => {
            parentNode.removeChild(activeNode)
        }
    })
}
