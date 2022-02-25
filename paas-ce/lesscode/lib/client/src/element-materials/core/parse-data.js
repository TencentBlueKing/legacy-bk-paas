import { uuid } from '@/common/util'
import getRoot from './get-root'
import create, { createNode } from './create-node'
import {
    triggerEventListener
} from './event'

let isClone = false

/**
 * @desc 通过 JSON 创建 Node
 * @param { Object } data
 * @returns { Node }
 */
const createNodeFromData = (data) => {
    try {
        const newNode = createNode(data.type === 'img' ? 'bk-image' : data.type)
        newNode.tabPanelActive = data.tabPanelActive || 'props'
        if (!isClone) {
        // fix: 老数据存在 componentId 为空的情况
            if (data.componentId) {
                newNode.componentId = data.componentId
            }
        }

        data.renderStyles && newNode.setRenderStyles(data.renderStyles)
        // data.renderProps && newNode.setRenderProps(data.renderProps)
        data.renderDirectives && newNode.setRenderDirectives(data.renderDirectives)
        data.renderEvents && newNode.setRenderEvents(data.renderEvents)
        if (data.renderProps) {
            // prop 通过 merge 的方式加载
            // 兼容组件 prop 扩展的场景
            Object.keys(data.renderProps).forEach(key => {
                newNode.renderProps[key] = data.renderProps[key]
            })
        }

        newNode._isMounted = true
        newNode.interactiveShow = false
        newNode.isComplexComponent = Boolean(data.complex)
        newNode.isInteractiveComponent = Boolean(data.interactive)
        newNode.isCustomComponent = Boolean(data.custom)
    
        return newNode
    } catch {
        return null
    }
}

/**
 * @desc 遍历 JSON
 * @param { Node } parentNode
 * @param { Array } childDataList
 * @param { String } slot
 */
const traverse = (parentNode, childDataList, slot) => {
    childDataList.forEach(childData => {
        const childNode = createNodeFromData(childData)

        // 页面中的组件物料被删除跳过组件处理
        if (!childNode) {
            return
        }
        
        if (childNode.layoutType) {
            // 布局类型的组件
            // slot 的值类型 Array
            traverse(childNode, childData.renderSlots.default, 'default')
        } else if (childNode.layoutSlot) {
            // slot 为布局类型组件
            // slot 的值类型为 Node
            Object.keys(childNode.layoutSlotType).forEach(slotName => {
                const slotData = childData.renderSlots[slotName]
                if (Object.prototype.toString.call(slotData) === '[object Object]') {
                    traverse(childNode, [slotData], slotName)
                } else if (Array.isArray(slotData)) {
                    // TODO. 这种情况应该不会出现
                    console.error('\n\n\n\n\n ========== go die ========== \n\n\n\n')
                    traverse(childNode, slotData, slotName)
                }
            })
        } else {
            childNode.renderSlots = childData.renderSlots || {}
        }
        if (parentNode.layoutType) {
            parentNode.appendChild(childNode, slot)
        } else if (parentNode.layoutSlotType[slot]) {
            parentNode.renderSlots[slot] = childNode
        }
    })
}

/**
 * @desc 转换老版本的数据
 * @param { Object } root
 * @param { Array } data
 * @returns { Array }
 */
