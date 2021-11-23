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

import { defineComponent, toRef, reactive, watch } from '@vue/composition-api'
import Vue, { VNode } from 'vue'

import './field-table.css'

interface ISelectOption {
    id: string
    name: string
}
interface IPropsObject {
    [key: string]: any
}

interface IRuleItem {
    validator: Function
    message: string
  }
interface IColumnItem {
    name: string
    type: string
    prop: string
    optionsList?: Function | ISelectOption[]
    width?: string
    isRequire?: boolean
    inputType?: string
    placeholder?: string
    renderFn?: Function
    /** 是否只读 */
    isReadonly?: Function | boolean
    componentProps?: IPropsObject | Function
    /** 校验规则 */
    rules?: IRuleItem[]
}
interface IError {
    [key: string]: string
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
        const tableList = toRef(props, 'data')
        /**
         * 校验报错信息，只显示第一个报错信息
         * key: column.prop_rowIndex
         * value: error tips text
         */
        const errorMap = reactive({})
        let renderColumns = reactive<IColumnItem[]>([])
        /**
         * 生成随机ID
         * @param {String} prefix 统一前缀
         * @param {Int} idLength 随机ID长度
         */
        const generateId = (prefix = '', length = 6) => {
            let d = new Date().getTime()
            const uuid = new Array(length).fill('x').join('').replace(/[xy]/g, c => {
                const r = (d + Math.random() * 16) % 16 | 0
                d = Math.floor(d / 16)
                return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
            })
            return `${prefix}${uuid}`
        }
        watch(
            toRef(props, 'column'),
            (val) => {
                renderColumns = val.map((column: IColumnItem) => Object.assign({
                    key: generateId(`field_table_column_${column.prop}`)
                }, column))
            },
            {
                immediate: true,
                deep: true
            }
        )
        
        /** 指定列/行disabled */
        const handleDisabled = (item: any, props: any) => {
            if (typeof item.isReadonly === 'function') {
                return item.isReadonly.apply(this, [item, props])
            }
            return item.isReadonly
        }

        const handleComponentProps = (item: any, props: any) => {
            if (typeof item.componentProps === 'function') {
                return item.componentProps.apply(this, [item, props])
            }
            return item.componentProps
        }

