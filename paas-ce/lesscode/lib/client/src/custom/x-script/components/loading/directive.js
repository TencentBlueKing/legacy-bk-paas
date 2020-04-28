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
import ViewModel from './loading.vue'

const Model = Vue.extend(ViewModel)

function show (el, options) {
    if (!el.$vm) {
        el.$vm = el.viewmodel.$mount()
        el.appendChild(el.$vm.$el)
    }

    Vue.nextTick(() => {
        el.$vm.isShow = true
    })
}

function toggle (el, options) {
    if (!el.$vm) {
        el.$vm = el.viewmodel.$mount()
        el.appendChild(el.$vm.$el)
    }

    clearTimeout(el.$vm.timer)

    if (options.isLoading) {
        Vue.nextTick(() => {
            el.$vm.isShow = true
        })
    } else {
        const delay = isNaN(options.delay) ? 0 : Number(options.delay)
        if (delay > 0) {
            el.$vm.timer = setTimeout(() => {
                el.$vm.isShow = false
            }, delay)
        } else {
            el.$vm.isShow = false
        }
    }

    if (options.title) {
        el.$vm.title = options.title
    }
}

const bkLoading = {
    inserted (el, binding) {
        const value = binding.value

        const position = getComputedStyle(el).position
        const options = {}

        if (!position || position !== 'relative' || position !== 'absolute') {
            el.style.position = 'relative'
        }

        for (const key in value) {
            if (key !== 'isLoading') {
                options[key] = value[key]
            }
        }

        options.type = 'directive'
        options.opacity = options.opacity || 0.9
        options.color = options.color || '#ffffff'

        el.viewmodel = new Model({
            data: options
        })

        // 在第一次渲染时，immediate为true立即显示
        if (options.immediate) {
            show(el, binding.value)
        } else {
            toggle(el, binding.value)
        }
    },
    update (el, binding) {
        toggle(el, binding.value)
    }
}

export default bkLoading
