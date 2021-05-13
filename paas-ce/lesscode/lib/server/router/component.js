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
    list,
    useing,
    detail,
    versionDetail,
    create,
    update,
    off,
    online,
    compDelete,
    upload,
    nameMap,
    categoryCount,
    updatePageComp,
    scope
} = require('../controller/component')

const router = new Router({
    prefix: '/api/component'
})

router.get('/list', list)
router.get('/useing', useing)
router.get('/detail', detail)
router.get('/version-detail', versionDetail)
router.post('/create', create)
router.post('/update', update)
router.post('/off', off)
router.post('/online', online)
router.delete('/delete', compDelete)
router.post('/upload', upload)
router.get('/name-map', nameMap)
router.get('/category-count', categoryCount)
router.put('/page-using-version', updatePageComp)
router.post('/scope', scope)

module.exports = router
