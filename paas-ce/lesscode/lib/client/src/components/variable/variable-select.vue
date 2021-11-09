<template>
    <section class="select-variable">
        <section class="item-title">
            <slot name="title"></slot>
            <bk-select class="select-val-type"
                :value="valType"
                :clearable="false"
                :disabled="disabledChange"
                style="width: 68px;"
                behavior="simplicity"
                ext-popover-cls="select-popover-variable"
                @change="selectValType"
                v-if="show"
            >
                <bk-option v-for="(val, key) in avaliableVariableTypes"
                    :key="key"
                    :id="key"
                    :name="val">
                </bk-option>
            </bk-select>
        </section>

        <section v-if="disabledChange" class="select-variable-value">
            <span>{{ value }}</span>
        </section>

        <section v-else style="width: 100%">
            <slot v-if="computedValType === 'value'" class="item-content"></slot>

            <template v-if="computedValType === 'variable'">
                <section :class="{ 'select-variable-value': true, 'is-focus': isShowVariable }" v-bk-tooltips="htmlConfig" ref="tooltipsHtml">
                    <span v-if="value">{{ value }}</span>
                    <span v-else class="select-variable-placeholder">请选择变量</span>
                    <i :class="['bk-icon icon-close-circle-shape', { 'has-val': value }]" @click.stop="clearVariable"></i>
                    <i :class="['bk-icon icon-angle-down', { 'icon-flip': isShowVariable, 'has-val': value }]"></i>
                </section>
                <section class="variable-list">
                    <bk-input placeholder="请输入变量名称进行搜索" behavior="simplicity" class="variable-input" left-icon="bk-icon icon-search" v-model="variableName"></bk-input>
                    <bk-table :data="filterVariableList"
                        :outer-border="false"
                        :header-border="false"
                        :header-cell-style="{ background: '#f0f1f5' }"
                        :row-class-name="getRowClassName"
                        class="variable-table"
                        @row-click="chooseVariable"
                        @row-mouse-enter="handleRowMouseEnter"
                    >
                        <bk-table-column label="" prop="variableName" show-overflow-tooltip width="35">
                            <template slot-scope="props">
                                <bk-radio :value="props.row.variableCode === value" :disabled="props.row.disabled"></bk-radio>
                            </template>
                        </bk-table-column>
                        <bk-table-column label="变量名称" prop="variableName" show-overflow-tooltip width="120"></bk-table-column>
                        <bk-table-column label="变量标识" prop="variableCode" show-overflow-tooltip width="120"></bk-table-column>
                        <bk-table-column label="初始类型" show-overflow-tooltip width="120">
                            <template slot-scope="props">
                                <span>{{ getValueType(props.row) }}</span>
                            </template>
                        </bk-table-column>
                        <bk-table-column label="默认值" width="220">
                            <template slot-scope="props">
                                <span v-for="(val, key) in getDisplayDefaultValue(props.row)" :key="key" class="default-value" v-bk-overflow-tips>{{ `【${nameMap[key]}】${val}` }}</span>
                            </template>
                        </bk-table-column>
                    </bk-table>
                    <footer class="variable-footer">
                        <bk-button :text="true" title="primary" @click="showVariableForm">
                            <i class="bk-drag-icon bk-drag-add-line"></i>
                            新建变量
                        </bk-button>
                        <bk-button :text="true" title="primary" @click="goToVariableManage">
                            <i class="bk-drag-icon bk-drag-jump-link"></i>
                            管理项目级公共变量
                        </bk-button>
                    </footer>
                </section>
            </template>

            <bk-input v-if="computedValType === 'expression'" class="item-content" :value="value" @change="inputExpression" :disabled="disabledChange" clearable placeholder="请输入表达式，如：curTab === 'Tab-1'"></bk-input>
            <span v-if="remoteConfig.show && computedValType === 'variable'"
                class="remote-example"
                @click="handleShowExample">数据示例</span>
            <remote-example ref="example" :data="remoteConfig"></remote-example>
        </section>
    </section>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import remoteExample from '@/element-materials/modifier/component/props/components/strategy/remote-example'

    export default {
        components: {
            remoteExample
        },
        props: {
            show: {
                type: Boolean,
                default: true
            },
            value: String,
            valType: {
                type: String,
                default: 'value'
            },
            disabledChange: {
                type: Boolean,
                default: false
            },
            availableTypes: {
                type: Array,
                default: () => ([])
            },
            disableVariableType: {
                type: Array,
                default: () => ([])
            },
            remoteConfig: {
                type: Object,
                default: () => ({
                    show: false,
                    value: '',
                    name: ''
                })
            }
        },

        data () {
            const data = {
                isShowVariable: false,
                varTypes: {
                    value: '值',
                    variable: '变量',
                    expression: '表达式'
                },
                htmlConfig: {
                    allowHtml: true,
                    width: 644,
                    trigger: 'click',
                    theme: 'light',
                    content: '.variable-list',
                    placement: 'bottom-start',
                    onShow () {
                        data.isShowVariable = true
                    },
                    onHide () {
                        data.isShowVariable = false
                    }
                },
                variableName: '',
                nameMap: {
                    all: '所有环境',
                    stag: '预发布环境',
                    prod: '生产环境'
                },
                typeMap: {
                    0: 'string',
                    1: 'number',
                    2: 'boolean',
                    3: 'array',
                    4: 'object',
                    5: 'string',
                    6: 'all'
                }
            }
            return data
        },

        computed: {
            ...mapGetters('variable', ['variableList']),

            avaliableVariableTypes () {
                const retObj = {}
                Object.keys(this.varTypes).forEach(key => {
                    if (!this.disableVariableType.includes(key)) {
                        retObj[key] = this.varTypes[key]
                    }
                })

                return retObj
            },

            filterVariableList () {
                const variableList = JSON.parse(JSON.stringify(this.variableList || []))
                return variableList.filter((variable) => {
                    const isSearchResult = (variable.variableName || '').includes(this.variableName)
                    const valType = this.typeMap[variable.valueType] || []
                    const isCorrectType = this.availableTypes.length <= 0 || this.availableTypes.some((type) => (valType === 'all' || valType === type))
                    variable.disabled = !isCorrectType
                    return isSearchResult
                })
            },

            computedValType () {
                return this.show ? this.valType : 'value'
            }

        },

        methods: {
            ...mapActions('variable', ['setVariableFormData']),

            chooseVariable (row) {
                if (row.disabled) return
                this.$refs.tooltipsHtml._tippy.hide()
                this.triggerUpdate((dir) => {
                    dir.val = row.variableCode
                    dir.valType = this.valType
                    dir.valueType = this.typeMap[row.valueType]
                    dir.defaultVal = this.getVariableValue(row)
                })
            },

            inputExpression (val) {
                this.triggerUpdate((dir) => {
                    dir.val = val
                    dir.valType = this.valType
                })
            },

            selectValType (key) {
                console.log('from selectValType', this)
                this.triggerUpdate((dir) => {
                    dir.val = ''
                    dir.valType = key
                })
            },

            clearVariable () {
                this.triggerUpdate((dir) => {
                    dir.val = ''
                    dir.valType = this.valType
                })
            },

            triggerUpdate (callBack) {
                const changeData = {
                    val: this.value,
                    valType: this.valType,
                    valueType: undefined,
                    defaultVal: undefined
                }
                callBack(changeData)
                this.$emit('update:value', changeData.val)
                this.$emit('update:valType', changeData.valType)
                this.$emit('change', changeData)
            },

            getVariableValue ({ valueType, defaultValueType, defaultValue }) {
                let value
                if (defaultValueType === 0) {
                    value = defaultValue.all
                }
                if (defaultValueType === 1) {
                    value = defaultValue.stag
                }
                if ([3, 4].includes(valueType)) value = JSON.parse(value)
                if (valueType === 6) value = undefined
                return value
            },

            getDisplayDefaultValue (row) {
                const valList = {}
                const defaultVal = row.defaultValue || {}
                const showKeyList = row.defaultValueType === 0 ? ['all'] : ['prod', 'stag']
                showKeyList.forEach((key) => {
                    let val = defaultVal[key]
                    if (![3, 4].includes(row.valueType)) val = JSON.stringify(val)
                    valList[key] = val
                })
                return valList
            },

            getValueType ({ valueType }) {
                const valueTypeMap = {
                    0: 'String',
                    1: 'Number',
                    2: 'Boolean',
                    3: 'Array',
                    4: 'Object',
                    5: '图片地址',
                    6: '计算变量'
                }
                return valueTypeMap[valueType]
            },

            getRowClassName ({ row }) {
                return row.disabled ? 'variable-disabled' : ''
            },

            handleRowMouseEnter (index, event, row) {
                const rowEl = event.currentTarget
                if (rowEl._tippy || !row.disabled) return
                const instance = this.$bkPopover(rowEl, { content: '变量初始类型不适合该属性', arrow: true, extCls: 'variable-disabled-tips' })
                instance.show()
            },

            showVariableForm () {
                this.$refs.tooltipsHtml._tippy.hide()
                const data = { show: true, form: {} }
                this.setVariableFormData(data)
            },

            goToVariableManage () {
                const projectId = this.$route.params.projectId
                window.open(`/project/${projectId}/variable-manage`, '_blank')
            },
            handleShowExample () {
                this.$refs.example.isShow = true
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .select-variable {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        margin-top: 10px;
        width: 100%;
        .item-title {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            font-size: 14px;
            color: #63656E;
            word-break: keep-all;
            width: 100%;
        }
        .select-val-type {
            border: none;
            /deep/ .bk-select-angle {
                font-size: 16px;
                top: 7px;
                color: #b1b4bc;
            }
            /deep/ .bk-select-name {
                padding: 0 20px 0 0;
                text-align: right;
                font-size: 12px;
                color: #b1b4bc;
                transform: scale(0.9);
                line-height: 32px;
            }
        }
        .item-content {
            width: 100%;
        }
        .select-variable-value {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 32px;
            padding: 0 2px 0 10px;
            border: 1px solid #c4c6cc;
            cursor: pointer;
            border-radius: 2px;
            font-size: 12px;
            .select-variable-placeholder {
                color: #c3cdd7;
                pointer-events: none;
            }
            &.is-focus {
                border-color: #3a84ff;
                box-shadow: 0 0 4px rgb(58 132 255 / 40%);
            }
            .bk-icon {
                font-size: 20px;
                display: inline-block;
                &.icon-angle-down {
                    color: #979ba5;
                }
                &.icon-flip {
                    transform: rotate(-180deg);
                }
                &.icon-close-circle-shape {
                    color: #c4c6cc;
                    cursor: pointer;
                    font-size: 14px;
                    display: none;
                }
            }
            &:hover {
                .has-val.icon-close-circle-shape {
                    display: inline-block;
                    margin-right: 4px;
                }
                .has-val.icon-angle-down {
                    display: none;
                }
            }
        }
    }
   .variable-list {
       .variable-table:before {
           height: 0;
       }
       /deep/ .bk-table-header {
           th, .cell, .bk-table-header-label {
               height: 32px;
               line-height: 32px;
           }
       }
       /deep/ .bk-table-body-wrapper {
            max-height: 500px;
            overflow-y: auto;
            .bk-table-1-column-4 div {
                -webkit-line-clamp: 2;
            }
            .bk-table-row {
                cursor: pointer;
            }
            .bk-table-empty-text {
                padding: 30px 0 10px;
            }
        }
        .variable-footer {
            margin: 17px 0 8px;
            display: flex;
            justify-content: space-between;
            padding: 0 16px 0 4px;
            /deep/ .bk-button-text {
                font-size: 12px;
                line-height: 16px;
                span {
                    display: flex;
                    align-items: center;
                }
                .bk-drag-icon {
                    font-size: 14px !important;
                    margin-right: 5px;
                }
            }
        }
        .variable-input {
            margin-bottom: 8px;
            /deep/ .control-icon.left-icon {
                left: 0;
            }
            /deep/ .bk-input-text .bk-form-input {
                padding-left: 23px;
            }
        }
        .default-value {
            display: block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
   }
</style>
<style lang="postcss">
    .select-popover-variable .bk-option-content {
        padding: 0 10px;
        .bk-option-content-default {
            padding: 0;
        }
    }
    .variable-list .bk-table-body-wrapper .bk-table-row.variable-disabled {
        cursor: not-allowed;
    }
    .variable-disabled-tips .tippy-content {
        font-size: 12px;
    }
</style>
