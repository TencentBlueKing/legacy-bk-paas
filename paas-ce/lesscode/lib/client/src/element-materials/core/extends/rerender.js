import { uuid } from '@/common/util'

/**
 * @desc 重新计算节点的 renderKey 用于重新渲染
 * @param { Node } node
 * @returns { Boolean }
 */
export default function (node) {
    node.renderKey = uuid()
    return true
}
