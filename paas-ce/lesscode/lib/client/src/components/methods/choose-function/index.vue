<template>
    <section class="choose-function-main">
        <slot name="header"></slot>
        
        <bk-popover
            ref="mainPopoverRef"
            placement="bottom"
            trigger="click"
            theme="light"
            ext-cls="g-popover-empty-padding"
            :tippy-options="{ arrow: false }"
            :on-show="getFunctionListFromApi"
        >
            <bk-input
                class="choose-input"
                placeholder="请选择函数"
                :value="renderChoosenFunction.methodCode"
                readonly
            />
            <div slot="content">
                <section class="choose-function" v-bkloading="{ isLoading }">
                    <bk-tab
                        class="function-tab"
                        type="border-card"
                        :label-height="42"
                        :active.sync="functionType"
                    >
                        <bk-tab-panel
                            v-for="(functionTypeItem, index) in functionTypeList"
                            v-bind="functionTypeItem"
                            :key="index"
                        >
                            <bk-input
                                class="choose-function-search"
                                left-icon="bk-icon icon-search"
                                behavior="simplicity"
                                v-model="searchFunctionName"
                            ></bk-input>
                            <template v-if="functionType === 'functionList'">
                                <ul class="function-list">
                                    <li
                                        class="function-group"
                                        :key="funcGroup.groupName"
                                        v-for="funcGroup in computedFunctionData"
                                    >
                                        <span class="function-group-name">
                                            {{ funcGroup.groupName }}（{{ funcGroup.children.length }}）
                                        </span>
                                        <ul class="group-function-list">
                                            <li
                                                v-bk-tooltips="{
                                                    content: functionData.funcSummary,
                                                    disabled: !functionData.funcSummary,
                                                    placements: ['left-start'],
                                                    width: 200,
                                                    boundary: 'window'
                                                }"
                                                v-for="functionData in funcGroup.children"
                                                :class="{
                                                    'select': renderChoosenFunction.methodCode === functionData.funcCode,
                                                    'function-item': true
                                                }"
                                                :key="functionData.funcName"
                                                @click="handleChooseFunction(functionData.funcCode)"
                                            >
                                                <span class="function-item-name" v-bk-overflow-tips>{{ functionData.funcCode }}</span>
                                                <i
                                                    class="bk-icon icon-edit-line function-tool mt10"
                                                    @click.stop="handleEditFunction(functionData)"
                                                ></i>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <bk-button
                                    class="function-add"
                                    text
                                    @click="handleShowFunction"
                                >
                                    <i class="bk-icon icon-plus-circle"></i>新增
                                </bk-button>
                            </template>
                            <ul class="function-list" v-else>
                                <li
                                    class="function-item"
                                    v-for="functionData in computedFunctionData"
                                    v-bk-tooltips="{
                                        content: functionData.funcSummary,
                                        disabled: !functionData.funcSummary,
                                        placements: ['left-start'],
                                        width: 200,
                                        boundary: 'window'
                                    }"
                                    :key="functionData.funcName"
                                >
                                    <span class="function-item-name" v-bk-overflow-tips>{{ functionData.funcName }}</span>
                                    <span
                                        class="function-tool"
                                        @click="handleCreateFunction(functionData)"
                                    >引用</span>
                                </li>
                            </ul>
                            <bk-exception
                                class="exception-wrap-item exception-part"
                                type="empty"
                                scene="part"
                                v-if="computedFunctionData.length <= 0"
                            ></bk-exception>
                        </bk-tab-panel>
                    </bk-tab>
                </section>
            </div>
        </bk-popover>

        <template v-if="showAddParams">
            <div class="panel-item" v-for="(panel, index) in renderChoosenFunction.params" :key="index">
                <bk-input :value="panel.value" @change="val => handleChangeParam(index, val)" />
                <i class="bk-icon icon-minus-circle" @click="handleDeleteParam(index)"></i>
            </div>
            <div
                class="panel-add"
                v-bk-tooltips="{
                    content: '配置的执行参数，会在函数执行的时候传入，且优先级最高',
                    placements: ['left'],
                    boundary: 'window'
                }"
                @click="handlePlusParam"
            >
                <i class="bk-icon icon-plus-circle"></i>添加函数执行参数
            </div>
        </template>

        <edit-function-dialog
            :show.sync="isShowEditFunctionDialog"
            :select-func-code="selectFuncCode"
            :insert-function="insertFunctionData"
            :show-save-use="true"
            @save-use="handleChooseFunction"
        />
    </section>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import EditFunctionDialog from '@/components/methods/edit-function-dialog/index.vue'
    import { getDefaultFunction } from 'shared/function'

    export default {
        components: {
            EditFunctionDialog
        },

        props: {
            choosenFunction: {
                type: Object
            },
            functionTemplates: {
                type: Array
            },
            showAddParams: {
                type: Boolean,
                default: true
            }
        },

        data () {
            return {
                functionTypeList: [
                    { name: 'functionTemplate', label: '事件模板' },
                    { name: 'functionMarket', label: '函数市场' },
                    { name: 'functionList', label: '应用函数库' }
                ],
                searchFunctionName: '',
                functionType: 'functionList',
                marketFunctionList: [],
                isLoading: false,
                isShowEditFunctionDialog: false,
                selectFuncCode: '',
                insertFunctionData: undefined,
                renderChoosenFunction: {}
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups']),

            computedFunctionData () {
                let functionData
                switch (this.functionType) {
                    case 'functionTemplate':
                        functionData = this
                            .functionTemplates
                            ?.filter(functionTemplate => functionTemplate.funcName?.includes(this.searchFunctionName))
                        break
                    case 'functionMarket':
                        functionData = this
                            .marketFunctionList
                            ?.filter(marketFunction => marketFunction.funcName?.includes(this.searchFunctionName))
                        break
                    case 'functionList':
                        functionData = this
                            .funcGroups
                            ?.reduce((acc, cur) => {
                                const children = cur
                                    .children
                                    .filter(functionData => functionData.funcName?.includes(this.searchFunctionName))
                                acc.push({
                                    ...cur,
                                    children
                                })
                                return acc
                            }, [])
                        break
                }
                return functionData || []
            }
        },

        created () {
            this.renderChoosenFunction = {
                methodCode: this.choosenFunction?.methodCode || '',
                params: [...this.choosenFunction?.params || []]
            }
        },

        methods: {
            ...mapActions('functionMarket', ['getFunctionList']),

            getFunctionListFromApi () {
                this.isLoading = true
                this.getFunctionList().then((functionList) => {
                    this.marketFunctionList = functionList
                }).finally(() => {
                    this.isLoading = false
                })
            },

            triggleUpdate () {
                this.$emit('change', JSON.parse(JSON.stringify(this.renderChoosenFunction)))
            },

            handleChooseFunction (funcCode) {
                this.renderChoosenFunction.methodCode = funcCode
                this.triggleUpdate()
                this.handleClose()
            },

            handleChangeParam (index, val) {
                this.renderChoosenFunction.params[index].value = val
                this.triggleUpdate()
            },

            handleDeleteParam (index) {
                this.renderChoosenFunction.params.splice(index, 1)
                this.triggleUpdate()
            },

            handlePlusParam () {
                this.renderChoosenFunction.params.push({ value: '' })
                this.triggleUpdate()
            },

            handleEditFunction (functionData) {
                this.clearStatus()
                this.selectFuncCode = functionData.funcCode
                this.showFunctionDialog()
                this.handleClose()
            },

            handleShowFunction () {
                this.clearStatus()
                this.showFunctionDialog()
                this.handleClose()
            },

            handleCreateFunction ({ id, ...functionData }) {
                this.clearStatus()
                this.insertFunctionData = {
                    ...getDefaultFunction(),
                    ...functionData,
                    projectId: this.$route.params.projectId
                }
                this.showFunctionDialog()
                this.handleClose()
            },

            clearStatus () {
                this.selectFuncCode = undefined
                this.insertFunctionData = undefined
            },

            showFunctionDialog () {
                this.isShowEditFunctionDialog = true
            },

            handleClose () {
                this.$refs['mainPopoverRef'].hideHandler()
            }
        }
    }
</script>

<style lang='postcss' scoped>
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .choose-function-main {
        position: relative;
        background: #f0f1f5;
        border-radius: 2px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        &:hover {
            box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 20%);
        }
    }
    .panel-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
        width: 100%;
    }
    .icon-minus-circle {
        margin: 0 3px;
        cursor: pointer;
    }
    .panel-add {
        font-size: 12px;
        margin: 10px 0 0;
        line-height: 16px;
        cursor: pointer;
        &:hover {
            color: #3a84ff;
        }
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
    .choose-input {
        width: 100%;
        cursor: pointer;
        ::v-deep .bk-form-input[readonly] {
            background-color: #ffffff !important;
            border-color: #c4c6cc !important;
        }
    }
    .choose-function {
        .choose-function-search {
            width: 280px;
            margin: 4px 10px;
            ::v-deep input {
                border-color: transparent transparent #EAEBF0;
            }
        }
        .function-list {
            max-height: 350px;
            overflow-y: auto;
            padding-bottom: 8px;
            background: #fff;
            @mixin scroller;
        }
        .function-add {
            width: 100%;
            padding: 0 16px;
            border-radius: 0 0 1px 1px;
            border-top: 1px solid #dcdee5;
            background: #fafbfd;
            line-height: 32px;
            height: 32px;
            text-align: left;
            font-size: 12px;
            .icon-plus-circle {
                margin-right: 4px;
                vertical-align: text-bottom;
            }
        }
        .function-group {
            font-size: 12px;
            .function-group-name {
                display: inline-block;
                width: 280px;
                line-height: 32px;
                color: #979ba5;
                margin: 0 10px;
                border-bottom: 1px solid #dcdee5;
            }
        }
        .function-item {
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
            cursor: pointer;
            color: #63656E;
            .function-item-name {
                @mixin ellipsis 230px, inline-block;
            }
            .function-tool {
                float: right;
                color: #3A84FF;
                display: none;
            }
            &.select {
                background: #e1ecff;
                color: #3a84ff;
            }
            &:hover {
                background: #e1ecff;
                color: #3a84ff;
                .function-tool {
                    display: block;
                }
            }
        }
        .exception-wrap-item {
            margin-bottom: 30px;
        }
        ::v-deep .bk-tab-label-wrapper .bk-tab-label-list .bk-tab-label-item.simulate-border-bottom .bk-tab-label {
            box-shadow: none !important;
        }
        ::v-deep .bk-tab-section {
            padding: 0;
        }
    }
    .function-tab {
        ::v-deep .bk-tab-header {
            height: 32px !important;
            border-top: none;
            background-image: none !important;
        }
        ::v-deep .bk-tab-label-wrapper, ::v-deep .bk-tab-label-list, ::v-deep .bk-tab-label-list li {
            height: 32px !important;
            line-height: 32px !important;
        }
        ::v-deep .bk-tab-label-list li {
            border: none;
            background: #f0f1f5;
            &:nth-child(2) {
                border-radius: 0px 0px 4px 0px;
            }
            &:last-child {
                border-radius: 0px 0px 0px 4px;
            }
        }
        ::v-deep .bk-tab-label-list li .bk-tab-label {
            font-size: 12px;
        }
        ::v-deep .bk-tab-content {
            background-color: #fff;
        }
    }
    ::v-deep .tippy-active .choose-input .bk-input-text input {
        border-color: #3a84ff !important;
    }
    ::v-deep .bk-tooltip, ::v-deep .bk-tooltip-ref {
        width: 100%;
    }
</style>