        const renderHeader = (h, { column, $index }, item) => {
            return (
                <span>
                    {column.label}
                    {item.isRequire ? <label class="asterisk">*</label> : ''}
                </span>
            )
        }
        /** checkbox */
        const renderCheckbox = (item: IColumnItem, props: any) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
            }
            const { row, $index } = props
            return <bk-checkbox
                value={row[item.prop]}
                disabled={handleDisabled(item, props)}
                onchange={(value) =>
                    change(value, row, item, $index)
                }
            />
        }
        /** input */
        const renderInput = (item: IColumnItem, props: any) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
            }
            const { row, $index } = props
            return <bk-input value={row[item.prop]} title={row[item.prop]}
                disabled={handleDisabled(item, props)}
                class={'field-table-input'}
                onChange={(value) =>
                    change(value, row, item, $index)
                }
                onBlur={handleValidator.bind(this, props, item)}
                {...{ props: (handleComponentProps(item, props)) }} />
        }
        /** select */
        const renderSelect = (item: IColumnItem, props: any) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
            }
            const { row, $index } = props
            const optionList = typeof item.optionsList === 'function'
                ? item.optionsList.apply(this, [item, props]) : item.optionsList
            const options = (optionList || []).map((option: any) => (
                <bk-option
                    key={option.id}
                    id={option.id}
                    name={option.name} />
            ))
            return <bk-select
                class={'field-table-select'}
                clearable={false}
                value={row[item.prop]}
                disabled={handleDisabled(item, props)}
                onChange={(value) =>
                    change(value, row, item, $index)
                }
                {...{ props: (handleComponentProps(item, props)) }}>
                {item.optionsList ? options : ''}
            </bk-select>
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
        
        const isEmpty = (value: any) => {
            return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
        }
        const updateColumnKey = (column: IColumnItem) => {
            Vue.set(column, 'key', generateId(`field_table_column_${column.prop}`))
        }
        /** 校验 */
        const handleValidator = async (props: any, column: any) => {
            const { row, $index } = props
            const value = row[column.prop]
            const errorKey = `${column.prop}_${$index}`
            // 必填校验
            if (column.isRequire && isEmpty(value)) {
                Vue.set(errorMap, errorKey, '必填项')
                updateColumnKey(column)
                return false
            }
            // 没有自定义校验规则
            if (!column.rules || !column.rules.length) {
                if (errorMap[errorKey]) {
                    Vue.delete(errorMap, errorKey)
                    updateColumnKey(column)
                }
                return true
            }
            // 执行自定义校验
            let count = 0
            for (const rule of column.rules) {
                const p = () => new Promise(async (resolve, reject) => {
                    try {
                        const result = await rule.validator(value, props.row)
                        if (result) {
                            resolve(rule)
                        } else {
                            reject(rule)
                        }
                    } catch (e) {
                        reject(rule)
                    }
                })
                try {
                    await p()
                    ++count
                } catch (e) {
                    Vue.set(errorMap, errorKey, rule.message)
                    updateColumnKey(column)
                    return false
                }
                if (count === column.rules.length && errorMap[errorKey]) {
                    Vue.delete(errorMap, errorKey)
                    updateColumnKey(column)
                    return true
                }
            }
        }
        
        // 组件外可以直接调用该方法判断是否校验通过
        const verification = () => {
            return new Promise((resolve, reject) => {
                // 待校验完成，防止input失焦的时候同时调用该方法。
                setTimeout(async () => {
                    // 有未处理错误直接 reject
                    if (Object.keys(errorMap).length) {
                        reject(new Error())
                    }
                    const length = props.data.length
                    for (const item of renderColumns) {
                        // 自定义列且没有自定义rules则不校验
                        if (item.type === 'custom' && !item?.rules?.length) continue
                        for (let i = 0; i < length; i++) {
                            const prop = { row: props.data[i], $index: i }
                            if (handleDisabled(item, prop)) continue
                            await handleValidator(prop, item)
                        }
                    }
                    // 统一校验完再次验证是否有错误没处理
                    if (Object.keys(errorMap).length) {
                        reject(new Error())
                    }
                    resolve(true)
                }, 400)
            })
        }

        return {
            errorMap,
            renderCheckbox,
            renderInput,
            renderSelect,
            renderOperate,
            renderHeader,
            verification,
            tableList,
            handleDisabled,
            renderColumns,
            handleComponentProps
        }
    },
    render (): VNode {
        const renderSelection = <bk-table-column type="selection" width={40} />
        const dynamicProps = {
            class: 'g-hairless-table',
            props: {
                data: this.tableList,
                outerBorder: false,
                headerBorder: false,
                headerCellStyle: {
                    background: '#f0f1f5'
                }
            }
        }
        const typeList = {
            input: 'renderInput',
            select: 'renderSelect',
            checkbox: 'renderCheckbox'
        }
        const renderColumn = (item: IColumnItem) => {
            return {
                default: (props: any) => {
                    /** 自定义 */
                    if (item.type === 'custom') {
                        return item.renderFn && item.renderFn.apply(this, [props, this.errorMap])
                    }
                    const errorInfo = this.errorMap[`${item.prop}_${props.$index}`]
                    const defaultSlot = <div class={{ 'field-error': !!errorInfo }}>
                        { (this as any)[typeList[item.type]](item, props) }
                        { !!errorInfo
                    && <i class="bk-icon icon-exclamation-circle-shape row-icons" v-bk-tooltips={errorInfo} /> }
                    </div>
                    return defaultSlot
                }
            }
        }
        return (
            <div class="field-table">
                <bk-table { ...dynamicProps }>
                    {this.isShowCheck ? renderSelection : ''}
                    {this.renderColumns.map((item: IColumnItem) => (
                        <bk-table-column
                            isRequire={item.isRequire}
                            label={item.name}
                            width={item.width || 'auto'}
                            renderHeader={(h, { column, $index }) =>
                                this.renderHeader(h, { column, $index }, item)
                            }
                            {...{
                                scopedSlots: renderColumn(item)
                            }}
                        />
                    ))}
                    {this.renderOperate()}
                </bk-table>
            </div>
        )
    }
})
