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

import {
    defineComponent,
    watch,
    reactive,
    toRef,
    ref
} from '@vue/composition-api'
import { VNode } from 'vue'
import fieldTable from '@/components/field-table/field-table'
import { uuid } from '@/common/util'
import { ORM_KEYS, BASE_COLUMNS } from 'shared/data-source/constant'

export interface IFieldSelectOption {
    id: string
    name: string
}

export interface ITableField {
    name: string
    type: string
    prop: string
    optionsList?: IFieldSelectOption[]
    width?: string
    isRequire?: boolean
    inputType?: string
    isEdit?: boolean,
    reg?: RegExp
}

export interface ITableStatus {
    data: object[]
}

function getDefaultRow () {
    return {
        type: 'varchar',
        name: '',
        primary: false,
        index: false,
        nullable: false,
        default: '',
        comment: '',
        defaultInputType: 'text',
        generated: false,
        createDate: false,
        updateDate: false,
        length: ''
    }
}

/**
 * orm 数据转为表格数据
 * @param item orm 数据
 * @returns 表格数据
 */
function normalizeTableItem (item) {
    const defaultRow = getDefaultRow()
    const normalizedItem = Object.assign({}, defaultRow, item)
    if (['int', 'datetime'].includes(normalizedItem.type)) {
        normalizedItem.defaultInputType = 'number'
        normalizedItem.default = 0
    } else {
        normalizedItem.defaultInputType = 'text'
        normalizedItem.default = ''
    }
    if (Reflect.has(BASE_COLUMNS, normalizedItem.name)) {
        normalizedItem.isEdit = true
    }
    if (!Reflect.has(normalizedItem, 'columnId')) {
        normalizedItem.columnId = uuid(8)
    }
    return normalizedItem
}

/**
 * 表格数据转为orm 数据
 * @param item 表格数据
 * @returns orm 数据
 */
function normalizeOrmItem (item) {
    return ORM_KEYS.reduce((acc, cur) => {
        if (Reflect.has(item, cur)) {
            acc[cur] = item[cur]
        }
        return acc
    }, {})
}

export default defineComponent({
    components: {
        fieldTable
    },

    props: {
        data: Array
    },

    setup (props: ITableStatus, { emit }) {
        const tableFields: ITableField[] = [
            {
                name: '字段名称',
                type: 'input',
                prop: 'name',
                isRequire: true,
                reg: /^[a-zA-Z][a-zA-Z-_]*[a-zA-Z]$/
            },
            {
                name: '字段类型',
                type: 'select',
                prop: 'type',
                optionsList: [
                    {
                        id: 'varchar',
                        name: 'varchar'
                    },
                    {
                        id: 'int',
                        name: 'int'
                    },
                    {
                        id: 'datetime',
                        name: 'datetime'
                    }
                ]
            },
            {
                name: '索引',
                type: 'checkbox',
                prop: 'index',
                width: '100px'
            },
            {
                name: '可空',
                type: 'checkbox',
                prop: 'nullable',
                width: '100px'
            },
            {
                name: '默认值',
                type: 'input',
                prop: 'default'
            },
            {
                name: '备注',
                type: 'input',
                prop: 'comment'
            }
        ]
        const tableList = reactive([])
        const tableRef = ref(null)

        watch(
            toRef(props, 'data'),
            (val) => {
                tableList.splice(
                    0,
                    tableList.length,
                    ...val.map(normalizeTableItem)
                )
            },
            {
                immediate: true
            }
        )

        const addField = (row, index) => {
            const defaultRow = getDefaultRow()
            tableList.splice(index + 1, 0, defaultRow)
            emit('change')
        }

        const deleteField = (row, index) => {
            tableList.splice(index, 1)
            emit('change')
        }

        const changeData = (value, row, column, index) => {
            // 设置值
            const currentRow = tableList[index]
            const normalizedItem = normalizeTableItem(currentRow)
            Object.assign(currentRow, normalizedItem, { [column.prop]: value })

            // 触发 change 事件
            emit('change')
        }

        const validate = () => {
            return new Promise((resolve, reject) => {
                const isValidate = tableRef.value.verification()
                if (isValidate) {
                    resolve(tableList.map(normalizeOrmItem))
                } else {
                    reject(new Error('字段配置校验不通过'))
                }
            })
        }

        return {
            tableList,
            tableFields,
            tableRef,
            addField,
            deleteField,
            changeData,
            validate
        }
    },

    render (): VNode {
        return (
            <field-table
                ref="tableRef"
                data={this.tableList}
                column={this.tableFields}
                onAdd={this.addField}
                onDelete={this.deleteField}
                onChange={this.changeData}
            ></field-table>
        )
    }
})
