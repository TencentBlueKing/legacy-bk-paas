import { walkGrid, uuid, transformOldGrid } from '../util'
import { getConnection, getRepository, In } from 'typeorm'
import Page from '../model/entities/page'
import Route from '../model/entities/route'
import PageRoute from '../model/entities/page-route'
import PageComp from '../model/entities/page-comp'
import ProjectPage from '../model/entities/project-page'
import Project from '../model/entities/project'
import CompCategory from '../model/entities/comp-category'
import Layout from '../model/entities/layout'
import LayoutInst from '../model/entities/layout-inst'
import ProjectFuncGroup from '../model/entities/project-func-group'
import FuncGroup from '../model/entities/func-group'
import Func from '../model/entities/func'
import Variable from '../model/entities/variable'
import PageVariable from '../model/entities/page-variable'
import FuncVariable from '../model/entities/func-variable'
import { logger } from '../logger'

/**
 * 对现有的 slot 数据更新
 * 只能执行一次
 * @param {*} ctx
 */
export const updateSlot = async (ctx) => {
    try {
        const transformSlot = (slots, name, props) => {
            const value = slots.val
            let res = {}
            switch (name) {
                case 'el-card':
                case 'card':
                    res = { default: { name: 'layout', type: 'free-layout', display: 'hidden', val: { ...(value || {}) } } }
                    break
                case 'sideslider':
                    res = { content: { name: 'layout', type: 'render-grid', display: 'hidden', val: { ...(value || {}), renderSlots: { default: (value || {}).renderProps.slots } } } }
                    delete (value || {}).renderProps.slots
                    break
                case 'dialog':
                    res = { default: { name: 'layout', type: 'render-grid', display: 'hidden', val: { ...(value || {}), renderSlots: { default: (value || {}).renderProps.slots } } } }
                    delete (value || {}).renderProps.slots
                    break
                case 'form':
                    res = {
                        default: {
                            name: 'layout',
                            type: 'form-item',
                            val: (value || []).map(item => {
                                item.renderSlots = {
                                    default: {
                                        ...(item.renderProps || {}).slots,
                                        val: (((item.renderProps || {}).slots || {}).val || []).map((x) => {
                                            const renderSlots = {}
                                            if (x.renderProps.slots) {
                                                renderSlots.default = { ...x.renderProps.slots }
                                                delete x.renderProps.slots
                                            }
                                            x.renderSlots = renderSlots
                                            return x
                                        })
                                    }
                                }
                                delete (item.renderProps || {}).slots
                                return item
                            })
                        }
                    }
                    break
                case 'popover':
                    res = {
                        default: { name: 'html', type: 'html', val: (value || ''), payload: (slots.payload || {}) },
                        content: { name: 'html', type: 'html', val: (props.content || {}).val || '' }
                    }
                    break
                case 'popconfirm':
                    res = {
                        default: { name: 'html', type: 'html', val: (value || ''), payload: (slots.payload || {}) },
                        content: { name: 'html', type: 'html', val: (props.title || {}).val || '' }
                    }
                    break
                case 'el-tooltip':
                case 'el-upload':
                    res = {
                        default: { name: 'html', type: 'html', val: (value || ''), payload: (slots.payload || {}) }
                    }
                    break
                case 'paragraph':
                    res = { default: { ...(slots || {}), type: 'textarea' } }
                    break
                case 'el-checkbox-group':
                case 'el-radio-group':
                    res = {
                        default: {
                            ...(slots || {}),
                            type: 'list',
                            val: slots.val.map((x) => {
                                x.value = x.label
                                return x
                            })
                        }
                    }
                    break
                case 'el-select':
                case 'el-tabs':
                case 'el-steps':
                case 'el-bread-crumb':
                case 'el-carousel':
                case 'el-timeline':
                case 'checkbox-group':
                case 'bread-crumb':
                case 'radio-group':
                case 'radio-button-group':
                case 'select':
                case 'tab':
                    res = { default: { ...(slots || {}), type: 'list' } }
                    break
                case 'el-table':
                case 'bk-table':
                    res = { default: { ...(slots || {}), type: 'table-list' } }
                    break
                case 'folding-table':
                case 'search-table':
                    res = { column: (slots || {}) }
                    break
                default:
                    res = { default: (slots || {}) }
                    break
            }
            return res
        }
        const errorPageIds = []
        const projectRepository = getRepository(Project)
        const projectPageRepository = getRepository(ProjectPage)
        const pageRepository = getRepository(Page)
        const allProject = await projectRepository.find({ where: { deleteFlag: 0 } })
        for (const project of allProject) {
            const projectId = project.id
            const projectPages = await projectPageRepository.find({ where: { projectId, deleteFlag: 0 } }) || []
            const pageIds = projectPages.map((projectPage) => (projectPage.pageId))
            const pages = pageIds.length > 0 ? await pageRepository.find({ where: { id: In(pageIds) } }) : []
            for (const page of pages) {
                try {
                    const targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content;
                    (targetData || []).forEach((grid, index) => {
                        const callBack = (data) => {
                            const renderProps = data.renderProps || {}
                            const slots = renderProps['slots']
                            if (slots) {
                                data.renderSlots = transformSlot(slots, data.name, renderProps)
                                delete renderProps['slots']
                            }
                            if (!data.renderSlots) {
                                data.renderSlots = {}
                            }
                        }
                        transformOldGrid(targetData, grid, callBack, callBack, index)
                    })
                    page.content = JSON.stringify(targetData || [])
                    page.updateBySystem = true
                    await pageRepository.update({ id: page.id }, page)
                } catch (error) {
                    console.error(error)
                    errorPageIds.push(page.id)
                }
            }
        }
        
        const errorMessage = errorPageIds.length ? `出现错误的pageId：${errorPageIds.join(', ')}` : ''
        ctx.send({
            code: 0,
            message: `slot 数据更新完成. ${errorMessage}`
        })
    } catch (error) {
        logger.warn('warn slot')
        logger.warn(error)
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * dialog存量数据更新(dev和t环境，对于已刷脏数据的更新componentId)
 */
export const updateDialogDev = async (ctx) => {
    try {
        const pageRepository = getRepository(Page)
        const allPage = await pageRepository.find()

        allPage.forEach(page => {
            let targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content
            if (!targetData || targetData === 'null') {
                logger.warn('targetData does not exist or is \'null\'')
                targetData = []
            }

            targetData.forEach(component => {
                const componentSlots = component.renderProps.slots
                if (component.type === 'bk-dialog' && componentSlots.val.name && componentSlots.val.name === 'grid') {
                    console.log('component target', componentSlots.val.name)
                    component.renderProps.slots.val = Object.assign(componentSlots.val, {
                        componentId: `grid-${uuid()}`,
                        tabPanelActive: 'props',
                        renderKey: uuid()
                    })

                    console.log(JSON.stringify(component.renderProps.slots.val))
                }
            })

            page.content = JSON.stringify(targetData)
            page.updateBySystem = true
        })

        await pageRepository.save(allPage)
        ctx.send({
            code: 0,
            message: 'dialog(dev t环境专用)数据数据更新成功'
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * dialog存量数据改为grid+p标签(正式环境)
 */
export const updateDialogDataProd = async (ctx) => {
    try {
        const pageRepository = getRepository(Page)
        const allPageData = await pageRepository.find()
        allPageData.forEach(page => {
            let targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content
            if (!targetData || targetData === 'null') {
                logger.warn('targetData does not exist or is \'null\'')
                targetData = []
            }
            targetData.forEach(component => {
                /** 如果slots的值是string类型，说明是存量数据 ，需要改为grid + p标签格式 */
                if (component.type === 'bk-dialog' && typeof component.renderProps.slots.val === 'string') {
                    const originValue = component.renderProps.slots.val
                    component.renderProps.slots = {
                        name: 'layout',
                        type: 'hidden',
                        val: {
                            componentId: `grid-${uuid()}`,
                            renderKey: uuid(),
                            tabPanelActive: 'props',
                            name: 'grid',
                            type: 'render-grid',
                            slotName: '',
                            slotContainer: true,
                            renderProps: {
                                slots: {
                                    type: 'column',
                                    val: [
                                        {
                                            children: [{
                                                'componentId': `paragraph-${uuid()}`,
                                                'tabPanelActive': 'props',
                                                'renderKey': uuid(),
                                                'name': 'paragraph',
                                                'type': 'p',
                                                'renderProps': {
                                                    'slots': {
                                                        'name': 'text',
                                                        'type': 'paragraph',
                                                        'regExp': {

                                                        },
                                                        'val': originValue,
                                                        'regErrorText': '文本配置不能为空',
                                                        'payload': {

                                                        },
                                                        'attrs': [

                                                        ]
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
                                                    'width': '281px',
                                                    'display': 'inline-block',
                                                    'fontSize': '14px',
                                                    'whiteSpace': 'pre-wrap',
                                                    'textAlign': 'left'
                                                },
                                                'renderEvents': {},
                                                'interactiveShow': false,
                                                'renderDirectives': [
                                                    {
                                                        'type': 'v-html',
                                                        'prop': 'slots',
                                                        'val': '',
                                                        'defaultVal': '文本配置不能为空'
                                                    }
                                                ],
                                                'isCustomComponent': false
                                            }],
                                            span: 1,
                                            width: '100%'
                                        }
                                    ]
                                }
                            },
                            renderStyles: {},
                            renderEvents: {},
                            renderDirectives: []
                        }
                    }
                }
            })
            page.content = JSON.stringify(targetData)
            page.updateBySystem = true
        })

        await pageRepository.save(allPageData)
        ctx.send({
            code: 0,
            message: 'dialog存量数据更新成功'
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 添加指令管理
 * 1. 为已有的变量生成数据
 * 2. 生成页面和变量关联关系数据
 * 3. 生成函数和变量关联关系数据
 * 3. 修改 renderDirective 数据包
 * @param {*} ctx
 */
export const updateVariableManage = async (ctx) => {
    try {
        const inferVariableData = function (directive, renderProps = {}, componentType) {
            const { type, modifiers, prop } = directive
            const curProp = (renderProps || {})[prop] || {}
            let itemValue = curProp.val !== undefined ? curProp.val : ''
            if (componentType === 'bk-dialog' && type === 'v-model') {
                itemValue = false
            }
            const valType = Object.prototype.toString.call(itemValue)
            let valueType = 0
            switch (valType) {
                case '[object Number]':
                    valueType = 1
                    itemValue = itemValue || 0
                    break
                case '[object Boolean]':
                    valueType = 2
                    itemValue = itemValue || false
                    break
                case '[object Array]':
                    valueType = 3
                    itemValue = JSON.stringify(itemValue || [])
                    break
                case '[object Object]':
                    valueType = 4
                    itemValue = JSON.stringify(itemValue || {})
                    break
            }
            const defaultValue = JSON.stringify({ all: itemValue, stag: itemValue, prod: itemValue })
            let showType = type
            if (type === 'v-bind') {
                const modifierStr = (modifiers || []).map((modifier) => `.${modifier}`).join('')
                showType = `${type}:${prop}${modifierStr}`
            }
            return { valueType, defaultValue, type: showType }
        }
        const projectRepository = getRepository(Project)
        const projectPageRepository = getRepository(ProjectPage)
        const pageRepository = getRepository(Page)
        const variableRepository = getRepository(Variable)
        const PageVariableRepository = getRepository(PageVariable)
        const allProject = await projectRepository.find({ where: { deleteFlag: 0 } })
        for (const project of allProject) {
            const projectId = project.id
            const projectPages = await projectPageRepository.find({ where: { projectId, deleteFlag: 0 } }) || []
            const pageIds = projectPages.map((projectPage) => (projectPage.pageId))
            const pages = pageIds.length > 0 ? await pageRepository.find({ where: { id: In(pageIds) } }) : []
            for (const page of pages) {
                const newVariables = []
                const newPageVariables = []
                const targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content;
                (targetData || []).forEach((grid, index) => {
                    const callBack = (data) => {
                        const renderDirectives = data.renderDirectives || []
                        const renderProps = data.renderProps || {}
                        renderDirectives.forEach((directive) => {
                            const val = directive.val
                            const valType = val && /[^\.\=><]+[\.\=><\']+[^\.\=><\']+/.test(val) ? 'expression' : 'variable'
                            if (val && valType === 'variable') {
                                const { valueType, defaultValue, type } = inferVariableData(directive, renderProps, data.type)
                                if (!newVariables.find(x => x.variableCode === val)) {
                                    newVariables.push(variableRepository.create({
                                        projectId,
                                        pageCode: page.pageCode,
                                        variableName: val,
                                        variableCode: val,
                                        valueType,
                                        defaultValueType: 0,
                                        effectiveRange: 1,
                                        defaultValue,
                                        updateBySystem: true,
                                        createUser: 'admin',
                                        updateUser: 'admin'
                                    }))
                                }
                                const newPageVariable = newPageVariables.find(x => x.variableCode === val)
                                if (newPageVariable) {
                                    newPageVariable.useInfo.push({ type, componentId: data.componentId })
                                } else {
                                    newPageVariables.push({
                                        projectId,
                                        variableCode: val,
                                        pageCode: page.pageCode,
                                        useInfo: [{ type, componentId: data.componentId }]
                                    })
                                }
                            }
                            directive.valType = valType
                        })
                        data.renderDirectives = renderDirectives
                    }
                    walkGrid(targetData, grid, callBack, callBack, index)
                })
                page.content = JSON.stringify(targetData || [])
                page.updateBySystem = true
                const [, variableList] = await Promise.all([
                    pageRepository.update({ id: page.id }, page),
                    variableRepository.save(newVariables)
                ])
                await PageVariableRepository.save(newPageVariables.map((newPageVariable) => {
                    newPageVariable.useInfo = JSON.stringify(newPageVariable.useInfo)
                    const variable = variableList.find((variable) => (variable.variableCode === newPageVariable.variableCode))
                    return PageVariableRepository.create({
                        projectId: newPageVariable.projectId,
                        variableId: variable.id,
                        pageCode: newPageVariable.pageCode,
                        useInfo: newPageVariable.useInfo,
                        updateBySystem: true,
                        createUser: 'admin',
                        updateUser: 'admin'
                    })
                }))
                // 生成函数和变量关联关系数据
                const projectFuncGroupRepository = getRepository(ProjectFuncGroup)
                const funcGroupRepository = getRepository(FuncGroup)
                const funcRepository = getRepository(Func)
                const funcVariableRepository = getRepository(FuncVariable)
                const projectFuncGroups = await projectFuncGroupRepository.find({ where: { projectId } }) || []
                const projectFuncGroupIds = projectFuncGroups.map((projectFuncGroup) => (projectFuncGroup.funcGroupId))
                const funcGroups = projectFuncGroupIds.length > 0 ? await funcGroupRepository.find({ where: { id: In(projectFuncGroupIds) } }) : []
                const funcGroupIds = funcGroups.map((funcGroup) => (funcGroup.id))
                const funcs = funcGroupIds.length > 0 ? await funcRepository.find({ where: { funcGroupId: In(funcGroupIds) } }) : []
                const newFuncvariables = []
                for (const func of funcs) {
                    (func.funcBody || '').replace(/lesscode\[\'\$\{prop:([\S]+)\}\'\]/g, (all, dirKey) => {
                        if (dirKey) {
                            const variable = newVariables.find((item) => (item.variableCode === dirKey))
                            if (variable && !newFuncvariables.find(x => x.variableId === variable.id)) {
                                newFuncvariables.push(funcVariableRepository.create({
                                    projectId,
                                    variableId: variable.id,
                                    funcCode: func.funcCode,
                                    updateBySystem: true,
                                    createUser: 'admin',
                                    updateUser: 'admin'
                                }))
                            }
                        }
                    })
                }
                await funcVariableRepository.save(newFuncvariables)
            }
        }

        ctx.send({
            code: 0,
            message: '指令管理更新成功'
        })
    } catch (error) {
        logger.warn('warn variable')
        logger.warn(error)
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 更新为新版的指令，修改targetData、func
 * @param {*} ctx
 */
export const updateDirectives = async (ctx) => {
    try {
        const projectRepository = getRepository(Project)
        const projectPageRepository = getRepository(ProjectPage)
        const pageRepository = getRepository(Page)
        const allProject = await projectRepository.find()
        for (const project of allProject) {
            const projectId = project.id
            const projectPages = await projectPageRepository.find({ where: { projectId } }) || []
            const pageIds = projectPages.map((projectPage) => (projectPage.pageId))
            const pages = pageIds.length > 0 ? await pageRepository.find({ where: { id: In(pageIds) } }) : []
            const propsMap = {}
            for (const page of pages) {
                const targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content;
                (targetData || []).forEach((grid, index) => {
                    const callBack = (data) => {
                        const renderProps = data.renderProps || {}
                        const propKeys = ['v-bind', 'v-model']
                        const renderDirectives = []
                        for (const prop in renderProps) {
                            const propVal = renderProps[prop]
                            propKeys.forEach((key) => {
                                const propVar = propVal[key]
                                if (propVal.hasOwnProperty(key) && propVar !== '') {
                                    const mapKey = data.componentId + '.' + prop
                                    const defaultVal = propVal.hasOwnProperty('val') ? propVal.val : ''
                                    propsMap[mapKey] = propVar
                                    renderDirectives.push({
                                        type: key,
                                        prop: prop,
                                        val: propVar,
                                        defaultVal
                                    })
                                }
                            })
                        }
                        data.renderDirectives = renderDirectives
                    }
                    walkGrid(targetData, grid, callBack, callBack, index)
                })
                page.content = JSON.stringify(targetData || [])
                page.updateBySystem = true
                await pageRepository.update({ id: page.id }, page)
            }
            // 修改函数
            const projectFuncGroupRepository = getRepository(ProjectFuncGroup)
            const funcGroupRepository = getRepository(FuncGroup)
            const funcRepository = getRepository(Func)
            const projectFuncGroups = await projectFuncGroupRepository.find({ where: { projectId } }) || []
            const projectFuncGroupIds = projectFuncGroups.map((projectFuncGroup) => (projectFuncGroup.funcGroupId))
            const funcGroups = projectFuncGroupIds.length > 0 ? await funcGroupRepository.find({ where: { id: In(projectFuncGroupIds) } }) : []
            const funcGroupIds = funcGroups.map((funcGroup) => (funcGroup.id))
            const funcs = funcGroupIds.length > 0 ? await funcRepository.find({ where: { funcGroupId: In(funcGroupIds) } }) : []
            for (const func of funcs) {
                func.funcBody = (func.funcBody || '').replace(/lesscode\[\'\$\{prop:([\S]+)\}\'\]/g, (all, dirKey) => {
                    if (dirKey) {
                        const curDir = propsMap[dirKey]
                        if (curDir) {
                            return "lesscode['${prop:" + curDir + "}']"
                        } else {
                            return all
                        }
                    }
                })
                func.updateBySystem = true
                await funcRepository.update({ id: func.id }, func)
            }
        }
        ctx.send({
            code: 0,
            message: '新版指令更新完成'
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 更新老页面的 lifeCycle
 * @param {*} ctx
 */
export const updatePageLifeCycle = async (ctx) => {
    try {
        const pageRepo = getRepository(Page)
        const allPage = await pageRepo.find()
        allPage.forEach((page) => {
            page.lifeCycle = JSON.stringify({
                created: '',
                beforeMount: '',
                mounted: '',
                beforeUpdate: '',
                updated: '',
                activated: '',
                deactivated: '',
                beforeDestroy: '',
                destroyed: ''
            })
        })
        await pageRepo.save(allPage)
        ctx.send({
            code: 0,
            message: '页面lifeCycle更新完成'
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 升级pageCode和页面路由数据
export const updatePagecode = async (ctx) => {
    if (Date.now() > new Date('2020-10-03 22:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const pageRepo = getRepository(Page)
    const layoutInstRepo = getRepository(LayoutInst)
    const md5 = require('md5')

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // 创建pageCode数据
            const pages = await pageRepo.find({
                where: { pageCode: '' }
            })

            if (!pages || !pages.length) {
                ctx.send('暂无需要升级的数据，已退出')
                return
            }

            const newPages = pages.map(page => {
                const prefixWord = String.fromCharCode(Math.floor(Math.random() * 26) + 97)
                const pageCode = `${prefixWord}${md5(page.pageName).substr(0, 7)}`
                return {
                    ...page,
                    pageCode: pageCode
                }
            })
            const pageResult = await transactionalEntityManager.save(Page, newPages)

            // 使用pageCode的更新结果即对应page表的数据创建路由记录
            const routes = pageResult.map(page => {
                const { pageCode, createTime, updateTime, createUser, updateUser } = page
                return {
                    path: pageCode,
                    createTime,
                    updateTime,
                    createUser,
                    updateUser
                }
            })
            const routeResult = await transactionalEntityManager.save(Route, routes)

            // 获取页面所属projectId
            const projectIdResult = await pageRepo
                .createQueryBuilder('page')
                .leftJoin(ProjectPage, 'pg', 'page.id = pg.pageId')
                .select('pg.projectId', 'projectId')
                .where('page.id IN (:...ids)', { ids: pageResult.map(page => page.id) })
                .getRawMany()

            const projectLayoutInstResult = await layoutInstRepo
                .createQueryBuilder('layoutinst')
                .select(['id', 'projectId'])
                .where('layoutinst.projectId IN (:...ids)', { ids: projectIdResult.map(project => project.projectId) })
                .andWhere('layoutinst.isDefault = 1')
                .getRawMany()
            const layoutProjectIdMap = {}
            projectLayoutInstResult.forEach(item => {
                layoutProjectIdMap[item.projectId] = [item.id]
            })

            // 创建页面路由关联记录
            const routePages = routeResult.map((route, index) => {
                const { id: routeId, createTime, updateTime, createUser, updateUser } = route
                return {
                    routeId,
                    pageId: pageResult[index].id,
                    layoutId: layoutProjectIdMap[projectIdResult[index].projectId],
                    projectId: projectIdResult[index].projectId,
                    createTime,
                    updateTime,
                    createUser,
                    updateUser,
                    deleteFlag: pageResult[index].deleteFlag
                }
            })
            const routePageResult = await transactionalEntityManager.save(PageRoute, routePages)

            ctx.send({
                code: 0,
                message: '数据升级完成，data为部分结果',
                data: {
                    page: pageResult.slice(0, 5),
                    route: routeResult.slice(0, 5),
                    routePage: routePageResult.slice(0, 5)
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 为老项目设置自定义组件的默认类别
 */
export const setDefaultCompCategory = async (ctx) => {
    if (Date.now() > new Date('2020-09-08 22:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const projectRepo = getRepository(Project)
    const compCategoryRepo = getRepository(CompCategory)

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // SELECT project.id, projectCode, projectName, status FROM project INNER JOIN comp_category
            //     WHERE project.id NOT IN (SELECT belongProjectId FROM comp_category) group by project.id;

            const compCategorys = await compCategoryRepo.find()

            const projectList = await projectRepo
                .createQueryBuilder('project')
                .innerJoin(CompCategory, 'compCategory')
                .where('project.id NOT IN (:...ids)', {
                    ids: compCategorys.map(compCategory => compCategory.belongProjectId)
                })
                .addGroupBy('project.id')
                .getMany()

            const compCategoryList = projectList.map(project => {
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
            const compCategoryResult = await transactionalEntityManager.save(CompCategory, compCategoryList)

            ctx.send({
                code: 0,
                message: '数据升级完成，data 为插入的新数据',
                data: {
                    compCategory: compCategoryResult
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 设置项目和页面的layout数据
 */
export const setProjectAndPageLayout = async (ctx) => {
    if (Date.now() > new Date('2020-09-25 22:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const layoutRepo = getRepository(Layout)
    const projectRepo = getRepository(Project)
    const pageRouteRepo = getRepository(PageRoute)

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // 1. 所有项目添加layout
            const layoutList = await layoutRepo.find()
            const projectList = await projectRepo.find()

            const layoutInstList = []
            projectList.forEach(project => {
                layoutList.forEach((layout, index) => {
                    layoutInstList.push({
                        code: layout.code,
                        layoutId: layout.id,
                        projectId: project.id,
                        routePath: '/',
                        isDefault: index === 0 ? 1 : 0
                    })
                })
            })

            const layoutInstResult = await transactionalEntityManager.save(LayoutInst, layoutInstList)

            // 2. 设置页面路由关联中的layoutId
            const layoutProjectIdMap = {}
            layoutInstResult.forEach(item => {
                if (layoutProjectIdMap[item.projectId]) {
                    layoutProjectIdMap[item.projectId].push(item.id)
                } else {
                    layoutProjectIdMap[item.projectId] = [item.id]
                }
            })
            const pageRouteList = await pageRouteRepo.find()
            const pageRouteUpdateList = pageRouteList.map(item => {
                return {
                    ...item,
                    layoutId: layoutProjectIdMap[item.projectId][0]
                }
            })
            const pageRouteResult = await transactionalEntityManager.save(PageRoute, pageRouteUpdateList)

            ctx.send({
                code: 0,
                message: '数据升级完成，data为部分结果',
                data: {
                    page: layoutInstResult.slice(0, 5),
                    route: pageRouteResult.slice(0, 5)
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 设置默认空布局模板routePath为/
 */
export const updateProjectLayoutRoutePath = async (ctx) => {
    if (Date.now() > new Date('2020-09-25 22:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const layoutInstRepo = getRepository(LayoutInst)

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // 1. 所有项目的空布局模板
            const layoutList = await layoutInstRepo.find({ where: { isDefault: 1 } })

            const layoutInstList = layoutList.map(layout => {
                return {
                    ...layout,
                    routePath: '/'
                }
            })

            const layoutInstResult = await transactionalEntityManager.save(LayoutInst, layoutInstList)

            ctx.send({
                code: 0,
                message: '数据升级完成，data为部分结果',
                data: {
                    page: layoutInstResult.slice(0, 5)
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 更新老数据删除页面同时删除路由与组件关联记录数据
 */
export const updateDeledPageRel = async (ctx) => {
    if (Date.now() > new Date('2020-10-03 23:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const pageRepo = getRepository(Page)

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            const deledPageList = await pageRepo.find({ select: ['id'], where: { deleteFlag: 1 } })

            // 删除页面与组件关联记录
            const pageCompList = await getRepository(PageComp)
                .createQueryBuilder()
                .select(['id', 'pageId', 'projectId'])
                .where('pageId IN (:...ids)', { ids: deledPageList.map(page => page.id) })
                .getRawMany()

            const pageCompResult = await transactionalEntityManager.remove(PageComp, pageCompList)

            // 删除页面与路由关联记录
            const pageRouteList = await getRepository(PageRoute)
                .createQueryBuilder()
                .select(['id', 'routeId', 'pageId', 'projectId'])
                .where('pageId IN (:...ids)', { ids: deledPageList.map(page => page.id) })
                .getRawMany()
            const savePageRouteList = pageRouteList.map(item => {
                return {
                    ...item,
                    deleteFlag: 1
                }
            })
            const pageRouteResult = await transactionalEntityManager.save(PageRoute, savePageRouteList)

            ctx.send({
                code: 0,
                message: '数据升级完成，data为影响数据',
                data: {
                    pageComp: pageCompResult,
                    pageRoute: pageRouteResult
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 修复因删除页面关联路由记录产生的脏数据
 */
export const delPageRouteDirtyRow = async (ctx) => {
    if (Date.now() > new Date('2020-10-03 23:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const pageRouteRepo = getRepository(PageRoute)

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // 删除错误的记录
            const dirtyPageRouteList = await pageRouteRepo
                .createQueryBuilder()
                .where('routeId = :routeId', { routeId: 0 })
                .andWhere('layoutId = :layoutId', { layoutId: 0 })
                .andWhere('projectId = :projectId', { projectId: 0 })
                .getMany()

            const dirtyPageRouteResult = await transactionalEntityManager.remove(PageRoute, dirtyPageRouteList)

            ctx.send({
                code: 0,
                message: '数据升级完成，data为影响数据',
                data: {
                    dirtyPageRoute: dirtyPageRouteResult
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

/**
 * 升级布局模板layoutCode值
 */
export const updateLayoutInstLayoutCode = async (ctx) => {
    if (Date.now() > new Date('2020-12-23 22:00:00').getTime()) {
        ctx.send('不在有效运行时间内，已退出')
        return
    }

    const md5 = require('md5')

    const layoutInstRepo = getRepository(LayoutInst)

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            // 1. 空layoutCode数据
            const emptyCodeLayoutList = await layoutInstRepo.find({
                where: { layoutCode: '' }
            })

            if (!emptyCodeLayoutList || !emptyCodeLayoutList.length) {
                ctx.send('暂无需要升级的数据，已退出')
                return
            }

            const layoutInstList = emptyCodeLayoutList.map(layout => {
                const prefixWord = String.fromCharCode(Math.floor(Math.random() * 26) + 97)
                const layoutCode = `${prefixWord}${md5(layout.projectId + layout.routePath).substr(0, 7)}`
                return {
                    ...layout,
                    layoutCode: layoutCode,
                    updateUser: layout.createUser,
                    createUser: layout.updateUser,
                    createTime: layout.createTime,
                    updateTime: layout.updateTime
                }
            })

            const layoutInstResult = await transactionalEntityManager.save(LayoutInst, layoutInstList)

            ctx.send({
                code: 0,
                message: '数据升级完成，data为部分结果',
                data: {
                    page: layoutInstResult.slice(0, 5)
                }
            })
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// NODE_ENV=development npx babel-node lib/server/controller/db-upgrade-helper.js
// require('typeorm').createConnection(require('../conf/data-base')).then(() => {
//     setDefaultCompCategory()
// })
