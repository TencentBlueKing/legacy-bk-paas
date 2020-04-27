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

import Vue from 'vue'

const customComponents = {}
const customComponentsConfig = []

export const customComponentList = ['x-form', 'x-script', 'x-table']

customComponentList.forEach(name => {
    const ref = require('@/custom/' + name)
    const com = ref.default
    const componentName = ref.config.type
    customComponents[componentName] = com
    Vue.component(componentName, com)
    customComponentsConfig.push(Object.assign({}, ref.config, {
        group: '自定义组件',
        groupType: 'custom',
        order: 5
    }))
})

export const customComponentsConfigs = customComponentsConfig

export default customComponents
