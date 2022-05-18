import { walkGrid, uuid } from '../util'
import { getConnection, getRepository, IsNull } from 'typeorm'
import ApiMigraion from '../model/entities/api-migration'
import Project from '../model/entities/project'
import ProjectVersion from '../model/entities/project-version'
import { logger } from '../logger'
import Page from '../model/entities/page'
import PageTemplate from '../model/entities/page-template'
import PageTemplateCategory from '../model/entities/page-template-category'
import Layout from '../model/entities/layout'
import LayoutInst from '../model/entities/layout-inst'
import ProjectFuncGroup from '../model/entities/project-func-group'
import FuncGroup from '../model/entities/func-group'
import Func from '../model/entities/func'

// 将函数名称写到这个数组里，函数会自动执行，返回成功则后续不会再执行
const apiArr = ['setDefaultPageTemplateCategory', 'updateCardSlot', 'fixCardsSlots', 'templateCardsSlots', 'setProjectMobileLayoutInst', 'syncPageData', 'syncFuncData', 'modifyPageData0518']

export const executeApi = async () => {
    const apiRecords = await getRepository(ApiMigraion).find()
    apiArr.forEach(async api => {
        if (!apiRecords.find(item => item.name === api)) {
            const res = await getRepository(ApiMigraion).save([{ name: api }])
            const id = res[0] && res[0].id
            // eslint-disable-next-line no-eval
            const result = await eval(`${api}('${api}')`)
            if (result && result.code === 0) {
                console.log(result.message)
            } else {
                console.log(result.message)
                const deleteRes = await getRepository(ApiMigraion).delete({ id })
                console.log(deleteRes, 'delete')
            }
        }
    })
}

/**
 * 为老项目设置页面模板的默认类别
 */
// eslint-disable-next-line no-unused-vars
async function setDefaultPageTemplateCategory (apiName) {
    const projectRepo = getRepository(Project)
    try {
        await getConnection().transaction(async transactionalEntityManager => {
            const projectList = await projectRepo.find()

            const PageTemplateCategoryList = projectList.map(project => {
                const { id, createTime, updateTime, createUser, updateUser } = project
                return {
                    name: '默认分类',
                    belongProjectId: id,
                    createTime,
                    updateTime,
                    createUser,
                    updateUser
                }
            })
            await transactionalEntityManager.save(PageTemplateCategory, PageTemplateCategoryList)
        })
        return {
            code: 0,
            message: `${apiName}: Insert success`
        }
    } catch (err) {
        return {
            code: -1,
            message: `${apiName}: ${err.message || err}`
        }
    }
}

