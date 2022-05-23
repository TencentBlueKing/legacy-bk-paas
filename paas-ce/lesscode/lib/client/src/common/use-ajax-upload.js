
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

function getRes (xhr) {
    const res = xhr.responseText || xhr.response
    if (!res) {
        return res
    }

    try {
        return JSON.parse(res)
    } catch {
        return res
    }
}

export default (option) => {
    if (typeof XMLHttpRequest === 'undefined') {
        throw new Error('XMLHttpRequest is undefined')
    }

    const xhr = new XMLHttpRequest()
    const { action } = option

    if (xhr.upload) {
        xhr.upload.addEventListener('progress', (event) => {
            const progressEvent = event
            progressEvent.percent = event.total > 0 ? (event.loaded / event.total) * 100 : 0
            option.onProgress(progressEvent)
        })
    }

    const formData = new FormData()
    if (option.data) {
        let appendData = option.data
        if (!Array.isArray(appendData)) {
            appendData = [appendData]
        }
        appendData.forEach((data) => {
            for (const [key, value] of Object.entries(data)) {
                if (Array.isArray(value)) formData.append(key, ...value)
                else formData.append(key, value)
            }
        })
    }
    formData.append(option.filename, option.file, option.file.name)

    xhr.addEventListener('error', () => {
        option.onError(new Error('An error occurred during upload'))
    })

    xhr.addEventListener('load', () => {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(new Error('An error occurred during upload'))
        }
        option.onSuccess(getRes(xhr))
    })

    xhr.addEventListener('loadend', () => {
        option?.onComplete?.()
    })

    xhr.open(option.method, action, true)

    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
    }

    const headers = option.headers || {}
    if (headers instanceof Headers) {
        headers.forEach((value, key) => xhr.setRequestHeader(key, value))
    } else {
        for (const [key, value] of Object.entries(headers)) {
            // isNil
            if (value == null) continue
            xhr.setRequestHeader(key, String(value))
        }
    }

    xhr.send(formData)
    return xhr
}
