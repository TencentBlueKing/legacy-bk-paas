/**
 * @desc 设置节点的 renderProps （全量覆盖）
 * @param { Node } node
 * @param { Object } props
 * @returns { Boolean }
 */
export default function (node, props) {
    node.renderProps = Object.assign({}, props)
}
