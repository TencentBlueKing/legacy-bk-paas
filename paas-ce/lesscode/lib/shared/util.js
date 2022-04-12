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
 * 生成 uuid
 *
 * @param {Number} len 长度
 * @param {Number} radix 基数
 *
 * @return {string} uuid
 */
export function uuid (len = 8, radix = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        let i
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        }
    } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        let i
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}

/**
 * 防抖，延迟一段时间执行
 * @param {*} fn 需要执行的函数
 * @param {*} delay 延迟时间，默认200
 * @returns
 */
export function debounce (fn, delay = 200) {
    let timer = null
    return function (params) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => fn(params), delay)
    }
}

/**
 * 节流，每隔一段时间执行
 * @param {*} fn 需要执行的函数
 * @param {*} delay 延迟时间，默认200
 * @returns
 */
export function throttle (fn, delay = 200) {
    let valid = true
    return function (params) {
        if (!valid) {
            return false
        }
        valid = false
        setTimeout(() => {
            fn(params)
            valid = true
        }, delay)
    }
}

/**
 * 单位过滤，如果是rpx转为rem，否则直接输出
 * 此处将屏幕分为20份， 即20rem = 750rpx = 100%屏幕宽度
 * @param {String} value 需要过滤的值
 * @returns
 */
export function unitFilter (value) {
    if (/\d+rpx$/.test(value)) {
        const sizeNumber = (/(\d+)rpx$/.exec(value)[1] / 750 * 20).toFixed(2)
        const result = sizeNumber + 'rem'
        return result
    }
    return value
}
