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
 * controller 装饰器
 * @param {*} basePath 接口统一前缀
 */
export function Controller (basePath) {
    return (target) => {
        Reflect.defineMetadata('basePath', basePath, target)
    }
}

/**
 * 路由工厂函数
 * @param {*} method 接口方法
 * 注意：如果一个方法有多个装饰器，方法装饰器需放在最下层
 */
export function createRouterDecorator (method) {
    return (path = '', options = {}) => (target, propertyKey, descriptor) => {
        // build route
        const route = {
            propertyKey,
            method,
            path
        }
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target)
        }
        const routes = Reflect.getMetadata('routes', target)
        routes.push(route)

        // if no userControl in options, add handler proxy.
        if (!options.userControl) {
            const originValue = descriptor.value
            descriptor.value = async (ctx) => {
                try {
                    const metadata = target.__metadata[originValue.name]
                    const params = Array(originValue.length).fill('_').map((_, index) => metadata[index](ctx))
                    const data = await originValue.apply(this, params)
                    return data
                } catch (error) {
                    throw error
                }
            }
        }
    }
}

/**
 * 抛出常用的方法
 * 注意：如果一个方法有多个装饰器，方法装饰器需放在最下层
 */
export const Get = createRouterDecorator('get')
export const Post = createRouterDecorator('post')
export const Put = createRouterDecorator('put')
export const Delete = createRouterDecorator('delete')
export const All = createRouterDecorator('all')