const tansformPageData = (parentNode, data) => {
    return data.map((curDataNode, index) => {
        if (!curDataNode) {
            return null
        }
        curDataNode.complex = Boolean(curDataNode.isComplexComponent)
        curDataNode.interactive = ['bk-sideslider', 'bk-dialog'].includes(curDataNode.type)
        curDataNode.custom = Boolean(curDataNode.isCustomComponent)

        if (curDataNode.type === 'render-grid') {
            if (curDataNode.renderSlots
                && curDataNode.renderSlots.default
                && curDataNode.renderSlots.default.val) {
                const columnList = curDataNode.renderSlots.default.val
                curDataNode.renderSlots = {
                    default: []
                }
                const spanNums = columnList.reduce((result, item) => {
                    const span = item.span || 1
                    return result + span
                }, 0)
                columnList.forEach((columnItem, index) => {
                    const uid = `${uuid()}${index}`
                    const span = columnItem.span || 1
                    const columnData = {
                        tabPanelActive: 'props',
                        componentId: `column-${uid}`,
                        name: 'render-column',
                        type: 'render-column',
                        renderStyles: {
                            paddingTop: '5px',
                            paddingRight: '5px',
                            paddingBottom: '5px',
                            paddingLeft: '5px',
                            minHeight: '80px',
                            width: `${span / spanNums * 100}%`
                        },
                        renderProps: {
                            span: {
                                format: 'value',
                                code: span,
                                valueType: 'number',
                                payload: {},
                                renderValue: span
                            }
                        },
                        renderSlots: {
                            default: tansformPageData(curDataNode, columnItem.children)
                        },
                        renderDirectives: [],
                        renderEvents: {},
                        complex: false,
                        interactive: false,
                        custom: false
                    }
                    curDataNode.renderSlots.default.push(columnData)
                })
            }
        } else if (curDataNode.type === 'widget-form') {
            if (curDataNode.renderSlots
                && curDataNode.renderSlots.default
                && curDataNode.renderSlots.default.val) {
                const formItemList = curDataNode.renderSlots.default.val
                curDataNode.renderSlots = {
                    default: []
                }
                formItemList.forEach((formItem) => {
                    const formItemData = {
                        tabPanelActive: 'props',
                        componentId: formItem.componentId,
                        name: 'form-item',
                        type: 'widget-form-item',
                        renderStyles: formItem.renderStyles,
                        renderProps: Object.keys(formItem.renderProps || {}).reduce((result, name) => {
                            const {
                                type,
                                val
                            } = formItem.renderProps[name]
                            result[name] = {
                                format: 'value',
                                code: val,
                                payload: {},
                                valueType: type,
                                renderValue: val
                            }
                            return result
                        }, {}),
                        renderSlots: {
                            default: tansformPageData(curDataNode, formItem.renderSlots.default.val)
                        },
                        renderDirectives: [],
                        renderEvents: {},
                        complex: false,
                        interactive: false
                    }
                    // console.log('from print form item == ', formItemData)
                    curDataNode.renderSlots.default.push(formItemData)
                })
            }
        } else if (curDataNode.type === 'free-layout') {
            if (curDataNode.renderSlots
                && curDataNode.renderSlots.default
                && Array.isArray(curDataNode.renderSlots.default.val)) {
                const freelayoutItem = curDataNode.renderSlots.default.val[0] || []
                let freelayoutSlot = []
                if (freelayoutItem && freelayoutItem.children) {
                    freelayoutSlot = tansformPageData(curDataNode, freelayoutItem.children)
                }
                curDataNode.renderSlots = {
                    default: freelayoutSlot
                }
            }
        } else if (curDataNode.type === 'bk-sideslider') {
            curDataNode.interactive = true
            if (curDataNode.renderSlots
                && curDataNode.renderSlots.content
                && curDataNode.renderSlots.content.val) {
                const child = curDataNode.renderSlots.content.val
                curDataNode.renderSlots = {
                    content: tansformPageData(curDataNode, [child])[0]
                }
            }
        } else if (curDataNode.type === 'bk-dialog') {
            curDataNode.interactive = true
            if (curDataNode.renderSlots
                && curDataNode.renderSlots.default
                && curDataNode.renderSlots.default.val) {
                const child = curDataNode.renderSlots.default.val
                curDataNode.renderSlots = {
                    default: tansformPageData(curDataNode, [child])[0]
                }
            }
        } else if (curDataNode.type === 'bk-card') {
            if (curDataNode.renderSlots) {
                const renderSlots = curDataNode.renderSlots
                curDataNode.renderSlots = {
                    header: tansformPageData(curDataNode, [renderSlots.header.val])[0],
                    default: tansformPageData(curDataNode, [renderSlots.default.val])[0],
                    footer: tansformPageData(curDataNode, [renderSlots.footer.val])[0]
                }
            }
        } else if (curDataNode.type === 'el-card') {
            if (curDataNode.renderSlots
                && curDataNode.renderSlots.default
                && curDataNode.renderSlots.default.val) {
                const child = curDataNode.renderSlots.default.val
                curDataNode.renderSlots = {
                    default: tansformPageData(curDataNode, [child])[0]
                }
            }
        }

        // 转换 renderStyles
        if (['render-grid', 'free-layout'].includes(curDataNode.type)) {
            if (index < data.length - 1) {
                curDataNode.renderStyles = {
                    marginBottom: '10px',
                    ...curDataNode.renderStyles
                }
            }
        } else {
            if (parentNode.type === 'render-grid') {
                curDataNode.renderStyles = {
                    marginTop: '5px',
                    marginRight: '5px',
                    marginBottom: '5px',
                    marginLeft: '5px',
                    verticalAlign: 'middle',
                    ...curDataNode.renderStyles
                }
            }
        }
        if (curDataNode.type === 'bk-button' && parentNode.type === 'widget-form') {
            curDataNode.renderStyles = {
                display: 'inline-block',
                margin: '',
                marginLeft: index > 0 ? '10px' : '',
                ...curDataNode.renderStyles
            }
        }

        // 转换 renderProps
        const origanlRenderProps = curDataNode.renderProps || {}
        curDataNode.renderProps = Object.keys(origanlRenderProps).reduce((result, propName) => {
            const prop = origanlRenderProps[propName]
            let renderValue = prop.val
            if (prop.type !== 'string' && renderValue === '') {
                renderValue = undefined
            }
            
            if (propName === 'no-response') {
                // fix: 老数据 renderProps.no-response 格式不规范的问题
                result[propName] = {
                    format: 'value',
                    code: prop,
                    payload: {},
                    valueType: 'boolean',
                    renderValue: prop
                }
            } else {
                const valueType = Array.isArray(prop.type) ? prop.type[0] : prop.type
                result[propName] = {
                    format: 'value',
                    code: prop.val,
                    payload: prop.payload || {},
                    valueType,
                    renderValue
                }
            }
            
            return result
        }, {})
        // prop 还需要解析 renderDirectives 中 v-bind 的关联数据
        ;(curDataNode.renderDirectives || []).forEach(directive => {
            if (directive.type === 'v-bind'
                && directive.val
                 && curDataNode.renderProps[directive.prop]) {
                const renderProp = origanlRenderProps[directive.prop]
                const valueType = Array.isArray(renderProp.type) ? renderProp.type[0] : renderProp.type
                curDataNode.renderProps[directive.prop] = {
                    format: directive.valType,
                    code: directive.val,
                    payload: {},
                    valueType,
                    renderValue: renderProp.val
                }
            }
        })

        // 转换 renderDirectives
        curDataNode.renderDirectives = (curDataNode.renderDirectives || []).reduce((result, directive) => {
            const {
                type,
                prop = '',
                val,
                valType = 'value'
            } = directive
            if (type !== 'v-bind') {
                result.push({
                    type,
                    prop,
                    format: valType,
                    code: val
                })
            }
            return result
        }, [])

        // 非布局类型的组件需要转换 renderSlots
        if (![
            'render-grid',
            'free-layout',
            'widget-form',
            'widget-form-item',
            'bk-sideslider',
            'bk-dialog',
            'bk-card',
            'el-card'
        ].includes(curDataNode.type)) {
            curDataNode.renderSlots = Object.keys(curDataNode.renderSlots || {}).reduce((result, slotName) => {
                const slotData = curDataNode.renderSlots[slotName]
                let format = 'value'
                let code = slotData.val
                const renderValue = code
                const component = slotData.name
                const valueType = slotData.type
                const payload = slotData.payload || {}
                if (slotData.payload
                     && slotData.payload.variableData
                      && slotData.payload.variableData.valType
                      && slotData.payload.variableData.valType !== 'value') {
                    format = slotData.payload.variableData.valType
                    code = slotData.payload.variableData.val
                }
                result[slotName] = {
                    format,
                    component,
                    code,
                    payload,
                    valueType,
                    renderValue
                }
                return result
            }, {})
        }
        
        return curDataNode
    })
}

