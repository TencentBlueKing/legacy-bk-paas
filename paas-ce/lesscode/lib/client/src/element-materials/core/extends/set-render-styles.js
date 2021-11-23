import _ from 'lodash'

/**
 * @desc 设置节点的 renderStyles（全量覆盖）
 * @param { Node } node
 * @param { Object } styles
 * @returns { Boolean }
 */
export default function (node, styles = {}) {
    node.renderStyles = _.cloneDeep(styles)
    return true
}
