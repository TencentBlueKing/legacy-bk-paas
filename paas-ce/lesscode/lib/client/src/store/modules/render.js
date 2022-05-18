/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import Store from '@/store'

export default {
    namespaced: true,
    state: {
        projectId: '',
        pageId: '',
        projectDetail: {},
        projectRoute: {},
        projectRouteGroup: {},
        projectLayoutList: [],
        projectPageList: [],
        projectFuntionGroup: [],
        pageDetail: {},
        pageLayout: {},
        pageVariableList: [],
        pageSetting: {},
        pageRoute: {},
        customComponentNameMap: {},
        curTemplateData: {}
    },
    mutations: {
        setProjectId (state, projectId) {
            state.projectId = projectId
        },
        setPageId (state, pageId) {
            state.pageId = pageId
        },
        setProjectDetail (state, projectDetail) {
            state.projectDetail = Object.freeze(projectDetail)
        },
        setProjectRoute (state, projectRoute) {
            state.projectRoute = Object.freeze(projectRoute)
        },
        setProjectRouteGroup (state, projectRouteGroup) {
            state.projectRouteGroup = Object.freeze(projectRouteGroup)
        },
        setProjectLayoutList (state, projectLayoutList) {
            state.projectLayoutList = Object.freeze(projectLayoutList)
        },
        setPageVariableList (state, pageVariableList) {
            state.pageVariableList = Object.freeze(pageVariableList)
        },
        setProjectFunctionGroup (state, projectFuntionGroup) {
            state.projectFuntionGroup = Object.freeze(projectFuntionGroup)
        },
        setPageDetail (state, pageDetail) {
            state.pageDetail = Object.freeze(pageDetail)
        },
        setProjectPageList (state, projectPageList) {
            state.projectPageList = Object.freeze(projectPageList)
        },
        setPageRoute (state, pageRoute) {
            state.pageRoute = Object.freeze(pageRoute)
        },
        setPageLayout (state, pageLayout) {
            state.pageLayout = Object.freeze(pageLayout)
        },
        setCustomComponentNameMap (state, customComponentNameMap) {
            state.customComponentNameMap = Object.freeze(customComponentNameMap)
        },
        setcurTemplateData (state, curTemplateData) {
            state.curTemplateData = Object.freeze(curTemplateData)
        }
    },
    actions: {
        // 应用详情
        getProjectDetail ({ commit, state }) {
            return Store.dispatch('project/detail', {
                projectId: state.projectId
            }).then(data => {
                commit('setProjectDetail', data)
            })
        },
        // 应用完整路由配置
        getProjectRouteGroup ({ commit, state }) {
            return Store.dispatch('project/detail', {
                projectId: state.projectId
            }).then(data => {
                commit('setProjectRouteGroup', data)
            })
        },
        // 应用下的完整函数数据
        getProjectFuntionGroup ({ commit, state }) {
            return Store.dispatch('functions/getAllGroupAndFunction', state.projectId)
                .then(data => {
                    commit('setProjectFunctionGroup', data)
                })
        },
        // 应用下的完整布局列表
        getProjectLayoutList ({ commit, state }) {
            return Store.dispatch('layout/getList', {
                projectId: state.projectId
            }, { root: true })
                .then(data => {
                    commit('setProjectLayoutList', data.map(item => ({
                        ...item,
                        defaultName: item.showName || item.defaultName
                    })))
                })
        },
        // 应用下的所有页面
        getProjectPageList ({ commit, state }) {
            return Store.dispatch('page/getList', {
                projectId: state.projectId
            }).then(data => {
                commit('setProjectPageList', data)
            })
        },
        // 页面详情
        getPageDetail ({ commit, state }) {
            return Store.dispatch('page/detail', {
                pageId: state.pageId
            }).then(data => {
                commit('setPageDetail', data)
            })
        },
        // 当前页面路由配置
        getPageRoute ({ commit, state }) {
            return Store.dispatch('route/getProjectPageRoute', {
                projectId: state.projectId
            }).then(data => {
                commit('setProjectRoute', data)
            })
        },
        // 当前页面路由配置
        getPageLayout ({ commit, state }) {
            return Store.dispatch('layout/getPageLayout', {
                pageId: state.pageId
            }).then(data => {
                commit('setPageLayout', data)
            })
        },
        
        // 自定义组件name
        getCustomComponentNameMap ({ commit }) {
            return Store.dispatch('components/componentNameMap')
                .then(data => {
                    commit('setCustomComponentNameMap', data)
                })
        },
        
        // 页面变量
        getPageVariableList ({ commit, state }) {
            return Store.dispatch('variable/getAllVariable', {
                projectId: state.projectId,
                pageCode: state.pageDetail.pageCode,
                effectiveRange: 0
            }).then(data => {
                commit('setPageVariableList', data)
            })
        },
        // 页面编辑状态
        getPageLockStatus ({ state }) {
            return Store.dispatch('page/pageLockStatus', {
                pageId: state.pageId
            })
        }
    }
}
