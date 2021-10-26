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

import projectModel from '../model/project'
const Router = require('koa-router')

const {
    create,
    update,
    list,
    optionList
} = require('../controller/project-version')

const router = new Router({
    prefix: '/api/projectVersion'
})

router.use(['/create', '/update'], async (ctx, next) => {
    const id = ['POST', 'PUT', 'DELETE'].includes(ctx.request.method)
        ? (ctx.request.body.id || ctx.request.body.projectId)
        : (ctx.request.query.id || ctx.request.query.projectId)
    const project = await projectModel.findUserProjectById(ctx.session.userInfo.id, id)
    if (!project) {
        ctx.throw(403)
    }
    await next()
})

router.post('/create', create)
router.put('/update', update)
router.get('/list', list)
router.get('/optionList', optionList)

module.exports = router
