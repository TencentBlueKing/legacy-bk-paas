/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
import VueCodeModel from './vue-code'
import routeModel from './route'
import PageCodeModel from './page-code'
import FuncModel from './function'
import VariableModel from './variable'
import DataTableModifyRecord from './data-table-modify-record'
import * as PageCompModel from './page-comp'
import * as ComponentModel from './component'
import { uuid, walkGrid } from '../util'
import dataService from '../service/data-service'
import {
    BASE_COLUMNS
} from '../../shared/data-source'
const httpConf = require('../conf/http')
// npm.js配置文件不存在时赋值空对象
let npmConf
try {
    npmConf = require('../conf/npm')
} catch (_) {
    npmConf = {}
}

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

const DIR_PATH = '.'

const STATIC_URL = `${DIR_PATH}/lib/server/project-template/`

const projectCode = {

    async previewCode (projectId, versionId) {
        // 获取预览相关的数据
        const [
            routeList,
            pageRouteList,
            allCustomMap,
            funcGroups = [],
            allVarableList = []
        ] = await Promise.all([
            routeModel.findProjectRoute(projectId, versionId),
            routeModel.queryProjectPageRoute(projectId, versionId),
            ComponentModel.getNameMap(),
            FuncModel.allGroupFuncDetail(projectId, versionId),
            VariableModel.getAll({ projectId, versionId })
        ])

        const routeGroup = {}
        for (const route of routeList) {
            // 允许pageId === -1，表示未绑定页面但绑定了路由，两者都未绑定则过虑
            if (route.pageId === -1 && !route.redirect) {
                continue
            }

            if (route.redirect) {
                const { pageCode, path, layoutPath } = routeList.find(item => item.id === route.redirect) || {}
                route.redirectRoute = { pageCode, path, layoutPath }
            }

            const layoutId = route.layoutId
            const curRoute = routeGroup[layoutId]
            if (curRoute) {
                curRoute.children.push(route)
            } else {
                routeGroup[layoutId] = {
                    children: [route],
                    content: JSON.parse(route.layoutContent || '{}'),
                    layoutType: route.layoutType,
                    path: route.layoutPath,
                    name: route.layoutCode || 'emptyView'
                }
            }
        }

        const projectVariables = allVarableList.filter(variable => variable.effectiveRange === 0)
        const pageData = {
            allCustomMap,
            funcGroups
        }
        const layoutIns = Object.values(routeGroup)
        for (const layout of layoutIns) {
            // 父路由（布局）内容
            const pageDetail = await PageCodeModel.getPageData([], 'preview', pageData.allCustomMap, pageData.funcGroups, {}, projectId, '', layout.content, true, false, layout.layoutType, [], {})
            layout.content = pageDetail.code

            // 子路由（页面）内容，先排除未绑定页面的路由
            const routeList = layout.children.filter(route => route.pageId !== -1)
            await Promise.all(routeList.map(async route => {
                // 生成views部分
                const variableData = [
                    ...projectVariables,
                    ...allVarableList.filter((variable) => (variable.effectiveRange === 1 && variable.pageCode === route.pageCode))
                ]
                const pageDetail = await PageCodeModel.getPageData(
                    JSON.parse(route.content || '[]'),
                    'preview',
                    pageData.allCustomMap,
                    pageData.funcGroups,
                    route.lifeCycle || {},
                    projectId,
                    route.pageId,
                    '',
                    false,
                    false,
                    route.layoutType,
                    variableData,
                    route.styleSetting || {}
                )
                // 生成代码校验
                if (pageDetail.codeErrMessage) {
                    throw new Error(`页面【${route.pageCode}】里面，${pageDetail.codeErrMessage}`)
                }
                route.content = pageDetail.code
            }))
        }

        // 生成store
        const storeData = []
        projectVariables.forEach(({ variableCode, valueType, defaultValue, defaultValueType }) => {
            if ([3, 4].includes(valueType)) {
                // eslint-disable-next-line no-return-assign
                ['all', 'prod', 'stag'].forEach((key) => defaultValue[key] = JSON.parse(defaultValue[key]))
            }
            storeData.push({ variableCode, defaultValue, defaultValueType })
        })

        return { routeGroup, storeData, pageRouteList }
    },

    async generateCode (projectId, versionId, pathName) {
        const sourcePath = STATIC_URL + 'project-init-code'
        const targetPath = STATIC_URL + (pathName || `project-target-code${projectId}${versionId ? `-${versionId}` : ''}`)

        return new Promise(async (resolve, reject) => {
            try {
                fse.copySync(sourcePath, targetPath)

                const [
                    routeList,
                    pageRouteList,
                    allCustomMap,
                    funcGroups = [],
                    allVarableList = [],
                    { list: dataTables = [] },
                    dataTableModifyRecords
                ] = await Promise.all([
                    routeModel.findProjectRoute(projectId, versionId),
                    routeModel.queryProjectPageRoute(projectId, versionId),
                    ComponentModel.getNameMap(),
                    FuncModel.allGroupFuncDetail(projectId, versionId),
                    VariableModel.getAll({ projectId, versionId }),
                    dataService.get('data-table', { projectId, deleteFlag: 0 }),
                    DataTableModifyRecord.getListByTime({ query: { projectId } })
                ])

                const routeGroup = {}
                const routeMap = {}

                let isUseElement = false
                routeList.forEach((route) => {
                    routeMap[route.pageCode] = route.pageId

                    // 每个 route 是一个页面，只有要一个页面使用了 element，那么其他页面就不用检测是否使用了
                    if (!isUseElement) {
                        const targetData = JSON.parse(route.content || '[]')
                        targetData.forEach((container, index) => {
                            const callBack = item => {
                                if (item.name && item.name.startsWith('el-')) {
                                    isUseElement = true
                                }
                            }
                            walkGrid(targetData, container, callBack, callBack, index)
                        })
                    }
                })

                for (const route of routeList) {
                    // 允许pageId === -1，表示未绑定页面但绑定了路由，两者都未绑定则过虑
                    if (route.pageId === -1 && !route.redirect) {
                        continue
                    }

                    if (route.redirect) {
                        const { pageCode, path, layoutPath } = routeList.find(item => item.id === route.redirect) || {}
                        route.redirectRoute = { pageCode, path, layoutPath }
                    }

                    const layoutId = route.layoutId
                    const curRoute = routeGroup[layoutId]
                    if (curRoute) {
                        curRoute.children.push(route)
                    } else {
                        routeGroup[layoutId] = {
                            children: [route],
                            content: JSON.parse(route.layoutContent || '{}'),
                            layoutType: route.layoutType,
                            path: route.layoutPath,
                            name: route.layoutCode || 'emptyView'
                        }
                    }
                }

                let routerImport = ''
                let routerStr = ''
                let defaultRouteRedirect = 'redirect: { name: \'404\' }'

                // 获取生成view文件所需的数据
                const projectVariables = allVarableList.filter(variable => variable.effectiveRange === 0)
                const pageData = {
                    allCustomMap,
                    funcGroups
                }
                let usedMethodList = []
                const layoutIns = Object.values(routeGroup)
                const uniqStr = uuid()
                for (const layout of layoutIns) {
                    const routeList = layout.children
                    const layoutName = layout.name.replace(/-(\w)/g, (a, b) => b.toUpperCase()) + uniqStr
                    routerImport += `const ${layoutName} = () => import(/* webpackChunkName: '${layout.name}' */'@/views/${layout.name}/bkindex')\n`

                    // 预览路由优化使用path跳转（防止因name不存在自动跳到首页），生成代码使用name跳转，因导航菜单中已经使用name跳转
                    const childRoute = routeList.map((route) => {
                        const meta = `meta: { pageName: '${route.pageName}' }`
                        if (route.redirectRoute) {
                            const { layoutPath, path } = route.redirectRoute
                            const fullPath = `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`
                            const routeName = route.pageCode || `${fullPath.replace(/[\/\-\:]/g, '')}${route.id}`
                            const routeComponent = route.pageCode ? ` component: ${route.pageCode},` : ''
                            return `{ path: '${route.path}', name: '${routeName}',${routeComponent} redirect: { path: '${fullPath}' }, ${meta} }`
                        } else if (route.pageId !== -1) {
                            return `{ path: '${route.path}', name: '${route.pageCode}', component: ${route.pageCode}, ${meta} }`
                        } else {
                            return `{ path: '${route.path}', redirect: { name: '404' } }`
                        }
                    })
                    if (layout.path !== '/') childRoute.push('{ path: \'*\', component: BkNotFound, meta: { pageName: \'404\' } }')

                    const currentFilePath = path.join(targetPath, `lib/client/src/views/${layout.name}/bkindex.vue`)
                    await this.writeViewCode(currentFilePath, { targetData: [] }, '', pathName, projectId, {}, '', layout.content, true, layout.layoutType, [], {})

                    routerStr += `{
                        path: '${layout.path.replace(/^\//, '')}',
                        name: '${layout.name + uniqStr}',
                        component: ${layoutName},
                        children: [
                            ${childRoute.join(',\n')}
                        ]
                    },\n`

                    // 绑定了路由的页面才需要生成内容
                    const usePageRouteList = layout.children.filter(route => route.pageId !== -1)
                    await Promise.all(usePageRouteList.map(async route => {
                        // 生成router部分
                        routerImport += `const ${route.pageCode} = () => import(/* webpackChunkName: '${route.pageCode}' */'@/views/${layout.name}/${route.pageCode}.vue')\n`
                        // 生成views部分
                        const pageId = route.pageId
                        const currentFilePath = path.join(targetPath, `lib/client/src/views/${layout.name}/${route.pageCode}.vue`)
                        const variableData = [
                            ...projectVariables,
                            ...allVarableList.filter((variable) => (variable.effectiveRange === 1 && variable.pageCode === route.pageCode))
                        ]
                        const methodStrList = await this.writeViewCode(
                            currentFilePath,
                            Object.assign({}, pageData, { targetData: JSON.parse(route.content) }),
                            route.pageCode,
                            pathName,
                            projectId,
                            route.lifeCycle,
                            pageId,
                            '',
                            false,
                            route.layoutType,
                            variableData,
                            route.styleSetting
                        ) || []

                        usedMethodList = [...usedMethodList, ...methodStrList]
                        const packageJsonArr = await PageCompModel.getProjectComp(projectId, versionId)
                        await this.writePackageJSON(
                            path.join(targetPath, 'package.json'),
                            packageJsonArr
                        )
                    }))
                }

                // 生成函数mixin
                const methodsMixinPath = path.join(targetPath, 'lib/client/src/mixins/methods-mixin.js')
                if (usedMethodList.length) await this.writeMethodsMixin(methodsMixinPath, usedMethodList, pathName)

                // 生成.npmrc文件内容
                if (npmConf.registry) {
                    const npmrcContent = `${npmConf.scopename}:registry=${npmConf.registry}`
                    fs.writeFileSync(path.join(targetPath, '.npmrc'), npmrcContent, 'utf8')
                }

                // 生成router
                pageRouteList.forEach(route => {
                    // 未绑定路由的页面跳转到404
                    if (!route.id) {
                        routerStr += `{
                            path: '${route.pageCode}404',
                            name: '${route.pageCode}',
                            redirect: { name: '404' }
                        },\n`
                    }
                })
                if (routerStr.endsWith(',\n')) {
                    routerStr = routerStr.substr(0, routerStr.length - 2)
                }

                // 寻找默认首页
                const availableRoutList = routeList.filter(item => !(item.pageId === -1 && !item.redirect))
                    .map(({ id, layoutPath, path, pageCode, redirectRoute }) => ({ id, layoutPath, path, pageCode, redirectRoute }))
                let defaultHomeRoute = availableRoutList.find(({ layoutPath, path }) => layoutPath === '/' && path === '')
                if (!defaultHomeRoute) {
                    defaultHomeRoute = pageRouteList.find(item => item.layoutPath === '/' && item.id)
                }
                const defaultRoute = defaultHomeRoute || availableRoutList[0]
                if (defaultRoute) {
                    const { id, layoutPath, path, pageCode, redirectRoute } = defaultRoute
                    let fullPath = `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`
                    if (redirectRoute) {
                        fullPath = `${redirectRoute.layoutPath}${redirectRoute.layoutPath.endsWith('/') ? '' : '/'}${redirectRoute.path}`
                    }
                    // 跳转路由可能没有pageCode，使用跳转路径作为name，同时跳转路径可能会重复加上路由id防止
                    const redirectRouteName = pageCode || `${fullPath.replace(/[\/\-\:]/g, '')}${id}`
                    defaultRouteRedirect = `redirect: { name: '${redirectRouteName}' }`
                }

                const routeSourcePath = path.join(STATIC_URL, 'router-template.js')
                const routeTargetPath = path.join(targetPath, 'lib/client/src/router/index.js')
                await this.generateFileByReplace(routeSourcePath, routeTargetPath, (content) => {
                    return content.replace(/\$\{importStr\}/, routerImport)
                        .replace(/\$\{routerStr\}/, routerStr)
                        .replace(/\$\{defaultRedirect\}/, defaultRouteRedirect)
                })

                // 生成store
                const storeStr = projectVariables.length ? [] : ['example: getInitVariableValue({all: 0, stag: 0, prod: 0}, 0)']
                projectVariables.forEach(({ variableCode, defaultValue, valueType, defaultValueType }) => {
                    if ([3, 4].includes(valueType)) {
                        // eslint-disable-next-line no-return-assign
                        ['all', 'prod', 'stag'].forEach((key) => defaultValue[key] = JSON.parse(defaultValue[key]))
                    }
                    storeStr.push(`${variableCode}: getInitVariableValue(${JSON.stringify(defaultValue)}, ${defaultValueType})`)
                })
                const variablePath = path.join(targetPath, 'lib/client/src/store/modules/variable.js')
                await this.generateFileByReplace(variablePath, variablePath, (content) => {
                    return content.replace(/\$\{stateStr\}/, storeStr.join(',\n'))
                })

                // 对 element 组件库的处理
                const mainFilePath = path.join(targetPath, 'lib/client/src/main.js')
                const mainFileContent = fs.readFileSync(mainFilePath, 'utf8')
                if (isUseElement) {
                    fs.writeFileSync(
                        mainFilePath,
                        mainFileContent.replace(/\$\{importElementLib\}/, 'import \'@/common/element\''),
                        'utf8'
                    )
                    await this.writePackageJSON(
                        path.join(targetPath, 'package.json'),
                        [{ name: 'element-ui', version: 'latest' }]
                    )
                } else {
                    fs.writeFileSync(
                        mainFilePath,
                        mainFileContent.replace(/\$\{importElementLib\}/, ''),
                        'utf8'
                    )
                    fs.unlinkSync(path.join(targetPath, 'lib/client/src/common/element.js'))
                }

                await this.generateDataSource(dataTables, dataTableModifyRecords, targetPath)
                resolve('success')
            } catch (err) {
                reject(err.message || err)
            }
        })
    },

    async generateDataSource (dataTables = [], dataTableModifyRecords = [], targetPath) {
        const hasDataTable = dataTables.length > 0

        // replace app.browser.js
        const appPath = path.join(targetPath, 'lib/server/app.browser.js')
        await this.generateFileByReplace(appPath, appPath, (content) => {
            const dbImport = hasDataTable ? 'const { createConnection } = require(\'typeorm\')\r\nconst dataBaseConf = require(\'./conf/data-base\')\r\n' : ''
            const startStr = hasDataTable ? 'createConnection(dataBaseConf).then((connection) => {\r\n    return startServer()\r\n}).catch((err) => logger.error(err.message || err))\r\n' : 'startServer()'
            return content.replace(/\$\{dbImport\}/, dbImport).replace(/\$\{startStr\}/, startStr)
        })

        if (hasDataTable) {
            // generate data-base-config
            await this.generateFileByReplace(
                path.join(STATIC_URL, 'data-base-template.js'),
                path.join(targetPath, 'lib/server/conf/data-base.js')
            )

            // generate model & entity
            fse.ensureDirSync(path.join(targetPath, 'lib/server/model'))
            fse.ensureDirSync(path.join(targetPath, 'lib/server/model/entities'))
            await this.generateFileByReplace(
                path.join(STATIC_URL, 'base-entity-template.js'),
                path.join(targetPath, 'lib/server/model/entities/base.js')
            )
            for (const dataTable of dataTables) {
                const { tableName, columns = '[]' } = dataTable
                const tableFields = JSON.parse(columns).reduce((acc, cur) => {
                    if (BASE_COLUMNS.every(item => item.name !== cur.name)) {
                        acc += `\r\n    @Column({ type: '${cur.type}' })\r\n    ${cur.name}\r\n`
                    }
                    return acc
                }, '')
                await this.generateFileByReplace(
                    path.join(STATIC_URL, 'entity-template.js'),
                    path.join(targetPath, `lib/server/model/entities/${tableName}.js`),
                    content => content.replace(/\$\{tableName\}/, tableName).replace(/\$\{tableFields\}/, tableFields)
                )
            }
        }

        if (dataTableModifyRecords.length) {
            // generate migrations
            fse.ensureDirSync(path.join(targetPath, 'lib/server/model/migrations'))
            fse.ensureDirSync(path.join(targetPath, 'lib/server/model/migrations/sql'))
            for (const record of dataTableModifyRecords) {
                const { sql, createTime } = record
                const migrationName = `Lesscode${+createTime}`
                const fileName = `${+createTime}-lesscode`
                fs.writeFileSync(
                    path.join(targetPath, `lib/server/model/migrations/sql/${fileName}.sql`),
                    sql,
                    'utf8'
                )
                await this.generateFileByReplace(
                    path.join(STATIC_URL, 'data-migration-template.js'),
                    path.join(targetPath, `lib/server/model/migrations/${fileName}.js`),
                    content => content.replace(/\$\{migrationName\}/, migrationName).replace(/\$\{fileName\}/, fileName)
                )
            }
        }
    },

    async generateFileByReplace (sourcePath, targetPath, replaceCallBack = str => str) {
        const fileConent = fs.readFileSync(sourcePath, 'utf8')
        const newFileContent = replaceCallBack(fileConent)
        const [message, fileStr] = await VueCodeModel.formatJsByEslint(newFileContent)
        if (message) throw new Error(message)
        fs.writeFileSync(targetPath, fileStr, 'utf8')
    },

    async writeMethodsMixin (methodsMixinPath, usedMethodList, pathName) {
        let methodsStr = `
            export default {
                methods: {
        `
        // 去重
        const methodMap = {}
        usedMethodList.forEach(({ id, funcStr }) => {
            const curStr = methodMap[id]
            if (!curStr) {
                methodMap[id] = funcStr
            } else {
                const hasUnknowCode = /lesscode((\[\'\$\{prop:([\S]+)\}\'\])|(\[\'\$\{func:([\S]+)\}\'\]))/.test(curStr)
                if (hasUnknowCode) {
                    methodMap[id] = funcStr
                }
            }
        })
        const mixinsList = Object.keys(methodMap).map((id) => (methodMap[id]))
        methodsStr += `${mixinsList.join(',')}\n}\n}`
        const [errMessage, formatedMethodStr] = await VueCodeModel.formatJsByEslint(methodsStr) || ''
        if (errMessage && !pathName) {
            throw new global.BusinessError(errMessage, 499)
        }
        fs.writeFileSync(methodsMixinPath, formatedMethodStr, 'utf8')
    },

    writePackageJSON (packageJsonFilePath, deps) {
        return new Promise(async (resolve, reject) => {
            fse.ensureFile(packageJsonFilePath).then(async () => {
                const str = await fs.readFileSync(packageJsonFilePath, 'utf8')
                const ret = JSON.parse(str)
                const dependencies = ret.dependencies
                deps.forEach(item => {
                    dependencies[item.name] = item.version
                })

                // 将信息带到build命令的package.json的env中
                Object.assign(ret.betterScripts.dev.env, {
                    BK_LOGIN_URL: httpConf.loginUrl,
                    BKPAAS_APP_ID: httpConf.appCode,
                    BKPAAS_APP_SECRET: httpConf.appSecret,
                    BK_PAAS2_INNER_URL: httpConf.hostUrl
                })
                Object.assign(ret.betterScripts.build.env, {
                    BK_LOGIN_URL: httpConf.loginUrl,
                    BKPAAS_APP_ID: httpConf.appCode,
                    BKPAAS_APP_SECRET: httpConf.appSecret,
                    BK_PAAS2_INNER_URL: httpConf.hostUrl
                })
                await fs.writeFileSync(packageJsonFilePath, JSON.stringify(ret, null, 2), 'utf8')
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    },

    writeViewCode (currentFilePath, pageData, pageCode, pathName, projectId, lifeCycle, pageId, layoutContent, isGenerateNav, layoutType, variableData, styleSetting) {
        return new Promise(async (resolve, reject) => {
            fse.ensureFile(currentFilePath).then(async () => {
                let code = ''
                let methodStrList = []
                const pageDetail = await PageCodeModel.getPageData(pageData.targetData, 'projectCode', pageData.allCustomMap, pageData.funcGroups, lifeCycle, projectId, pageId, layoutContent, isGenerateNav, false, layoutType, variableData, styleSetting)
                code = pageDetail.code
                methodStrList = pageDetail.methodStrList
                // 生成代码校验
                if (pageDetail.codeErrMessage && !pathName) {
                    throw new Error(`页面【${pageCode}】里面，${pageDetail.codeErrMessage}`)
                }
                fs.writeFileSync(currentFilePath, code, 'utf8')
                resolve(methodStrList)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

module.exports = projectCode
