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

// 权限相关
import { injectCSRFTokenToHeaders } from '@/api'
import pureAxios from '@/api/pureAxios.js'
import Img403 from '@/images/403.png'

function getUser () {
    return pureAxios.get('/user/userinfo').then(response => {
        const userData = response.data || {}
        userData.isAuthenticated = userData.code !== 'Unauthorized'
        return userData
    })
}

function checkProjectPermission (id) {
    return new Promise((resolve, reject) => {
        if ([undefined, ''].includes(id)) {
            reject(new Error('暂无项目ID，请在 Lesscode 上重新打开预览'))
        } else {
            return pureAxios.post('/project/verify', { id }).then((res) => {
                if (res.data) {
                    resolve()
                } else {
                    reject(new Error('项目ID不存在或者没有该项目权限，请在 Lesscode 上重新打开预览'))
                }
            }, reject)
        }
    })
}

function auth (projectId) {
    return Promise.all([getUser(), checkProjectPermission(projectId)]).then(([user]) => {
        injectCSRFTokenToHeaders()
        if (!user.isAuthenticated) {
            auth.redirectToLogin()
        }
    })
}

function errorHandle (err) {
    console.error(err)
    let message = ''
    switch (err.status) {
        case 403:
            message = 'Sorry，您的权限不足!'
            if (err.data && err.data.msg) {
                message = err.data.msg
            }
            break
        default:
            message = err.message || '无法连接到后端服务，请稍候再试。'
            break
    }

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
    auth,
    errorHandle
}
