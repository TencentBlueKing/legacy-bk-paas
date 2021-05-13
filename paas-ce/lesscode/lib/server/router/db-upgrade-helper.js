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
    updateDialogDev,
    updateDialogDataProd,
    updateVariableManage,
    updateDirectives,
    updatePageLifeCycle,
    updatePagecode,
    setDefaultCompCategory,
    setProjectAndPageLayout,
    updateProjectLayoutRoutePath,
    updateDeledPageRel,
    delPageRouteDirtyRow,
    updateLayoutInstLayoutCode
} = require('../controller/db-upgrade-helper')

const router = new Router({
    prefix: '/api/db-upgrade-helper'
})

router.get('/20200903_pagecode', updatePagecode)
router.get('/20200907_set_compcategory', setDefaultCompCategory)
router.get('/20200924_set_project_and_page_layout', setProjectAndPageLayout)
router.get('/20200924_update_proj_layout_routepath', updateProjectLayoutRoutePath)
router.get('/20200925_pagecode_and_layoutid', updatePagecode)
router.get('/20200925_update_deled_page_rel', updateDeledPageRel)
router.get('/20200927_del_pageroute_dirty_row', delPageRouteDirtyRow)
router.get('/20200928_update_page_life_cycle', updatePageLifeCycle)
router.get('/20201021_update_layout_inst_code', updateLayoutInstLayoutCode)
router.get('/20210226_update_directives', updateDirectives)
router.get('/20210426_update_variable_manage', updateVariableManage)
router.get('/20210421_update_dialog_data_prod', updateDialogDataProd)
router.get('/20210421_update_dialog_data_dev', updateDialogDev)

module.exports = router
