/**
 * @file loading directive
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
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
