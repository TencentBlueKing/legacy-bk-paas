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
    setup (props, { emit }) {
        const renderHeader = (h, { column, $index }, item) => {
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
        const renderInput = (item: object) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
            }
            return {
                default: (props) => {
                    const { row, $index } = props
                    const defaultSlot = (
                        <bk-input
                            placeholder={item.placeholder || '请输入'}
                            class="field-table-input"
                            value={row[item.prop]}
                            type={row[`${item.prop}InputType`] || 'text'}
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
        /** select */
        const renderSelect = (item: object) => {
            const change = (value, row, item, index) => {
                emit('change', value, row, item, index)
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
                emit('add', props.row, props.$index)
            }
            const handleDelete = (props) => {
                emit('delete', props.row, props.$index)
            }
            const scopedSlots = {
                default: (props) => {
                    const defaultSlot = (
                        <span>
                            <i
                                class="bk-icon icon-plus-circle-shape field-icon"
                                onClick={() => {
                                    handleAdd(props)
                                }}
                            />
                            <i
                                class="bk-icon icon-minus-circle-shape field-icon"
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
        return {
            renderCheckbox,
            renderInput,
            renderSelect,
            renderCustomize,
            renderOperate,
            renderHeader
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
