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

module.exports = () => {
    return async (ctx, next) => {
        // 允许来自所有域名请求
        ctx.set('Access-Control-Allow-Origin', '*')
        // 这样就能只允许 http://localhost:8080 这个域名的请求了
        // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");

        // 设置所允许的HTTP请求方法
        ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')

        // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
        ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type')

        // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

        // Content-Type表示具体请求中的媒体类型信息
        ctx.set('Content-Type', 'application/json;charset=utf-8')

        // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
        // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
        ctx.set('Access-Control-Allow-Credentials', true)

        // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
        // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
        // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
        ctx.set('Access-Control-Max-Age', 300)

        await next()
    }
}
