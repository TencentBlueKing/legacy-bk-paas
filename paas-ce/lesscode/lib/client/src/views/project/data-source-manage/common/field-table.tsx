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

import { defineComponent, toRef } from '@vue/composition-api'
import { VNode } from 'vue'
import fieldTable from '@/components/field-table/field-table'

export interface IFieldSelectOption {
    id: string,
    name: string
}

export interface ITableField {
    name: string,
    type: string,
    prop: string,
    optionsList?: IFieldSelectOption[]
}

export interface ITableStatus {
    data: object[]
}

const tableFields: ITableField[] = [
    {
        name: '字段名称',
        type: 'input',
        prop: 'name'
    },
    {
        name: '字段类型',
        type: 'select',
        prop: 'type',
        optionsList: [{
            id: 'varchar',
            name: 'varchar'
        }, {
            id: 'int',
            name: 'int'
        }, {
            id: 'datetime',
            name: 'datetime'
        }]
    },
    {
        name: '主键',
        type: 'checkbox',
        prop: 'primary'
    },
    {
        name: '索引',
        type: 'checkbox',
        prop: 'index'
    },
    {
        name: '可空',
        type: 'checkbox',
        prop: 'nullable'
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

export default defineComponent({
    components: {
        fieldTable
    },

    props: {
        data: Array,
        isEdit: {
            type: Boolean,
            default: true
        }
    },

    setup (props: ITableStatus) {
        const tableList = toRef(props, 'data')

        const addField = (row, index) => {
            tableList.value.splice(index + 1, 0, {})
            console.log(tableList.value)
        }

        const deleteField = (row, index) => {
            tableList.value.splice(index, 1)
            console.log(tableList.value)
        }

        return {
            tableList,
            tableFields,
            addField,
            deleteField
        }
    },

    render (): VNode {
        return (
            <field-table
                data={this.tableList}
                column={this.tableFields}
                onAdd={this.addField}
                onDelete={this.deleteField}
            >
            </field-table>
        )
    }
})
