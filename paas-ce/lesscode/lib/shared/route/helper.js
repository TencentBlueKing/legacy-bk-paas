
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

/**
 * 根据路由对象获取路由配置的fullPath值
 * @param {Object} route 路由数据对象
 * @returns 路由配置的fullPath值
 */
export const getRouteFullPath = (route) => {
    const { layoutPath, path } = route
    return `${layoutPath}${layoutPath?.endsWith('/') ? '' : '/'}${path}`
}

/**
 * 根据路由对象获取路由配置的name值
 * @param {Object} route 路由数据对象
 * @returns 路由配置的name值
 */
export const getRouteName = (route) => {
    const { id, pageCode, redirectRoute } = route
    let fullPath = getRouteFullPath(route)
    if (redirectRoute) {
        fullPath = getRouteFullPath(redirectRoute)
    }
    // 跳转路由可能没有pageCode，使用跳转路径作为name，同时跳转路径可能会重复加上路由id防止
    const name = pageCode || `${fullPath.replace(/[\/\-\:]/g, '')}${id}`
    return name
}

/**
 * 获取项目默认首页路由
 * @param {Array} projectPageRouteList 项目页面路由列表，以页面数据为视角
 * @param {Array} projectRouteList 项目路由列表，以路由数据为视角，数据已打平
 * @returns 路由数据
 */
export const getProjectDefaultRoute = (projectPageRouteList, projectRouteList) => {
    // 先看是否存在根'/'路由配置
    const defaultHome = projectRouteList.find(item => item.fullPath === '/')
    if (defaultHome) {
        return defaultHome
    }

    // 否则找配置了父路由为'/'的第一个页面，将其路由作为默认首页路由
    const rootPathRoute = projectPageRouteList.find(item => item.layoutPath === '/')
    if (rootPathRoute && rootPathRoute.id) {
        return rootPathRoute
    }

    // 最后返回项目的第1个路由
    return projectRouteList[0]
}
