/**
 * @desc 布局类型 type 判断
 * @param { String } type
 * @returns { Boolean }
 */
export default function (type) {
    return [
        'root',
        'render-grid',
        'render-column',
        'render-block',
        'free-layout',
        'widget-form'
    ].includes(type)
}
