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

import Img403 from '@/images/403.png'

function errorHandle (err = {}) {
    const response = err.response || {}
    const data = response.data || {}
    const message = data.message || err.message || '无法连接到后端服务，请稍候再试。'

    const divStyle = `
        text-align: center;
        width: 400px;
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `
    const h2Style = 'font-size: 20px;color: #979797; margin: 32px 0;font-weight: normal'
    const content = ''
        + `<div class="bk-exception bk-exception-center" style="${divStyle}">`
        + `<img src="${Img403}"><h2 class="exception-text" style="${h2Style}">${message}</h2>`
        + '</div>'
    const parentNode = document.querySelector('#preview-app')
    parentNode.innerHTML = content
}

module.exports = {
    errorHandle
}
