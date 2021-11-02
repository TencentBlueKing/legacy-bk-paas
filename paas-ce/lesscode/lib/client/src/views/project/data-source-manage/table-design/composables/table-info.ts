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
import {
    reactive,
    ref
} from '@vue/composition-api'

export interface IBasicInfo {
    tableName: string,
    engine: string,
    character: string,
    comment: string
}

export interface ITableField {
    name?: string,
    type: string,
    generated?: boolean,
    length?: number,
    createDate?: boolean,
    updateDate?: boolean,
    default?: string | number,
    comment?: string
}
export interface ITableStatus {
    basicInfo: IBasicInfo,
    data: ITableField[]
}

/**
 * 获取默认的 table 数据
 * @param status 传入初始化数据
 * @returns 返回表状态数据
 */
export function useTableStatus (status = {}) {
    const finalStatus = Object.assign({
        basicInfo: {
            tableName: '',
            engine: 'InnoDB',
            character: 'utf8mb4',
            comment: ''
        },
        data: []
    }, status)
    return {
        tableStatus: reactive<ITableStatus>(finalStatus),
        sql: ref(''),
        isLoading: ref(false),
        isSaving: ref(false),
        hasEdit: ref(false),
        showConfirmDialog: ref(false),
        basicFormRef: ref(null),
        fieldTableRef: ref(null)
    }
}
