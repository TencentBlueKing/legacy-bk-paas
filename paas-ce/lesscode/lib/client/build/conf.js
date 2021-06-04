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

const NODE_ENV = process.env.NODE_ENV
const APP_CODE = process.env.APP_CODE
const ENV = process.env.ENV || 'prev'

module.exports = {
    build: {
        env: {
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV),
                'V3_ENV': JSON.stringify(process.env.BKPAAS_ENVIRONMENT || 'prod')
            },
            NODE_ENV: JSON.stringify(NODE_ENV),
            APP_CODE: JSON.stringify(APP_CODE),
            AJAX_URL_PREFIX: JSON.stringify('/api'),
            ENV: JSON.stringify(ENV)

        },
        assetsPublicPath: '{{STATIC_URL}}',
        staticUrl: '/static',
        BKPAAS_ENVIRONMENT: 'stag'
    },
    dev: {
        env: {
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV),
                'V3_ENV': JSON.stringify('dev')
            },
            NODE_ENV: JSON.stringify(NODE_ENV),
            APP_CODE: JSON.stringify(APP_CODE),
            AJAX_URL_PREFIX: JSON.stringify('/api'),
            ENV: JSON.stringify(ENV)

        },
        assetsPublicPath: '/',
        staticUrl: '/static',
        BKPAAS_ENVIRONMENT: 'stag'
    }
}
