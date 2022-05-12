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
import { LCDataService, TABLE_FILE_NAME } from '../service/data-service'
import { enablePerviewDb } from '../service/preview-db-service'
import { createNCTable, updateNCTable } from '../service/no-code'
import { transformNCJson2LCJson } from '../../shared/no-code'
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    BodyParams,
    QueryParams,
    ProjectAuthorization,
    OutputJson
} from '../decorator'

@Controller('/api/nocode-form')
export default class NocodeFormController {
    @OutputJson()
    @Post('/create')
    async createForm (
        @BodyParams() formData
    ) {
        try {
            let resData = {}
            const { tableName, pageId, ...formItem } = formData
            const project = await LCDataService.findOne(TABLE_FILE_NAME.PROJECT, { id: formData.projectId, deleteFlag: 0 })
            // 如果项目未开启db，则先开启
            if (project && project.isEnableDataSource !== 1) {
                await enablePerviewDb(project.id, project.id + project.projectCode)
                project.isEnableDataSource = 1
                await LCDataService.update(TABLE_FILE_NAME.PROJECT, project)
            }

            await LCDataService.transaction(async (transactionalEntityManager) => {
                // nocodeJson 转换成lesscode数据源所需json
                const dbJson = transformNCJson2LCJson(formData.content || [])
                // 生成相应数据表
                const dbRes = await createNCTable({ tableName, projectId: formData.projectId, columns: dbJson })
                if (dbRes && dbRes.id) {
                    Object.assign(formItem, { content: JSON.stringify(formItem.content), dataSourceId: dbRes.id, versionId: null })
                    // 新增form表记录
                    resData = await transactionalEntityManager.add(TABLE_FILE_NAME.FORM, formItem)
                    // formId 回写到page表关联
                    await transactionalEntityManager.update(TABLE_FILE_NAME.PAGE, { id: pageId, formId: resData.id })
                }
            })
            return {
                ...resData
            }
        } catch (err) {
            throw new Error(err.message || err)
        }
    }

    @OutputJson()
    @Put('/update')
    async updateForm (
        @BodyParams() formData
    ) {
        try {
            const { id, tableName, projectId, content } = formData
            const dbJson = transformNCJson2LCJson(content || [])
            const form = await LCDataService.findOne(TABLE_FILE_NAME.FORM, { id, deleteFlag: 0 })
            await updateNCTable({ id: form.dataSourceId, tableName, projectId, columns: dbJson })
            const formItem = { id, content: JSON.stringify(content) }
            await LCDataService.update(TABLE_FILE_NAME.FORM, formItem)
            return {
                ...formItem
            }
        } catch (err) {
            throw new Error(err.message || err)
        }
    }

    @OutputJson()
    @Get('/detail')
    async formDetail (
        @QueryParams({ name: 'formId', require: true }) id
    ) {
        return LCDataService.findOne(TABLE_FILE_NAME.FORM, { id, deleteFlag: 0 })
    }
}