// eslint-disable-next-line no-unused-vars
async function updateCardSlot () {
    try {
        const pageRepository = getRepository(Page)
        const allPageData = await pageRepository.find()
        allPageData.forEach(page => {
            let targetData = []
            try {
                targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content
            } catch (err) {
                targetData = []
            }
            if (!targetData || targetData === 'null') {
                logger.warn('targetData does not exist or is \'null\'')
                targetData = []
            }

            (targetData || []).forEach((grid, index) => {
                const callBack = (component) => {
                /** renderSlots如果没有header，证明是旧数据，应该格式化其结构 */
                    if (component.type === 'bk-card' && component.renderSlots.header === undefined) {
                        const originValue = component.renderProps.title.val
                        component.renderProps['disable-header-style'] = { 'type': 'hidden', 'val': true, 'payload': {}, 'attrs': [] }
                        component.renderSlots = {
                            'default': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {

                                    },
                                    'renderStyles': {
                                        'height': '200px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [

                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': 'free-layout-247bde35'
                                }
                            },
                            'header': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {
                                        'no-response': true
                                    },
                                    'renderStyles': {
                                        'height': '50px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [
                                                        {
                                                            'componentId': 'text-28a11b0c',
                                                            'tabPanelActive': 'styles',
                                                            'renderKey': 'dcadd06d',
                                                            'name': 'text',
                                                            'type': 'span',
                                                            'renderProps': {
                                                                'inFreeLayout': {
                                                                    'val': true
                                                                },
                                                                'title': {
                                                                    'type': 'string',
                                                                    'val': '',
                                                                    'payload': {

                                                                    },
                                                                    'attrs': [

                                                                    ]
                                                                }
                                                            },
                                                            'renderStyles': {
                                                                'display': 'inline-block',
                                                                'fontSize': '16px',
                                                                'textAlign': 'center',
                                                                'top': '12px',
                                                                'left': '7px'
                                                            },
                                                            'renderEvents': {

                                                            },
                                                            'interactiveShow': false,
                                                            'isComplexComponent': false,
                                                            'renderDirectives': [

                                                            ],
                                                            'renderSlots': {
                                                                'default': {
                                                                    'name': 'text',
                                                                    'type': 'text',
                                                                    'displayName': '文本配置',
                                                                    'val': originValue,
                                                                    'regExp': {

                                                                    },
                                                                    'regErrorText': '文本配置不能为空'
                                                                }
                                                            },
                                                            'isCustomComponent': false
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': 'free-layout-653078f9',
                                    'renderKey': '8bf3d94e'
                                }
                            },
                            'footer': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {

                                    },
                                    'renderStyles': {
                                        'height': '50px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [

                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
            page.content = JSON.stringify(targetData)
            page.updateBySystem = true
        })

        await pageRepository.save(allPageData)
        return {
            code: 0,
            message: 'card存量数据更新成功'
        }
    } catch (error) {
        return {
            code: -1,
            message: error.message || error,
            data: null
        }
    }
}

// eslint-disable-next-line no-unused-vars
async function fixCardsSlots () {
    try {
        const pageRepository = getRepository(Page)
        const allPageData = await pageRepository.find()
        allPageData.forEach(page => {
            let targetData = []
            try {
                targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content
            } catch (err) {
                targetData = []
            }
            if (!targetData || targetData === 'null') {
                logger.warn('targetData does not exist or is \'null\'')
                targetData = []
            }

            (targetData || []).forEach((grid, index) => {
                const callBack = (component) => {
                /** 对card的componentId做唯一处理 */
                    if (component.type === 'bk-card') {
                        const slots = component.renderSlots
                        const headerSlot = slots.header.val.renderSlots.default.val[0].children[0]
                        slots.default.val.componentId = `free-layout-${uuid()}`
                        slots.header.val.componentId = `free-layout-${uuid()}`
                        slots.footer.val.componentId = `free-layout-${uuid()}`
                        if (headerSlot) {
                            headerSlot.componentId = `text-${uuid()}`
                            headerSlot.renderStyles.textAlign = 'left'
                        }
                    }
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
            page.content = JSON.stringify(targetData)
            page.updateBySystem = true
        })

        await pageRepository.save(allPageData)
        return {
            code: 0,
            message: 'card修复成功'
        }
    } catch (error) {
        console.log(error)
        return {
            code: -1,
            message: error.message || error,
            data: null
        }
    }
}

// eslint-disable-next-line no-unused-vars
async function templateCardsSlots () {
    try {
        const templateRepository = getRepository(PageTemplate)
        const allTemplateData = await templateRepository.find()

        allTemplateData.forEach(template => {
            let targetData = {}
            try {
                targetData = JSON.parse(template.content || '{}')
                if (Object.prototype.toString.call(targetData) !== '[object Object]') {
                    targetData = {}
                }
            } catch (err) {
                targetData = {}
            }
            const targetList = [targetData]

            targetList.forEach((grid, index) => {
                const callBack = (component) => {
                /** renderSlots如果没有header，证明是旧数据，应该格式化其结构 */
                    if (component.type === 'bk-card' && component.renderSlots.header === undefined) {
                        const originValue = component.renderProps.title.val
                        component.renderProps['disable-header-style'] = { 'type': 'hidden', 'val': true, 'payload': {}, 'attrs': [] }
                        component.renderSlots = {
                            'default': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {

                                    },
                                    'renderStyles': {
                                        'height': '200px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [

                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': `free-layout-${uuid()}`
                                }
                            },
                            'header': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {
                                        'no-response': true
                                    },
                                    'renderStyles': {
                                        'height': '50px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [
                                                        {
                                                            'componentId': `text-${uuid()}`,
                                                            'tabPanelActive': 'styles',
                                                            'renderKey': 'dcadd06d',
                                                            'name': 'text',
                                                            'type': 'span',
                                                            'renderProps': {
                                                                'inFreeLayout': {
                                                                    'val': true
                                                                },
                                                                'title': {
                                                                    'type': 'string',
                                                                    'val': '',
                                                                    'payload': {

                                                                    },
                                                                    'attrs': [

                                                                    ]
                                                                }
                                                            },
                                                            'renderStyles': {
                                                                'display': 'inline-block',
                                                                'fontSize': '16px',
                                                                'textAlign': 'center',
                                                                'top': '12px',
                                                                'left': '7px'
                                                            },
                                                            'renderEvents': {

                                                            },
                                                            'interactiveShow': false,
                                                            'isComplexComponent': false,
                                                            'renderDirectives': [

                                                            ],
                                                            'renderSlots': {
                                                                'default': {
                                                                    'name': 'text',
                                                                    'type': 'text',
                                                                    'displayName': '文本配置',
                                                                    'val': originValue,
                                                                    'regExp': {

                                                                    },
                                                                    'regErrorText': '文本配置不能为空'
                                                                }
                                                            },
                                                            'isCustomComponent': false
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': `free-layout-${uuid()}`
                                }
                            },
                            'footer': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {

                                    },
                                    'renderStyles': {
                                        'height': '50px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [

                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': `free-layout-${uuid()}`
                                }
                            }
                        }
                    }
                }
                walkGrid(targetList, grid, callBack, callBack, index)
            })

            template.content = JSON.stringify(targetList[0])
            template.updateBySystem = true
        })

        await templateRepository.save(allTemplateData)
        return {
            code: 0,
            message: '模板card旧数据更新成功'
        }
    } catch (error) {
        console.dir(error)
        return {
            code: -1,
            message: error.message || error,
            data: null
        }
    }
}

const checkPageDataVersion = (data) => {
    if (data.length < 1) {
        return 'v2'
    }
    const rootLayout = data.slice(-1)[0]
    if (!rootLayout.renderSlots) {
        return 'v0'
    }
    if (rootLayout.type === 'render-grid') {
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

        // fix: img 配置 type 问题
        if (curDataNode.type === 'img') {
            curDataNode.type = 'bk-image'
        }
        
        return curDataNode
    })
}

export async function syncPageData () {
    try {
        const pageRepository = getRepository(Page)
        const pageList = await pageRepository.find()

        const PageTemplateRepository = getRepository(PageTemplate)
        const pageTemplateList = await PageTemplateRepository.find()
        
        await getConnection().transaction(async transactionalEntityManager => {
            const taskList = pageList.map(pageData => {
                let targetData = []
                try {
                    targetData = JSON.parse(pageData.content || '[]')
                    if (!Array.isArray(targetData)) {
                        targetData = []
                    }
                } catch (err) {
                    targetData = []
                }
                const dataVersion = checkPageDataVersion(targetData)
                if (dataVersion === 'v0') {
                    targetData = []
                } else if (dataVersion === 'v1') {
                    try {
                        targetData = tansformPageData({ type: 'root' }, targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error page ==== ${pageData.id}`))
                    }
                }
                
                return transactionalEntityManager.update(Page, {
                    id: pageData.id
                }, {
                    content: JSON.stringify(targetData),
                    updateTime: pageData.updateTime,
                    updateUser: pageData.updateUser
                })
            })
            const templateTaskList = pageTemplateList.map(templateData => {
                let targetData = []
                try {
                    targetData = JSON.parse(templateData.content || '{}')
                    if (Object.prototype.toString.call(targetData) !== '[object Object]') {
                        targetData = {}
                    }
                } catch (err) {
                    targetData = {}
                }
                targetData = [targetData]
                const dataVersion = checkPageDataVersion(targetData)
                if (dataVersion === 'v1') {
                    try {
                        targetData = tansformPageData({ type: 'template' }, targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error template ==== ${templateData.id}`))
                    }
                    
                    return transactionalEntityManager.update(PageTemplate, {
                        id: templateData.id
                    }, {
                        content: JSON.stringify(targetData[0]),
                        updateTime: templateData.updateTime,
                        updateUser: templateData.updateUser
                    })
                } else {
                    return Promise.resolve()
                }
            })
            await Promise.all([...taskList, ...templateTaskList])
        })
        return {
            code: 0,
            message: `sync page data success：${(new Date()).toString()}`,
            data: null
        }
    } catch (error) {
        console.dir(error)
        return {
            code: -1,
            message: error,
            data: null
        }
    }
}

export async function fixPageData (ctx) {
    try {
        const traverse = (childDataList) => {
            if (childDataList.length < 1) {
                return
            }
            childDataList.forEach(childData => {
                if (!childData) {
                    return
                }
                if (childData && childData.type === 'bk-dialog') {
                    if (childData.renderSlots
                        && childData.renderSlots.default
                        && childData.renderSlots.default.val) {
                        const child = childData.renderSlots.default.val
                        // console.log('\n\n\n\n\n\n\n\n ===============')
                        // console.dir(tansformPageData(childData, [child]))
                        childData.renderSlots = {
                            default: tansformPageData(childData, [child])[0]
                        }
                    }
                    return
                }
                if ([
                    'root',
                    'render-grid',
                    'render-column',
                    'free-layout',
                    'widget-form',
                    'widget-form-item'
                ].includes(childData.type)) {
                    // 布局类型的组件
                    // slot 的值类型 Array
                    traverse(childData.renderSlots.default)
                } else {
                    // slot 为布局类型组件
                    // slot 的值类型为 Node
                    Object.keys(childData.renderSlots).forEach(slotName => {
                        const slotData = childData.renderSlots[slotName]
                        if (Object.prototype.toString.call(slotData) === '[object Object]') {
                            if (slotData.componentId && slotData.type) {
                                traverse([slotData])
                            }
                        }
                    })
                }
            })
        }
        const pageRepository = getRepository(Page)
        const pageList = await pageRepository.find()

        const PageTemplateRepository = getRepository(PageTemplate)
        const pageTemplateList = await PageTemplateRepository.find()
        
        await getConnection().transaction(async transactionalEntityManager => {
            const taskList = pageList.map(pageData => {
                let targetData = []
                try {
                    targetData = JSON.parse(pageData.content || '[]')
                    if (!Array.isArray(targetData)) {
                        targetData = []
                    }
                } catch (err) {
                    targetData = []
                }
                const dataVersion = checkPageDataVersion(targetData)
                if (dataVersion === 'v2') {
                    try {
                        traverse(targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error page ==== ${pageData.id}`))
                    }
                    return transactionalEntityManager.update(Page, {
                        id: pageData.id
                    }, {
                        content: JSON.stringify(targetData),
                        updateTime: pageData.updateTime,
                        updateUser: pageData.updateUser
                    })
                } else {
                    return Promise.resolve()
                }
            })
            const templateTaskList = pageTemplateList.map(templateData => {
                let targetData = {}
                try {
                    targetData = JSON.parse(templateData.content || '{}')
                    if (Object.prototype.toString.call(targetData) !== '[object Object]') {
                        targetData = {}
                    }
                } catch (err) {
                    targetData = {}
                }
                
                const dataVersion = checkPageDataVersion([targetData])
                if (dataVersion === 'v2') {
                    try {
                        traverse([targetData])
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error template ==== ${templateData.id}`))
                    }
                    
                    return transactionalEntityManager.update(PageTemplate, {
                        id: templateData.id
                    }, {
                        content: JSON.stringify(targetData),
                        updateTime: templateData.updateTime,
                        updateUser: templateData.updateUser
                    })
                } else {
                    return Promise.resolve()
                }
            })
            await Promise.all([...taskList, ...templateTaskList])
        })
        ctx.send({
            code: 0,
            message: `fix page data sunccess：${(new Date()).toString()}`,
            data: null
        })
    } catch (error) {
        console.dir(error)
        ctx.send({
            code: -1,
            message: error,
            data: null
        })
    }
}

/**
 *  layout表新增mobile布局模板, layoutInst表,为历史项目增加移动端空白模板实例
 */
// eslint-disable-next-line no-unused-vars
async function setProjectMobileLayoutInst (apiName) {
    const layoutRepo = getRepository(Layout)
    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // 更新布局模板类型
            const layoutUpdateList = (await layoutRepo.find()).map(layout => {
                return {
                    id: layout.id,
                    layoutType: 'PC'
                }
            })
            await transactionalEntityManager.save(Layout, layoutUpdateList)
            // 创建布局模板基本信息记录
            const mobileLayout = layoutRepo.create({
                layoutType: 'MOBILE',
                defaultPath: '/mobile/',
                defaultName: '空白布局',
                defaultCode: 'mobileEmptyView',
                type: 'mobile-empty',
                defaultContent: JSON.stringify({}),
                createUser: 'admin',
                updateUser: 'admin'
            })
            const res = await transactionalEntityManager.save(mobileLayout)

            const layoutId = res && res.id

            const projectList = await getRepository(Project).find()
            
            // 先给项目列表的默认版本插一条移动端空白路由数据
            const layoutInstList = projectList.map(project => {
                const { id, createUser, updateUser } = project
                
                return {
                    content: JSON.stringify({}),
                    layoutId,
                    projectId: id,
                    routePath: '/mobile/',
                    isDefault: 1,
                    showName: '空白布局',
                    layoutCode: 'mobileEmptyView',
                    createUser,
                    updateUser
                }
            })

            const projectVersionList = await getRepository(ProjectVersion).find()
            const versionLayoutInstList = projectVersionList.map(project => {
                const { id, projectId, createUser, updateUser } = project
                
                return {
                    content: JSON.stringify({}),
                    layoutId,
                    projectId,
                    versionId: id,
                    routePath: '/mobile/',
                    isDefault: 1,
                    showName: '空白布局',
                    layoutCode: 'mobileEmptyView',
                    createUser,
                    updateUser
                }
            })
            const finalList = layoutInstList.concat(versionLayoutInstList)
            await transactionalEntityManager.save(LayoutInst, finalList)
        })
        return {
            code: 0,
            message: `${apiName}: Insert success`
        }
    } catch (err) {
        return {
            code: -1,
            message: `${apiName}: ${err.message || err}`
        }
    }
}

