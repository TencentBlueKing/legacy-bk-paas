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

import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'release_version', comment: '部署版本表' })
export default class extends Base {
    @Column({ type: 'int', comment: '所属项目' })
    projectId

    @Column({ type: 'varchar', comment: '发布环境：prod/stag' })
    env

    @Column({ type: 'varchar', comment: '发布类型：NEW_VERSION/HISTORY_VERSION' })
    releaseType

    @Column({ type: 'varchar', comment: '版本号' })
    version

    @Column({ type: 'varchar', comment: '项目代码存放路径' })
    codeUrl

    @Column({ type: 'varchar', comment: '当前状态' })
    status

    @Column({ type: 'varchar', comment: '当前运行步骤' })
    currentStep

    @Column({ type: 'varchar', comment: 'v3部署对应id' })
    deployId

    @Column({ type: 'tinytext', comment: '报错信息' })
    errorMsg

    @Column({ type: 'varchar', comment: '访问url' })
    accessUrl

    @Column({ type: 'varchar', comment: '本次部署对应应用和模块' })
    bindInfo

    @Column({ type: 'varchar', comment: '本次部署对应应用' })
    appCode

    @Column({ type: 'varchar', comment: '本次部署对应模块' })
    moduleCode

    @Column({ type: 'int', comment: '操作类型：下架或部署' })
    isOffline

    @Column({ type: 'tinytext', comment: '同步paas平台部署信息' })
    fromPaasInfo
}
