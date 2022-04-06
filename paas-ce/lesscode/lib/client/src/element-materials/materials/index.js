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

import bkComponents, { bkComponentGroupList } from './bk'
import elementComponents, { elementComponentGroupList } from './element'
import vantComponents, { vantComponentGroupList } from './vant'

import { componentConfigs as complexComponentConfigs } from '@blueking/bkui-vue-complex'

complexComponentConfigs.forEach(item => {
    item.group = '复合组件'
    item.isComplexComponent = true
    item.icon = item.icon || 'bk-drag-custom-comp-default'
})
bkComponentGroupList.push('复合组件')

export default {
    bk: bkComponents.concat(...complexComponentConfigs),
    bkComponentGroupList,
    element: elementComponents,
    elementComponentGroupList,
    vant: vantComponents,
    vantComponentGroupList
}
