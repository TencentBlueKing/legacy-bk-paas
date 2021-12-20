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

import * as updateApi from './update.js'

/**
 * 在线编译入口
 * @param source 文件原内容
 * @param id 资源唯一id
 * @param plugins 插件列表
 * @param payload 自定义数据
 * @returns 返回插件转换后的内容
 */
export const bundless = ({ source, id, plugins, payload }) => {
    const ctx = { source, id, payload, updateApi }
    plugins.forEach((plugin) => {
        plugin(ctx)
    })
    return ctx.result
}

/**
 * 抛出主动触发热更新的方法
 */
export const triggleUpdate = updateApi.triggleUpdate
