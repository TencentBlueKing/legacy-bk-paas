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

const Router = require('koa-router')
const {
    getPlatformList,
    getList,
    getFullList,
    checkName,
    create,
    update,
    deleteLayout,
    setDefault,
    getPageLayout
} = require('../controller/layout')

const router = new Router({
    prefix: '/api/layout'
})

router.get('/getList', getList)
router.get('/getFullList', getFullList)
router.get('/getPlatformList', getPlatformList)
router.get('/page', getPageLayout)
router.post('/create', create)
router.post('/checkName', checkName)
router.post('/update', update)
router.delete('/delete', deleteLayout)
router.post('/default', setDefault)

module.exports = router