// eslint-disable-next-line no-unused-vars
async function syncFuncData () {
    try {
        const funcRepository = getRepository(Func)
        const funcList = await funcRepository.find({
            projectId: IsNull()
        })

        const funcGroupRepository = getRepository(FuncGroup)
        const funcGroupList = await funcGroupRepository.find({
            projectId: IsNull()
        })

        const projectFuncGroupRepository = getRepository(ProjectFuncGroup)
        const projectFuncGroupList = await projectFuncGroupRepository.find()
        const funcGroupProjectMap = projectFuncGroupList.reduce((acc, cur) => {
            acc[cur.funcGroupId] = cur.projectId
            return acc
        }, {})

        const versionGroupMap = projectFuncGroupList.reduce((acc, cur) => {
            acc[cur.funcGroupId] = cur.versionId
            return acc
        }, {})

        await getConnection().transaction(async transactionalEntityManager => {
            const funcTaskList = funcList.map(funcData => {
                return transactionalEntityManager.update(Func, {
                    id: funcData.id
                }, {
                    projectId: funcGroupProjectMap[funcData.funcGroupId],
                    versionId: versionGroupMap[funcData.funcGroupId],
                    updateTime: funcData.updateTime,
                    updateUser: funcData.updateUser
                })
            })
            const groupTaskList = funcGroupList.map(funcGroupData => {
                return transactionalEntityManager.update(FuncGroup, {
                    id: funcGroupData.id
                }, {
                    projectId: funcGroupProjectMap[funcGroupData.id],
                    versionId: versionGroupMap[funcGroupData.id],
                    updateTime: funcGroupData.updateTime,
                    updateUser: funcGroupData.updateUser
                })
            })
            await Promise.all([...funcTaskList, ...groupTaskList])
        })
        return {
            code: 0,
            message: `fix func data success：${(new Date()).toString()}`,
            data: null
        }
    } catch (error) {
        console.dir(error)
        return {
            code: -1,
            message: error,
            data: null
        }
    }
}

