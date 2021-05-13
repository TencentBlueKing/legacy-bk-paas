import _ from 'lodash'

export const generatorMenu = (() => {
    let i = 0
    return (icon = 'icon-block-shape') => ({
        name: `默认导航${++i}`,
        id: `${_.random(10, 99).toString(16)}${i}${Date.now().toString(16)}${_.random(10, 99).toString(16)}`,
        icon,
        pageCode: '',
        link: '',
        children: []
    })
})()
