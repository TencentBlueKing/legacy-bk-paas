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
    getUserBaseList,
    getUserProjectCountList,
    getUserPageCountList,
    getUserCountByTime,

    getProjectBaseList,
    getProjectPageCount,
    getProjectCountByTime,
    getProjectTotalCount,

    getProjectPageTotalCount,
    getPageTotalCount,

    getFuncBaseList,
    getFuncPageUsedCount,
    getFuncCountByTime,
    getFuncTotalCount,
    getFuncPageUsedTotalCount,

    getCompBaseList,
    getCompProjectUsedCount,
    getCompPageUsedCount,
    getCompVersionCount,
    getCompCountByTime,
    getCompTotalCount,
    getCompProjectUsedTotalCount
} = require('../controller/operation')

const router = new Router({
    prefix: '/api/operation'
})

router.post('/stats/user/base', getUserBaseList)
router.post('/stats/user/projectCount', getUserProjectCountList)
router.post('/stats/user/pageCount', getUserPageCountList)
router.post('/stats/user/timeline/base', getUserCountByTime)

router.post('/stats/project/base', getProjectBaseList)
router.post('/stats/project/pageCount', getProjectPageCount)
router.post('/stats/project/timeline/base', getProjectCountByTime)
router.post('/stats/project/projectTotal', getProjectTotalCount)
router.post('/stats/project/page/pageTotal', getProjectPageTotalCount)
router.post('/stats/page/pageTotal', getPageTotalCount)

router.post('/stats/func/base', getFuncBaseList)
router.post('/stats/func/pageUsedCount', getFuncPageUsedCount)
router.post('/stats/func/timeline/base', getFuncCountByTime)
router.post('/stats/func/funcTotal', getFuncTotalCount)
router.post('/stats/func/pageUsedTotal', getFuncPageUsedTotalCount)

router.post('/stats/comp/base', getCompBaseList)
router.post('/stats/comp/projectUsedCount', getCompProjectUsedCount)
router.post('/stats/comp/pageUsedCount', getCompPageUsedCount)
router.post('/stats/comp/versionCount', getCompVersionCount)
router.post('/stats/comp/timeline/base', getCompCountByTime)
router.post('/stats/comp/compTotal', getCompTotalCount)
router.post('/stats/comp/projectUsedTotal', getCompProjectUsedTotalCount)

module.exports = router
