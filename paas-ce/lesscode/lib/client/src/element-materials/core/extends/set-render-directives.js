/**
 * @desc 设置节点的 renderDirectives （全量覆盖）
 * @param { Node } node
 * @param { Array } directives
 * @returns { Boolean }
 */
import _ from 'lodash'

export default function (node, directives) {
    if (!Array.isArray(directives)) {
        throw new Error('setRenderDirectives 只支持 Array 数据')
    }
    node.renderDirectives = _.cloneDeep(directives)
    return true
}
