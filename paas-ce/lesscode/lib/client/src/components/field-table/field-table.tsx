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
        /** checkbox */
        const renderCheckbox = (item: object) => {
            const scopedSlots = {
                default: (props) => {
                    const defaultSlot = (
                        <bk-checkbox value={props.row[item.prop]} />
                    )
                    return defaultSlot
                }
            }
            return <bk-table-column label={item.name} {...{ scopedSlots }} />
        }
        /** input */
        const renderInput = (item: object) => {
            const scopedSlots = {
                default: (props) => {
                    const defaultSlot = (
                        <bk-input
                            placeholder={item.placeholder || '请输入'}
                            class="field-table-input"
                            value={props.row[item.prop]}
                        />
                    )
                    return defaultSlot
                }
            }
            return <bk-table-column label={item.name} {...{ scopedSlots }} />
        }
        /** select */
        const renderSelect = (item: object) => {
            const scopedSlots = {
                default: (props) => {
                    const defaultSlot = (
                        <bk-select
                            class="field-table-select"
                            clearable={false}
                            value={props.row[item.prop]}
                        >
                            {item.optionsList
                                ? item.optionsList.map((option) => (
                                    <bk-option
                                        key={option.id}
                                        id={option.id}
                                        name={option.name}
                                    />
                                ))
                                : ''}
                        </bk-select>
                    )
                    return defaultSlot
                }
            }
            return <bk-table-column label={item.name} {...{ scopedSlots }} />
        }
        /** 操作列 */
        const renderOperate = () => {
            const handleAdd = (props) => {
                console.log(props, 'add')
                emit('add', props.row, props.$index)
            }
            const handleDelete = (props) => {
                console.log(props, 'delete')
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
            return <bk-table-column label="操作" {...{ scopedSlots }} />
        }
        /** 自定义 */
        const renderCustomize = (item: object) => {
            const scopedSlots = {
                default: (props) => item.renderFn.apply(this, [props])
            }
            return <bk-table-column label={item.name} {...{ scopedSlots }} />
        }
        return {
            renderCheckbox,
            renderInput,
            renderSelect,
            renderCustomize,
            renderOperate
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
                    {this.column.map((item) => this[typeList[item.type]](item))}
                    {this.renderOperate()}
                </bk-table>
            </div>
        )
    }
})
