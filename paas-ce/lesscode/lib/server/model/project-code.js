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
import * as PageCompModel from './page-comp'
import * as ComponentModel from './component'
import { uuid, walkGrid } from '../util'
const httpConf = require('../conf/http')
// npm.js配置文件不存在时赋值空对象
let npmConf
try {
    npmConf = require('../conf/npm')
} catch(_) {
    npmConf = {}
}

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const request = require('request')
const shell = require('shelljs')

const { logger } = require('../logger')

const DIR_PATH = '.'

const STATIC_URL = `${DIR_PATH}/lib/server/project-template/`

const projectCode = {

    async previewCode (projectId) {
        // 生成路由相关的数据
        const routeList = await routeModel.findProjectRoute(projectId)
        const routeGroup = {}
        routeList.forEach((route) => {
            if (route.pageId === -1 || route.pageDeleteFlag !== 0) return

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
        })

        // 获取生成view文件所需的数据
        const allCustomMap = await ComponentModel.getNameMap()
        const funcGroups = await FuncModel.allGroupFuncDetail(projectId) || []
        const allVarableList = await VariableModel.getAll({ projectId }) || []
        const projectVariables = allVarableList.filter(variable => variable.effectiveRange === 0)
        const pageData = {
            allCustomMap,
            funcGroups
        }
        const layoutIns = Object.values(routeGroup)
        for (const layout of layoutIns) {
            const routeList = layout.children
            const pageDetail = await PageCodeModel.getPageData([], 'preview', pageData.allCustomMap, pageData.funcGroups, {}, projectId, '', layout.content, true, false, layout.layoutType, [])
            layout.content = pageDetail.code

            await Promise.all(routeList.map(async route => {
                // 生成views部分
                const variableData = [
                    ...projectVariables,
                    ...allVarableList.filter((variable) => (variable.effectiveRange === 1 && variable.pageCode === route.pageCode))
                ]
                const pageDetail = await PageCodeModel.getPageData(
                    JSON.parse(route.content),
                    'preview',
                    pageData.allCustomMap,
                    pageData.funcGroups,
                    route.lifeCycle,
                    projectId,
                    route.pageId,
                    '',
                    false,
                    false,
                    route.layoutType,
                    variableData
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

        return { routeGroup, storeData }
    },

    async generateCode (projectId, pathName) {
        const sourcePath = STATIC_URL + 'project-init-code'
        const targetPath = STATIC_URL + (pathName || `project-target-code${projectId}`)

        return new Promise(async (resolve, reject) => {
            try {
                fse.copySync(sourcePath, targetPath)
                const routeList = await routeModel.findProjectRoute(projectId)
                const routeGroup = {}
                const routeMap = {}

                let isUseElement = false
                routeList.forEach((route) => {
                    routeMap[route.pageCode] = route.pageId

                    // 每个 route 是一个页面，只有要一个页面使用了 element，那么其他页面就不用检测是否使用了
                    if (!isUseElement) {
                        const targetData = JSON.parse(route.content || '[]') || []
                        targetData.forEach((container, index) => {
                            const callBack = item => {
                                if (item.name.startsWith('el-')) {
                                    isUseElement = true
                                }
                            }
                            walkGrid(targetData, container, callBack, callBack, index)
                        })
                    }
                })
                routeList.forEach((route) => {
                    if (route.pageId === -1 || route.pageDeleteFlag !== 0) return

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
                })
                let routerImport = ''
                let routerStr = ''

                // 获取生成view文件所需的数据
                const allCustomMap = await ComponentModel.getNameMap()
                const funcGroups = await FuncModel.allGroupFuncDetail(projectId) || []
                const allVarableList = await VariableModel.getAll({ projectId }) || []
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
                    let childRoute = routeList.map((route) => (`{ path: '${route.path}', name: '${route.pageCode}', component: ${route.pageCode} }`)).join(',')
                    const currentFilePath = path.join(targetPath, `lib/client/src/views/${layout.name}/bkindex.vue`)
                    await this.writeViewCode(currentFilePath, { targetData: [] }, '', pathName, projectId, {}, '', layout.content, true, layout.layoutType, [])
                    if (layout.path !== '/') childRoute += `,{ path: '*', component: BkNotFound }`
                    routerStr += `{
                        path: '${layout.path}',
                        name: '${layout.name + uniqStr}',
                        component: ${layoutName},
                        children: [${childRoute}]
                    },\n`
                    await Promise.all(routeList.map(async route => {
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
                            variableData
                        ) || []

                        usedMethodList = [...usedMethodList, ...methodStrList]
                        const packageJsonArr = await PageCompModel.getProjectComp(projectId)
                        await this.writePackageJSON(
                            path.join(targetPath, 'package.json'),
                            packageJsonArr
                        )
                    }))
                }

                // 生成函数mixin
                const methodsMixinPath = path.join(targetPath, `lib/client/src/mixins/methods-mixin.js`)
                if (usedMethodList.length) await this.writeMethodsMixin(methodsMixinPath, usedMethodList, pathName)

                // 生成.npmrc文件内容
                if (npmConf.registry) {
                    const npmrcContent = `${npmConf.scopename}:registry=${npmConf.registry}`
                    fs.writeFileSync(path.join(targetPath, '.npmrc'), npmrcContent, 'utf8')
                }
                
                // 生成router
                if (routerStr.endsWith(',\n')) {
                    routerStr = routerStr.substr(0, routerStr.length - 2)
                }
                const routeSourcePath = path.join(STATIC_URL, 'router-template.js')
                const routeTargetPath = path.join(targetPath, 'lib/client/src/router/index.js')
                await this.generateFileByReplace(routeSourcePath, routeTargetPath, (content) => {
                    return content.replace(/\$\{importStr\}/, routerImport).replace(/\$\{routerStr\}/, routerStr)
                })

                // 生成store
                const storeStr = projectVariables.length ? [] : [`example: getInitVariableValue({all: 0, stag: 0, prod: 0}, 0)`]
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
                        mainFileContent.replace(/\$\{importElementLib\}/, `import '@/common/element'`),
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

                resolve('success')
            } catch (err) {
                reject(err.message || err)
            }
        })
    },

    async generateFileByReplace (sourcePath, targetPath, replaceCallBack) {
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
        if (errMessage && !pathName) throw new global.BusinessError(errMessage)
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

    writeViewCode (currentFilePath, pageData, pageCode, pathName, projectId, lifeCycle, pageId, layoutContent, isGenerateNav, layoutType, variableData) {
        return new Promise(async (resolve, reject) => {
            fse.ensureFile(currentFilePath).then(async () => {
                let code = ''
                let methodStrList = []
                const pageDetail = await PageCodeModel.getPageData(pageData.targetData, 'projectCode', pageData.allCustomMap, pageData.funcGroups, lifeCycle, projectId, pageId, layoutContent, isGenerateNav, false, layoutType, variableData)
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
