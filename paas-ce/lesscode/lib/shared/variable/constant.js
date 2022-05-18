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

/**
 * 变量类型枚举
 */
export const VARIABLE_TYPE = {
    STRING: {
        NAME: 'String',
        VAL: 0
    },
    NUMBER: {
        NAME: 'Number',
        VAL: 1
    },
    BOOLEAN: {
        NAME: 'Boolean',
        VAL: 2
    },
    ARRAY: {
        NAME: 'Array',
        VAL: 3
    },
    OBJECT: {
        NAME: 'Object',
        VAL: 4
    },
    PIC_URL: {
        NAME: '图片地址',
        VAL: 5
    },
    COMPUTED: {
        NAME: '计算变量',
        VAL: 6
    }
}

/**
 * 变量影响范围
 */
export const VARIABLE_EFFECTIVE_RANGE = {
    // 项目级别
    PROJECT: 0,
    // 页面级别
    PAGE: 1
}

/**
 * 变量在不同环境，是否同一份配置
 */
export const VARIABLE_VALUE_TYPE = {
    SAME: 0,
    DIFFERENT: 1
}
