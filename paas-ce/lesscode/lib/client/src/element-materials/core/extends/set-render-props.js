import _ from 'lodash'

/**
 * @desc 设置节点的 renderProps （全量覆盖）
 * @param { Node } node
 * @param { Object } props
 * @returns { Boolean }
 */
export default function (node, props) {
    if (Object.prototype.toString.call(props) !== '[object Object]') {
        throw new Error('设置 setRenderProps 值只支持 Object')
    }
    node.renderProps = _.cloneDeep(props)
}
