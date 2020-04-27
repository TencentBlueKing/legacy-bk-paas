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
import { isVNode } from '../utils/dom'
import LoadingView from './loading.vue'

const LoadingConstructor = Vue.extend(LoadingView)

let instance

const Loading = function (options = {}) {
    if (typeof options === 'string') {
        options = {
            title: options
        }
    }

    options.opacity = options.opacity || 0.9
    options.color = options.color || '#ffffff'
    instance = new LoadingConstructor({
        data: options
    })

    if (isVNode(instance.title)) {
        instance.$slots.default = [instance.title]
        instance.title = null
    } else {
        delete instance.$slots.default
    }

    instance.viewmodel = instance.$mount()
    document.body.appendChild(instance.viewmodel.$el)
    instance.$dom = instance.viewmodel.$el
    instance.viewmodel.isShow = true

    return instance.viewmodel
}

Loading.hide = function () {
    instance.viewmodel.hide = true
}

Vue.prototype.$bkLoading = Loading

export default Loading
