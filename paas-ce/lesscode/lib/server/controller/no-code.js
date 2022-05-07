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
    Controller,
    OutputJson,
    All,
    BodyParams,
    QueryParams,
    Ctx
} from '../decorator'
import http from '../utils/http/index'
import { apiPerfix } from '../conf/no-code'

@Controller('/api/nocode')
export default class NoCodeController {
    @OutputJson()
    @All('/*')
    async proxyApi (
        @Ctx({ name: 'method' }) method,
        @Ctx({ name: 'captures' }) captures,
        @BodyParams() body,
        @QueryParams() query
    ) {
        const methodsWithoutData = ['delete', 'get', 'head', 'options']
        const httpMethod = method.toLowerCase()
        const httpUrl = apiPerfix + captures[0]
        const httpParams = [httpUrl]
        if (methodsWithoutData.includes(httpMethod)) {
            httpParams.push({ params: query })
        } else {
            httpParams.push(body)
        }
        console.log(httpParams)
        const { result, data, message } = await http[httpMethod](...httpParams)
        if (result) {
            return data
        } else {
            throw new global.BusinessError(message, -1)
        }
    }
}
