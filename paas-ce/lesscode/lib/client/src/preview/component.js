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

// 注入组件库
import '@/common/bkui-vue-complex'
import '@/common/fully-import'
import '@/common/element'

// 注入全局组件
import renderHtml from '@/components/render/html'

module.exports = (Vue, projectId, versionId) => {
    return new Promise((resolve, reject) => {
        // 注入自定义组件
        window.previewCustomCompontensPlugin = []
        window.registerPreview = function (callback) {
            window.previewCustomCompontensPlugin.push(callback)
        }
        const script = document.createElement('script')
        script.src = `/${parseInt(projectId)}/component/preview-register.js?v=${versionId || ''}`
        script.onload = () => {
            window.previewCustomCompontensPlugin.forEach(callback => {
                const [config, source] = callback(Vue)
                Vue.component(config.type, source)
            })
            resolve()
        }
        script.onerror = (err) => {
            reject(err.message || err || '获取自定义组件失败')
        }
        document.body.appendChild(script)

        // 注入全局组件
        Vue.component('renderHtml', renderHtml)
    })
}
