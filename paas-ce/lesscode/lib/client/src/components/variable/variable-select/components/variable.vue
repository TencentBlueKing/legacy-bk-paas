<template>
    <div>
        <div
            :class="{
                'select-variable-value': true,
                'is-focus': isShowVariable
            }"
            v-bk-tooltips="htmlConfig"
            ref="tooltipsHtml">
            <bk-input
                placeholder="请选择变量"
                :value="formData.code"
                readonly />
        </div>
        <div class="variable-list">
            <bk-input
                placeholder="请输入变量名称进行搜索"
                behavior="simplicity"
                class="variable-input"
                left-icon="bk-icon icon-search"
                @change="handleSearch"
                v-model="searchText" />
            <bk-table
                :data="renderVarialbeList"
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#f0f1f5' }"
                :row-class-name="getVariableListRowClassName"
                class="variable-table"
                @row-click="handleVariableChange"
                @row-mouse-enter="handleRowMouseEnter">
                <bk-table-column
                    label=""
                    prop="variableName"
                    show-overflow-tooltip width="35">
                    <template slot-scope="props">
                        <bk-radio
                            :value="props.row.variableCode === formData.code"
                            :disabled="props.row.disabled" />
                    </template>
                </bk-table-column>
                <bk-table-column
                    label="变量名称"
                    prop="variableName"
                    show-overflow-tooltip
                    width="120" />
                <bk-table-column
                    label="变量标识"
                    prop="variableCode"
                    show-overflow-tooltip
                    width="120" />
                <bk-table-column
                    label="初始类型"
                    show-overflow-tooltip
                    width="120">
                    <template slot-scope="props">
                        <span>{{ getVariableTypeText(props.row) }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column
                    label="默认值"
                    width="220">
                    <template slot-scope="props">
                        <span
                            v-for="(val, key) in getVariableDefaultValue(props.row)"
                            :key="key"
                            class="default-value"
                            v-bk-overflow-tips>
                            {{ `【${envTextMap[key]}】${val}` }}
                        </span>
                    </template>
                </bk-table-column>
            </bk-table>
            <footer class="variable-footer">
                <bk-button
                    :text="true"
                    title="primary"
                    @click="handleCreateVariable">
                    <i class="bk-drag-icon bk-drag-add-line"></i>
                    新建变量
                </bk-button>
                <bk-button
                    :text="true"
                    title="primary"
                    @click="handleGoGlobalVariableManage">
                    <i class="bk-drag-icon bk-drag-jump-link"></i>
                    管理项目级公共变量
                </bk-button>
            </footer>
        </div>
        <div v-if="remoteConfig.show">
            <span
                class="remote-example"
                @click="handleShowRemoteExample">
                数据示例
            </span>
            <remote-example
                ref="example"
                :data="remoteConfig" />
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { mapGetters, mapActions } from 'vuex'
    import remoteExample from '@/element-materials/modifier/component/props/components/strategy/remote-example'
    import { VARIABLE_TYPE, VARIABLE_VALUE_TYPE } from 'shared/variable/index.js'

    const typeEnum = {
        0: 'string',
        1: 'number',
        2: 'boolean',
        3: 'array',
        4: 'object',
        5: 'string',
        6: 'all'
    }

    export default {
        name: '',
        components: {
            remoteExample
        },
        props: {
            options: {
                type: Object,
                required: true
            },
            formData: Object,
            remoteConfig: Object
        },
        data () {
            return {
                isShowVariable: false,
                renderVarialbeList: [],
                searchText: ''
            }
        },
        computed: {
            ...mapGetters('variable', ['variableList']),
            /**
             * @desc 可供选择的完整变量列表
             * @returns { Array }
             */
            wholeVariableList () {
                return this.variableList.map(variable => {
                    const variableValueTypeStr = typeEnum[variable.valueType]
                    return {
                        ...variable,
                        disabled: variableValueTypeStr !== 'all'
                            && (this.options.valueTypeInclude
                                && !this.options.valueTypeInclude.includes(variableValueTypeStr))
                    }
                })
            }
        },
        
        created () {
            this.renderVarialbeList = Object.freeze(this.wholeVariableList)

            this.envTextMap = {
                all: '所有环境',
                stag: '预发布环境',
                prod: '生产环境'
            }
            this.htmlConfig = {
                allowHtml: true,
                width: 644,
                trigger: 'click',
                theme: 'light',
                content: '.variable-list',
                placement: 'bottom-start',
                boundary: 'window',
                onShow: () => {
                    this.isShowVariable = true
                    this.handleSearch(this.searchText)
                },
                onHide: () => {
                    this.isShowVariable = false
                }
            }
        },
        methods: {
            ...mapActions('variable', ['setVariableFormData']),
            /**
             * @desc 获取变量的默认值
             * @returns { Boolean }
             */
            getVariableDefaultValue (row) {
                const valList = {}
                const defaultVal = row.defaultValue || {}
                const showKeyList = row.defaultValueType === VARIABLE_VALUE_TYPE.SAME ? ['all'] : ['prod', 'stag']
                showKeyList.forEach((key) => {
                    let val = defaultVal[key]
                    if (![VARIABLE_TYPE.ARRAY.VAL, VARIABLE_TYPE.OBJECT.VAL].includes(row.valueType)) val = JSON.stringify(val)
                    valList[key] = val
                })
                return valList
            },
            /**
             * @desc 变量类型展示文本
             * @returns { String }
             */
            getVariableTypeText ({ valueType }) {
                const variableType = Object.keys(VARIABLE_TYPE).find((variableTypeKey) => VARIABLE_TYPE[variableTypeKey].VAL === valueType)
                return variableType.NAME
            },
            /**
             * @desc 变量列表行样式
             * @param { Boolean } name
             * @returns { Boolean }
             */
            getVariableListRowClassName ({ row }) {
                return row.disabled ? 'variable-disabled' : ''
            },
            /**
             * @desc 鼠标移入 tips
             * @param { Number } index
             * @param { Object } event
             * @param { Object } row
             */
            handleRowMouseEnter (index, event, row) {
                const rowEl = event.currentTarget
                if (rowEl._tippy || !row.disabled) return
                const instance = this.$bkPopover(rowEl, {
                    content: '变量初始类型不适合该属性',
                    arrow: true,
                    extCls: 'variable-disabled-tips'
                })
                instance.show()
            },
            /**
             * @desc 变量列表搜索
             * @param { String } searchText
             */
            handleSearch: _.throttle(function (searchText) {
                this.searchText = searchText.trim()
                if (this.searchText === '') {
                    this.renderVarialbeList = Object.freeze(this.wholeVariableList)
                    return
                }
                this.renderVarialbeList = Object.freeze(this.wholeVariableList.reduce((result, variable) => {
                    if (variable.variableName.includes(this.searchText)) {
                        result.push(variable)
                    }
                    return result
                }, []))
            }, 60),
            /**
             * @desc 选中变量
             * @param { Object } variableData
             */
            handleVariableChange (variableData) {
                if (variableData.disabled) {
                    return
                }

                this.$refs.tooltipsHtml._tippy.hide()

                const getVariableValue = ({ valueType, defaultValueType, defaultValue }) => {
                    if (valueType === VARIABLE_TYPE.COMPUTED.VAL) {
                        return this.formData.renderValue
                    }

                    let value
                    if (defaultValueType === VARIABLE_VALUE_TYPE.SAME) {
                        value = defaultValue.all
                    } else if (defaultValueType === VARIABLE_VALUE_TYPE.DIFFERENT) {
                        value = defaultValue.stag
                    }
                    if ([VARIABLE_TYPE.ARRAY.VAL, VARIABLE_TYPE.OBJECT.VAL].includes(valueType)) {
                        return JSON.parse(value)
                    }
                    return value
                }

                this.$emit('on-change', {
                    code: variableData.variableCode,
                    renderValue: getVariableValue(variableData)
                })
            },
            /**
             * @desc 新建变量
             */
            handleCreateVariable () {
                this.$refs.tooltipsHtml._tippy.hide()
                const data = { show: true, form: {} }
                this.setVariableFormData(data)
            },
            /**
             * @desc 新建全局变量
             */
            handleGoGlobalVariableManage () {
                const projectId = this.$route.params.projectId
                window.open(`/project/${projectId}/variable-manage`, '_blank')
            },
            handleShowRemoteExample () {
                this.$refs.example.isShow = true
            }
        }
    }
</script>
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
<style lang="postcss" scoped>
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
