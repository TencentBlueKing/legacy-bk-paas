/**
 * @desc 交互式组件 type 判断
 * @param { String } type
 * @returns { Boolean }
 */
export default function (type) {
    return [
        'bk-dialog',
        'bk-sideslider'
    ].includes(type)
}
