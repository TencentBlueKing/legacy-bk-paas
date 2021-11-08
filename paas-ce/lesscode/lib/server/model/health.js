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
import LayoutModel from './layout'
import { uploadFile } from '../utils/file-service'

const health = {
    async checkBkRepo () {
        return new Promise(async (resolve, reject) => {
            try {
                const uid = Math.random() * 100000
                const filePath = './package.json'
                const uploadKey = `/check-health/${uid}/`
                const res = await uploadFile(filePath, uploadKey)
                console.log(res)
                resolve({
                    code: 200,
                    result: 'bkRepo服务调用正常',
                    message: ''
                })
            } catch (err) {
                resolve({
                    code: 500,
                    result: 'bkRepo服务调用异常',
                    message: err.message || err
                })
            }
        })
    },

    async checkDb () {
        return new Promise(async (resolve, reject) => {
            try {
                await LayoutModel.getDefaultList()
                resolve({
                    code: 200,
                    result: 'db调用正常',
                    message: ''
                })
            } catch (err) {
                resolve({
                    code: 500,
                    result: 'db调用异常',
                    message: err.message || err
                })
            }
        })
    }
}

module.exports = health