/**
 * @desc 检测 JSON 数据的版本
 * @param { Array } data
 * @returns { String }
 */
const checkVersion = (data) => {
    if (data.length < 1) {
        return 'v2'
    }
    const rootLayout = data.slice(-1)[0]
    if (rootLayout.type === 'render-grid') {
        if (!rootLayout.renderSlots) {
            return 'v0'
        }
        return rootLayout.renderSlots.default.hasOwnProperty('val') ? 'v1' : 'v2'
    } else if (rootLayout.type === 'bk-sideslider') {
        return rootLayout.renderSlots.content.hasOwnProperty('val') ? 'v1' : 'v2'
    } else if (rootLayout.type === 'free-layout') {
        return rootLayout.renderSlots.default.hasOwnProperty('val') ? 'v1' : 'v2'
    } else if (rootLayout.type === 'bk-dialog') {
        return rootLayout.renderSlots.default.hasOwnProperty('val') ? 'v1' : 'v2'
    }
    return 'v2'
}

// const traverseFix = (childDataList) => {
//     if (childDataList.length < 1) {
//         return
//     }
//     childDataList.forEach(childData => {
//         if (!childData) {
//             return
//         }
        
//         if (childData && childData.type === 'bk-dialog') {
//             if (childData.renderSlots
//                 && childData.renderSlots.default
//                 && childData.renderSlots.default.val) {
//                 const child = childData.renderSlots.default.val
//                 // console.log('\n\n\n\n\n\n\n\n ===============')
//                 // console.dir(tansformPageDataPageData(childData, [child]))
//                 childData.renderSlots = {
//                     default: tansformPageData(childData, [child])[0]
//                 }
//             }
//             return
//         }
//         if ([
//             'root',
//             'render-grid',
//             'render-column',
//             'free-layout',
//             'widget-form',
//             'widget-form-item'
//         ].includes(childData.type)) {
//             // 布局类型的组件
//             // slot 的值类型 Array
//             traverseFix(childData.renderSlots.default)
//         } else {
//             // slot 为布局类型组件
//             // slot 的值类型为 Node
//             Object.keys(childData.renderSlots).forEach(slotName => {
//                 const slotData = childData.renderSlots[slotName]
//                 if (Object.prototype.toString.call(slotData) === '[object Object]') {
//                     if (slotData.componentId && slotData.type) {
//                         traverseFix([slotData])
//                     }
//                 }
//             })
//         }
//     })
//     return childDataList
// }

export default function (data) {
    let versionData = data
    const version = checkVersion(data)
    if (version === 'v1') {
        versionData = tansformPageData({ type: 'root' }, data)
    }

    // traverseFix(versionData)
    // console.dir(versionData)

    const root = getRoot()
    root.setRenderSlots([])
    try {
        root.renderSlots.default = []
        if (version === 'v0' || data.length < 1) {
            root.appendChild(create('render-grid'))
        } else {
            traverse(root, versionData, 'default')
        }
        triggerEventListener('ready')
    } catch (error) {
        console.error(error)
        triggerEventListener('error')
    }
}

export const parseTemplate = data => {
    let versionData = data
    const version = checkVersion(data)
    if (version === 'v1') {
        versionData = tansformPageData({ type: 'template' }, data)
    }
    try {
        isClone = true
        const root = create('render-column')
        traverse(root, versionData, 'default')
        return root.children[0]
    } finally {
        isClone = false
    }
}
