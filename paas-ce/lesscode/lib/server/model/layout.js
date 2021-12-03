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

import { getRepository } from 'typeorm'
import LayoutInst from './entities/layout-inst'
import Layout from './entities/layout'
import PageRoute from './entities/page-route'
import { whereVersion } from './common'

module.exports = {
    // 获取平台默认布局列表
    getDefaultList (projectId) {
        return getRepository(Layout).createQueryBuilder('layout')
            .andWhere('deleteFlag = 0')
            .orderBy('id', 'ASC')
            .getMany()
    },

    // 获取项目下可见的布局列表
    getList (projectId, versionId) {
        return getRepository(LayoutInst).createQueryBuilder('layout_inst')
            .leftJoinAndSelect(Layout, 'layout', 'layout_inst.layoutId = layout.id')
            .select(['layout_inst.*', 'layout.layoutType as layoutType', 'layout.type as type', 'layout.defaultName as defaultName', 'layout.defaultPath as defaultPath'])
            .where('layout_inst.projectId = :projectId', { projectId })
            .andWhere(whereVersion(versionId, 'layout_inst'))
            .andWhere('layout_inst.deleteFlag = 0')
            .orderBy('layout_inst.id', 'ASC')
            .getRawMany()
    },

    // 获取指定页面的layout信息
    getLayoutByPageId (pageId) {
        return getRepository(PageRoute).createQueryBuilder('r_page_route')
            .leftJoinAndSelect(LayoutInst, 'layout_inst', 'layout_inst.id = r_page_route.layoutId')
            .leftJoinAndSelect(Layout, 'layout', 'layout_inst.layoutId = layout.id')
            .select([
                'r_page_route.pageId as pageId',
                'r_page_route.layoutId as layoutId',
                'layout_inst.content as layoutContent',
                'layout_inst.showName as showName',
                'layout.type as layoutType',
                'layout.defaultName as defaultName'
            ])
            .where('r_page_route.pageId = :pageId', { pageId })
            .getRawOne()
    }
}
