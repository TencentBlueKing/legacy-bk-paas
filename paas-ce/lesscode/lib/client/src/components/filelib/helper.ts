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

export enum UPLOAD_STATUS {
    READY = 'ready',
    UPLOADING = 'uploading',
    SUCCESS = 'success',
    FAIL = 'fail',
}

export enum DISPLAY_TYPES {
    CARD = 'card',
    LIST = 'list'
}

export type UploadStatus = Lowercase<keyof typeof UPLOAD_STATUS>

export interface UploadRawFile extends File {
    uid: number
}
export interface UploadFile {
    id?: number
    name: string
    percentage?: number
    status: UploadStatus
    size?: number
    response?: { code: number, data: Record<string, unknown>, message: string }
    uid: number
    url?: string
    raw?: UploadRawFile
}

export function formatSize (value: number) {
    const uints = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const index = Math.floor(Math.log(value) / Math.log(1024))
    const size = value / (1024 ** index)
    return `${size.toFixed(2)} ${uints[index]}`
}

export function getFileUrl (file: UploadFile, isServer = false) {
    if (isServer) {
        return file?.response?.data?.url || file.url
    }
    return file.url
}