async function modifyPageData0518 () {
    try {
        const modifyData = (node) => {
            if (Array.isArray(node)) {
                node.forEach(modifyData)
            } else if (Object.prototype.toString.apply(node) === '[object Object]') {
                Object.keys(node).forEach((key) => {
                    const nodeValue = node[key]
                    if (key === 'renderEvents') {
                        const eventKeys = Object.keys(nodeValue)
                        eventKeys.forEach((eventKey) => {
                            const eventValue = nodeValue[eventKey]
                            if (typeof eventValue === 'string') {
                                nodeValue[eventKey] = {
                                    methodCode: eventValue,
                                    params: []
                                }
                            }
                        })
                    } else {
                        modifyData(nodeValue)
                    }
                })
            }
        }
        const pageRepository = getRepository(Page)
        const pageList = await pageRepository.find()

        const PageTemplateRepository = getRepository(PageTemplate)
        const pageTemplateList = await PageTemplateRepository.find()
        
        await getConnection().transaction(async transactionalEntityManager => {
            const taskList = pageList.map(pageData => {
                let targetData = []
                try {
                    targetData = JSON.parse(pageData.content || '[]')
                    if (!Array.isArray(targetData)) {
                        targetData = []
                    }
                } catch (err) {
                    targetData = []
                }
                const dataVersion = checkPageDataVersion(targetData)
                if (dataVersion === 'v0') {
                    targetData = []
                } else if (dataVersion === 'v1') {
                    try {
                        modifyData(targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error page ==== ${pageData.id}`))
                    }
                }
                
                return transactionalEntityManager.update(Page, {
                    id: pageData.id
                }, {
                    content: JSON.stringify(targetData),
                    updateTime: pageData.updateTime,
                    updateUser: pageData.updateUser
                })
            })
            const templateTaskList = pageTemplateList.map(templateData => {
                let targetData = []
                try {
                    targetData = JSON.parse(templateData.content || '{}')
                    if (Object.prototype.toString.call(targetData) !== '[object Object]') {
                        targetData = {}
                    }
                } catch (err) {
                    targetData = {}
                }
                targetData = [targetData]
                const dataVersion = checkPageDataVersion(targetData)
                if (dataVersion === 'v1') {
                    try {
                        modifyData(targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error template ==== ${templateData.id}`))
                    }
                    
                    return transactionalEntityManager.update(PageTemplate, {
                        id: templateData.id
                    }, {
                        content: JSON.stringify(targetData[0]),
                        updateTime: templateData.updateTime,
                        updateUser: templateData.updateUser
                    })
                } else {
                    return Promise.resolve()
                }
            })
            await Promise.all([...taskList, ...templateTaskList])
        })
        return {
            code: 0,
            message: `sync page data success：${(new Date()).toString()}`,
            data: null
        }
    } catch (error) {
        console.dir(error)
        return {
            code: -1,
            message: error,
            data: null
        }
    }
}
