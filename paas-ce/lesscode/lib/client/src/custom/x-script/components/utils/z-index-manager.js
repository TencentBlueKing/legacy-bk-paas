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
let hasInitZIndex = false
let zIndex

(function () {
    if (!window['__bk_zIndex_manager']) {
        const zIndexManager = {
            nextZIndex: function (zIndex = 'default') {
                return zIndex === 'default' ? zIndexManager.zIndex++ : zIndex
            }
        }
        Object.defineProperty(zIndexManager, 'zIndex', {
            configurable: true,
            get () {
                if (!hasInitZIndex) {
                    zIndex = zIndex || (Vue.prototype.$BK_EL || {}).zIndex || 2000
                    hasInitZIndex = true
                }
                return zIndex
            },
            set (value) {
                zIndex = value
            }
        })
        window['__bk_zIndex_manager'] = zIndexManager
    }
})()

export default window['__bk_zIndex_manager']
