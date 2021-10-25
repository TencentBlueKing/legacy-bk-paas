import { defineComponent } from '@vue/composition-api'
import { VNode } from 'vue'

import './field-table.css'

export default defineComponent({
    name: 'FieldTable',
    components: {},
    props: {
        data: Array,
        column: Array,
        isShowCheck: Boolean
    },
    setup(props, { emit }) {
        const renderHeader = (h, { column }, item) => {
            return (
                <span>
                    {column.label}
                    {item.isRequire ? <label class="asterisk">*</label> : ''}
                </span>
            )
        }
        /** checkbox */
        const renderCheckbox = (item: object) => {
            const change = (value, row, item, index) => {
                emit('checkboxChange', value, row, item, index)
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
        const renderInput = (item: object) => {
            const change = (value, row, item, index, props) => {
                handleData()
                emit('inputChange', value, row, item, index)
            }
            return {
                default: (props) => {
                    const { row, $index } = props
                    const defaultSlot = (
                        <bk-input
                            placeholder={item.placeholder || '请输入'}
                            class={`field-table-input ${row.err ? 'red' : ''}`}
                            value={row[item.prop]}
                            disabled={row?.isEdit}
                            onchange={(value) =>
                                change(value, row, item, $index, props)
                            }
                        />
                    )
                    return defaultSlot
                }
            }
        }
        /** select */
        const renderSelect = (item: object) => {
            const change = (value, row, item, index) => {
                emit('selectChange', value, row, item, index)
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
                            class="field-table-select"
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
                if (row.isEdit) {
                    return
                }
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
                                class={`bk-icon icon-plus-circle-shape field-icon ${
                                    row?.isEdit ? 'icon-disabled' : ''
                                }`}
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
        const renderCustomize = (item: object) => {
            return {
                default: (props) => item.renderFn.apply(this, [props])
            }
        }
        const handleData = () => {
            console.log(props.data, '===')
        }
        return {
            renderCheckbox,
            renderInput,
            renderSelect,
            renderCustomize,
            renderOperate,
            renderHeader
        }
    },
    render(): VNode {
        const typeList = {
            custom: 'renderCustomize',
            input: 'renderInput',
            select: 'renderSelect',
            checkbox: 'renderCheckbox'
        }
        const renderSelection = <bk-table-column type="selection" width={40} />
        return (
            <div class="field-table">
                <bk-table data={this.data} outer-border={false}>
                    {this.isShowCheck ? renderSelection : ''}
                    {this.column.map((item) => (
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
