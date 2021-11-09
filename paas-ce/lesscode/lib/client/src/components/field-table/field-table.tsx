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

import { defineComponent, reactive } from '@vue/composition-api'
import { VNode } from 'vue'

import './field-table.css'

interface ISelectOption {
    id: string
    name: string
}
interface IColumnItem {
    name: string
    type: string
    prop: string
    optionsList?: ISelectOption[]
    width?: string
    isRequire?: boolean
    inputType?: string
    isEdit?: boolean
    reg?: RegExp
    placeholder?: string
    tips?: string
}
export default defineComponent({
    name: 'FieldTable',
    components: {},
    props: {
        data: Array,
        column: Array,
        isShowCheck: Boolean
    },
    setup (props, { emit }) {
        const tableList = reactive([])
        const renderHeader = (h, { column, $index }, item) => {
            return (
                <span>
                    {column.label}
                    {item.isRequire ? <label class="asterisk">*</label> : ''}
                </span>
            )
        }
        /** checkbox */
        const renderCheckbox = (item: IColumnItem) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
            }
            return {
                default: (props) => {
                    const { row, $index } = props
                    const defaultSlot = (
                        <bk-checkbox
                            value={row[item.prop]}
                            disabled={row?.isEdit}
                            onchange={(value) =>
                                change(value, row, item, $index)
                            }
                        />
                    )
                    return defaultSlot
                }
            }
        }
        /** input */
        const renderInput = (item: IColumnItem) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
                verification()
            }
            return {
                default: (props) => {
                    const { row, $index } = props
                    const defaultSlot = (
                        <div>
                            <bk-input
                                key={item.prop}
                                placeholder={item.placeholder || '请输入'}
                                class={`field-table-input ${item.isRequire && row.isErr ? 'error' : ''}`}
                                value={row[item.prop]}
                                type={row[`${item.prop}InputType`] || 'text'}
                                disabled={row?.isEdit}
                                onchange={(value) =>
                                    change(value, row, item, $index)
                                }
                            />
                            {
                                (item.isRequire && row.isErr) || row.isReg
                                    ? <i v-bk-tooltips={item.tips} class={['bk-icon icon-exclamation-circle row-icons']} />
                                    : ''
                            }
                        </div>
                    )
                    return defaultSlot
                }
            }
        }
        /** select */
        const renderSelect = (item: IColumnItem) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
                verification()
            }
            return {
                default: (props) => {
                    const options = item.optionsList.map((option) => (
                        <bk-option
                            key={option.id}
                            id={option.id}
                            name={option.name}
                        />
                    ))
                    const { row, $index } = props
                    const defaultSlot = (
                        <bk-select
                            class={`field-table-select ${item.isRequire && row.isErr ? 'error' : ''}`}
                            clearable={false}
                            value={row[item.prop]}
                            disabled={row?.isEdit}
                            onchange={(value) =>
                                change(value, row, item, $index)
                            }
                        >
                            {item?.optionsList ? options : ''}
                        </bk-select>
                    )
                    return defaultSlot
                }
            }
        }
        /** 操作列 */
        const renderOperate = () => {
            const handleAdd = (props) => {
                const { row, $index } = props
                emit('add', row, $index)
            }
            const handleDelete = (props) => {
                const { row, $index } = props
                if (row.isEdit) {
                    return
                }
                emit('delete', row, $index)
            }
            const scopedSlots = {
                default: (props) => {
                    const { row } = props
                    const defaultSlot = (
                        <span>
                            <i
                                class={'bk-icon icon-plus-circle-shape field-icon'}
                                onClick={() => {
                                    handleAdd(props)
                                }}
                            />
                            <i
                                class={`bk-icon icon-minus-circle-shape field-icon ${
                                    row?.isEdit ? 'icon-disabled' : ''
                                }`}
                                onClick={() => {
                                    handleDelete(props)
                                }}
                            />
                        </span>
                    )
                    return defaultSlot
                }
            }
            return (
                <bk-table-column
                    label="操作"
                    width="100"
                    {...{ scopedSlots }}
                />
            )
        }
        /** 自定义 */
        const renderCustomize = (item: IColumnItem) => {
            return {
                default: (props) => item.renderFn.apply(this, [props])
            }
        }
        const verification = () => {
            const list = props.column.filter(item => !!item.isRequire)
            const listReg = props.column.filter(item => !!item.reg)
            props.data.map(item => Object.assign(item, {
                isErr: handleIsRequire(list, item),
                isReg: handleIsReg(listReg, item)
            }))
            return props.data.findIndex(item => item.isErr || item.isReg) === -1
        }
        /** 校验是否必填 */
        const handleIsRequire = (list, item) => {
            const length = list.length
            if (length === 1) {
                return !item[list[0].prop]
            } else {
                let status = false
                for (let i = 0; i < length - 1; i++) {
                    status = !item[list[i].prop] || !item[list[i + 1].prop]
                }
                return status
            }
        }
        const handleIsReg = (list, item) => {
            const length = list.length
            if (length === 1) {
                return !list[0].reg.test(item[list[0].prop])
            } else {
                let status = false
                for (let i = 0; i < length - 1; i++) {
                    status = !list[i].reg.test(item[list[i].prop]) || !list[i].reg.test(item[list[i + 1].prop])
                }
                return status
            }
        }
        return {
            renderCheckbox,
            renderInput,
            renderSelect,
            renderCustomize,
            renderOperate,
            renderHeader,
            verification,
            tableList
        }
    },
    render (): VNode {
        const typeList = {
            custom: 'renderCustomize',
            input: 'renderInput',
            select: 'renderSelect',
            checkbox: 'renderCheckbox'
        }
        const renderSelection = <bk-table-column type="selection" width={40} />
        const dynamicProps = {
            class: 'g-hairless-table',
            props: {
                data: this.data,
                outerBorder: false,
                headerBorder: false,
                headerCellStyle: {
                    background: '#f0f1f5'
                }
            }
        }
        return (
            <div class="field-table">
                <bk-table { ...dynamicProps }>
                    {this.isShowCheck ? renderSelection : ''}
                    {this.column.map((item: IColumnItem) => (
                        <bk-table-column
                            isRequire={item.isRequire}
                            label={item.name}
                            width={item.width || 'auto'}
                            renderHeader={(h, { column, $index }) =>
                                this.renderHeader(h, { column, $index }, item)
                            }
                            {...{
                                scopedSlots: this[typeList[item.type]](item)
                            }}
                        />
                    ))}
                    {this.renderOperate()}
                </bk-table>
            </div>
        )
    }
})
