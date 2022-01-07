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
import VueCodeModel from '../model/vue-code'
import PageCodeModel from '../model/page-code'
import routeModel from '../model/route'
import variableModel from '../model/variable'

import { allGroupFuncDetail } from '../model/function'
import OperationLogger from '../service/operation-logger'

const AU = require('ansi_up')
const ansiUp = new AU.default  // eslint-disable-line

const VueCode = {
    async saveAsFile (ctx) {
        try {
            ctx.send({
                code: 0,
                message: 'success',
                data: ''
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },
    async formatCode (ctx) {
        try {
            const post = ctx.request.body || {}
            const ret = await VueCodeModel.formatCode(post.code)

            ctx.send({
                code: 0,
                message: 'success',
                // ret 为空的话，说明 formatCode 是 eslint 检测正确的
                data: ret
            })
        } catch (err) {
            ctx.throwError({
                message: err.message
            })
        }
    },
    async getPageCode (ctx) {
        const operationLogger = new OperationLogger(ctx)
        try {
            const {
                pageType = 'vueCode',
                projectId = '',
                pageId,
                layoutContent,
                targetData = [],
                from,
                withNav,
                fromPageCode = ''
            } = ctx.request.body

            console.time('vueCode')

            const [funcGroups, routeList, allVarableList] = await Promise.all([allGroupFuncDetail(projectId), routeModel.findProjectRoute(projectId), variableModel.getAll({ projectId })])
            const curPage = routeList.find((route) => (route.pageId === +pageId)) || {}
            console.log(curPage, 235111)
            const variableList = [
                ...allVarableList.filter(variable => variable.effectiveRange === 0),
                ...allVarableList.filter((variable) => (variable.effectiveRange === 1 && (variable.pageCode === curPage.pageCode || variable.pageCode === fromPageCode)))
            ]
            let curLayoutCon = {}
            if (withNav) {
                curLayoutCon = layoutContent || JSON.parse(curPage.layoutContent || '{}')
                const routeMap = {}
                routeList.forEach((route) => {
                    routeMap[route.pageCode] = route.pageId
                });
                [...(curLayoutCon.menuList || []), ...(curLayoutCon.topMenuList || [])].forEach((nav) => {
                    if (nav.pageCode) nav.pageId = routeMap[nav.pageCode];
                    (nav.children || []).forEach((child) => {
                        child.pageId = routeMap[child.pageCode]
                    })
                })
            }
            const pageTargetData = Array.isArray(targetData) && targetData.length > 0 ? targetData : JSON.parse(curPage.content || '[]')
            
            const { code, codeErrMessage } = await PageCodeModel.getPageData({
                targetData: pageTargetData,
                pageType,
                funcGroups,
                lifeCycle: curPage.lifeCycle || {}, 
                projectId,
                pageId,
                layoutContent: curLayoutCon,
                isGenerateNav: false, 
                isEmpty: false,
                layoutType: curPage.layoutType,
                variableList
            })
            
            // 此接口被多方调用，目前仅收集下载页面源码
            if (from === 'download_page') {
                operationLogger.success()
            }
            console.timeEnd('vueCode')
            ctx.send({
                code: 0,
                message: 'success',
                data: code,
                codeErrMessage
            })
        } catch (err) {
            if (ctx.request.body.from === 'download_page') {
                operationLogger.error(err)
            }
            ctx.send({
                code: 0,
                message: 'success',
                data: ansiUp.ansi_to_html(err.message || err)
            })
        }
    }
}

module.exports = VueCode
