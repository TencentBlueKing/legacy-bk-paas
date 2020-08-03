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

import UserModel from '../model/user'
// import User from '../model/entities/user'
// import { getRepository } from 'typeorm'

export const findUserByBk = async bkUsername => {
    const ret = await UserModel.findOneByBk(bkUsername)
    return ret
}

export const addUser = async userData => {
    const { id } = await UserModel.addUser(userData)
    return id
}

// export const getUserByBk = async ctx => {
//     try {
//         const query = ctx.request.query || {}
//         const bkUsername = query.bk_username
//         const res = await findUserByBk(bkUsername)
//         ctx.send({
//             code: 0,
//             message: 'success',
//             data: res
//         })
//     } catch (err) {
//         console.error(err)
//         ctx.throwError({
//             message: err.message
//         })
//     }
// }

// export const getUserByBk = async (ctx) => {
//     try {
//         const { projectId, pageData } = ctx.request.body
//         const projectPageData = {
//             projectId
//         }
//         const { id } = await PageModel.createPage(pageData, projectPageData)
//         ctx.send({
//             code: 0,
//             message: 'success',
//             data: id
//         })
//     } catch (err) {
//         ctx.throwError({
//             message: err.message
//         })
//     }
// }

export const getUserInfo = ctx => {
    try {
        ctx.send({
            code: 0,
            message: 'success',
            data: ctx.session.userInfo
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}
