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

/**
 * 所有model的增删改查操作服务
 * 部分业务需要进一步处理的，可以在model里面新增文件处理，也可以在这个基础上做数据处理
 * 请勿在此处添加特定业务
 */
import { getRepository, In } from 'typeorm'
const fs = require('fs')
const path = require('path')

// get all entity
const entityMap = {}
const files = fs.readdirSync(path.resolve(__dirname, '../model/entities')).filter(name => name !== 'base.js')
files.forEach((name) => {
    const entityName = name.replace(/\..+/, '')
    import(`../model/entities/${entityName}`).then(({ default: module }) => {
        entityMap[entityName] = module
    })
})

/**
 * 获取 DB ORM 的快捷操作
 * @param {*} name orm 连接名，默认值 default，既使用lesscode的db连接
 * @param {*} customEntityMap orm entity map，用于快速查找entity，不传就使用lesscode的entity
 * @returns dataService
 */
export function getDataService (name = 'default', customEntityMap) {
    function getRepositoryByName (tableName) {
        const sourceMap = customEntityMap || entityMap
        const entity = sourceMap[tableName]
        return getRepository(entity, name)
    }

    return {
        get (tableName, query = {}) {
            const repository = getRepositoryByName(tableName)
            return repository.find({ deleteFlag: 0, ...query }) || []
        },
    
        findOne (tableName, query = {}) {
            const repository = getRepositoryByName(tableName)
            return repository.findOne({ deleteFlag: 0, ...query }) || {}
        },
    
        add (tableName, data) {
            const repository = getRepositoryByName(tableName)
            const newData = repository.create(data)
            return repository.save(newData)
        },
    
        bulkAdd (tableName, dataList) {
            const repository = getRepositoryByName(tableName)
            const newDataList = repository.create(dataList)
            return repository.save(newDataList)
        },
    
        async update (tableName, data) {
            const repository = getRepositoryByName(tableName)
            const editData = await repository.findOne({ where: { id: data.id } })
            Object.assign(editData, data)
            return repository.save(editData)
        },
    
        async bulkUpdate (tableName, dataList) {
            const repository = getRepositoryByName(tableName)
            const editDataList = await repository.findOne({ where: { id: In(dataList.map(data => data.id)) } })
            editDataList.forEach((editData) => {
                const newData = dataList.find(data => data.id === editData.id)
                Object.assign(editData, newData)
            })
            return repository.save(editDataList)
        },
    
        async delete (tableName, id) {
            const repository = getRepositoryByName(tableName)
            const deleteData = await repository.findOne({ where: { id } })
            deleteData.deleteFlag = 1
            return repository.save(deleteData)
        },
    
        async bulkDelete (tableName, ids) {
            const repository = getRepositoryByName(tableName)
            const deleteDataList = await repository.findOne({ where: { id: In(ids) } })
            deleteDataList.forEach(deleteData => deleteData.deleteFlag = 1)
            return repository.save(deleteDataList)
        }
    }
}

// 默认导出lesscode的orm快捷操作
export default getDataService()
