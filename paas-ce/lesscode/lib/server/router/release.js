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

const {
    checkConfig,
    applicationList,
    moduleList,
    releaseProject,
    getList,
    detailInfo,
    getSucVersionList,
    getProjectVersionOptionList,
    getRunningLog,
    detailFromV3,
    updateReleaseVersion,
    checkAppInfoExist,
    offlineProject,
    checkOfflineResult
} = require('../controller/release')
const Router = require('koa-router')

const router = new Router({
    prefix: '/api/release'
})

router.get('/checkConfig', checkConfig)
router.get('/applicationList', applicationList)
router.get('/moduleList', moduleList)
router.post('/releaseProject', releaseProject)
router.get('/getList', getList)
router.post('/detailInfo', detailInfo)
router.get('/getSucVersionList', getSucVersionList)
router.get('/getProjectVersionOptionList', getProjectVersionOptionList)
router.get('/getRunningLog', getRunningLog)
router.get('/detailFromV3', detailFromV3)
router.put('/updateReleaseVersion', updateReleaseVersion)
router.post('/checkAppInfoExist', checkAppInfoExist)
router.post('/offlineProject', offlineProject)
router.get('/offlineResult', checkOfflineResult)

module.exports = router
