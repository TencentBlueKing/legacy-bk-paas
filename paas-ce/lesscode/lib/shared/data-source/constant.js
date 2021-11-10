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
 * 数据源，公共 orm columns
 */
export const BASE_COLUMNS = [
    {
        name: 'id',
        type: 'int',
        primary: true,
        generated: true,
        index: true,
        nullable: false,
        comment: '自增唯一主键。系统保留字段，不可修改'
    },
    {
        name: 'createTime',
        type: 'datetime',
        createDate: true,
        nullable: true,
        comment: '系统会默认写入数据创建时间。系统保留字段，不推荐修改'
    },
    {
        name: 'createUser',
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '系统会默认写入数据创建人。系统保留字段，不推荐修改'
    },
    {
        name: 'updateTime',
        type: 'datetime',
        updateDate: true,
        nullable: true,
        comment: '系统会默认写入数据更新时间。系统保留字段，不推荐修改'
    },
    {
        name: 'updateUser',
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '系统会默认写入数据更新人。系统保留字段，不推荐修改'
    }
]

/**
 * 数据源使用的 ORM KEYS
 */
export const ORM_KEYS = [
    'name',
    'type',
    'primary',
    'index',
    'nullable',
    'default',
    'comment',
    'createDate',
    'updateDate',
    'length',
    'columnId',
    'generated',
    'scale'
]

/**
 * 数据的修改类型
 */
export const DATA_MODIFY_TYPE = {
    INSERT: 'insert',
    UPDATE: 'update',
    DELETE: 'delete'
}

/**
 * 索引的修改类型
 */
export const INDEX_MODIFY_TYPE = {
    DROP: 'DROP',
    ADD: 'ADD'
}

/**
 * 字段的修改类型
 */
export const FIELD_MODIFY_TYPE = {
    CHANGE_COLUMN: (name) => `CHANGE COLUMN ${name}`,
    MODIFY_COLUMN: 'MODIFY COLUMN',
    ADD_COLUMN: 'ADD COLUMN',
    DROP_COLUMN: 'DROP COLUMN'
}

/**
 * 表的修改类型
 */
export const TABLE_MODIFY_TYPE = {
    CREATE: 'create',
    MODIFY: 'modify',
    DROP: 'drop',
    RENAME: 'rename',
    COMMENT: 'comment'
}

/**
 * 部署使用的 migration 表名
 */
export const MIGRATION_TABLE_NAME = 'lesscode_migrations_data'
