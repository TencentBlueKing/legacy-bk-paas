import { getConnection, getRepository } from 'typeorm'
import ApiMigraion from '../model/entities/api-migration'
import Project from '../model/entities/project'
import { logger } from '../logger'
import Page from '../model/entities/page'
import PageTemplate from '../model/entities/page-template'
import PageTemplateCategory from '../model/entities/page-template-category'
import { walkGrid, uuid } from '../util'

// 将函数名称写到这个数组里，函数会自动执行，返回成功则后续不会再执行
const apiArr = ['setDefaultPageTemplateCategory', 'updateCardSlot', 'fixCardsSlots']

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

export async function syncPageData (ctx) {
    try {
        const checkVersion = (data) => {
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
        const tansform = (parentNode, data) => {
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
                                    default: tansform(curDataNode, columnItem.children)
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
                                    default: tansform(curDataNode, formItem.renderSlots.default.val)
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
                            freelayoutSlot = tansform(curDataNode, freelayoutItem.children)
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
                            content: tansform(curDataNode, [child])[0]
                        }
                    }
                } else if (curDataNode.type === 'bk-dialog') {
                    curDataNode.interactive = true
                    if (curDataNode.renderSlots
                        && curDataNode.renderSlots.content
                        && curDataNode.renderSlots.content.val) {
                        const child = curDataNode.renderSlots.default.val
                        curDataNode.renderSlots = {
                            default: tansform(curDataNode, [child])[0]
                        }
                    }
                } else if (curDataNode.type === 'bk-card') {
                    if (curDataNode.renderSlots) {
                        const renderSlots = curDataNode.renderSlots
                        curDataNode.renderSlots = {
                            header: tansform(curDataNode, [renderSlots.header.val])[0],
                            default: tansform(curDataNode, [renderSlots.default.val])[0],
                            footer: tansform(curDataNode, [renderSlots.footer.val])[0]
                        }
                    }
                } else if (curDataNode.type === 'el-card') {
                    if (curDataNode.renderSlots
                        && curDataNode.renderSlots.default
                        && curDataNode.renderSlots.default.val) {
                        const child = curDataNode.renderSlots.default.val
                        curDataNode.renderSlots = {
                            default: tansform(curDataNode, [child])[0]
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
                    result[propName] = {
                        format: 'value',
                        code: prop.val,
                        payload: prop.payload || {},
                        valueType: prop.type,
                        renderValue
                    }
                    return result
                }, {})
                // prop 还需要解析 renderDirectives 中 v-bind 的关联数据
                ;(curDataNode.renderDirectives || []).forEach(directive => {
                    if (directive.type === 'v-bind'
                        && directive.val
                         && curDataNode.renderProps[directive.prop]) {
                        const renderProp = origanlRenderProps[directive.prop]
                        curDataNode.renderProps[directive.prop] = {
                            format: directive.valType,
                            code: directive.val,
                            payload: {},
                            valueType: renderProp.type,
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
                const dataVersion = checkVersion(targetData)
                if (dataVersion === 'v0') {
                    targetData = []
                } else if (dataVersion === 'v1') {
                    try {
                        targetData = tansform({ type: 'root' }, targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error page ==== ${pageData.id}`))
                    }
                }
                
                return transactionalEntityManager.update(Page, {
                    id: pageData.id
                }, {
                    content: JSON.stringify(targetData)
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
                const dataVersion = checkVersion(targetData)
                if (dataVersion === 'v1') {
                    try {
                        targetData = tansform({ type: 'template' }, targetData)
                    } catch (error) {
                        console.dir(error)
                        return Promise.reject(new Error(`error template ==== ${templateData.id}`))
                    }
                    
                    return transactionalEntityManager.update(PageTemplate, {
                        id: templateData.id
                    }, {
                        content: JSON.stringify(targetData[0])
                    })
                } else {
                    return Promise.resolve()
                }
            })
            await Promise.all([...taskList, ...templateTaskList])
        })
        ctx.send({
            code: 0,
            message: `成功：${(new Date()).toString()}`,
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
