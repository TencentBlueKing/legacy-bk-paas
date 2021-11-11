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
    renderFn?: Function
    isErr?: boolean
    isReg?: boolean
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
                        <div title={row[item.prop]}>
                            <bk-input
                                key={item.prop}
                                placeholder={item.placeholder || '请输入'}
                                class={`field-table-input ${errHandle(row, item.prop) ? 'error' : ''}`}
                                value={row[item.prop]}
                                type={row[`${item.prop}InputType`] || 'text'}
                                disabled={row?.isEdit}
                                onchange={(value) =>
                                    change(value, row, item, $index)
                                }
                            />
                            {
                                errHandle(row, item.prop)
                                    ? <i v-bk-tooltips={item.tips} class={['bk-icon icon-exclamation-circle-shape row-icons']} />
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
                            class={`field-table-select ${errHandle(row, item.prop) ? 'error' : ''}`}
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
            const list = props.column.filter(item => !!(item as any).isRequire)
            const listReg = props.column.filter(item => !!(item as any).reg)
            props.data.map(item => Object.assign(item, {
                isErr: handleIsRequire(list, item),
                isReg: handleIsReg(listReg, item)
            }))
            return props.data.findIndex(item => (item as any).isErr || (item as any).isReg) === -1
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
        const regStatus = (data, item, ele) => {
            if (typeof data.reg === 'function') {
                return data.reg(item[ele.prop], item)
            }
            return !data.reg.test(item[ele.prop])
        }
        const handleIsReg = (list, item) => {
            const length = list.length
            if (length === 1) {
                return regStatus(list[0], item, list[0])
            } else {
                let status = false
                for (let i = 0; i < length - 1; i++) {
                    status = regStatus(list[i], item, list[i]) || regStatus(list[i], item, list[i + 1])
                }
                return status
            }
        }
        const getTableColumnsArr = (type: string) => {
            const list = props.column.filter(item => !!item[type])
            const listStr = []
            list.forEach(ele => listStr.push(ele.prop))
            return listStr
        }
        const errHandle = (row, key) => {
            /** 检查是否必填 */
            const listStr = getTableColumnsArr('isRequire')
            const errStr = []
            listStr.forEach(ele => props.data.map(item => {
                if (!item[ele]) {
                    errStr.push(ele)
                }
            })
            )
            /** 检查输入是否符合正则规则 */
            const listReg = getTableColumnsArr('reg')
            const regStr: any[] = []
            listReg.forEach(ele => props.data.map(item => {
                const reg = props.column.filter(item => item.prop === ele)[0]?.reg
                if (reg && !reg.test(item[ele])) {
                    regStr.push(ele)
                }
            }))
            const errStatus = listStr.includes(key) && row.isErr && errStr.includes(key)
            const regStatus = row.isReg && regStr.includes(key)
            return errStatus || regStatus
        }
        return {
            renderCheckbox,
            renderInput,
            renderSelect,
            renderCustomize,
            renderOperate,
            renderHeader,
            verification,
            tableList,
            errHandle
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
                                scopedSlots: (this as any)[typeList[item.type]](item)
                            }}
                        />
                    ))}
                    {this.renderOperate()}
                </bk-table>
            </div>
        )
    }
})
