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

// 自定义组件功能需自行搭建npm源，若不需要用到自定义组件功能，则忽略此文件
module.exports = process.env.NODE_ENV === 'production'
    // 线上环境配置（npm run build时使用）
    ? {
        // 镜像源地址
        registry: '',
        // 镜像源scopename，如@bk-lesscode
        scopename: '',
        username: '',
        password: '',
        email: ''
    }
    // 本地调试配置（npm run dev时使用）
    : {
        // 镜像源地址
        registry: '',
        // 镜像源scopename，如@bk-lesscode
        scopename: '',
        username: '',
        password: '',
        email: ''
    }
