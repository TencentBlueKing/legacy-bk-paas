<template>
    <section>
        <bk-popover
            ref="mainPopoverRef"
            placement="bottom"
            trigger="click"
            theme="light"
            ext-cls="g-popover-empty-padding"
            :on-show="getFunctionListFromApi"
        >
            <bk-input
                class="choose-input"
                placeholder="请选择函数"
                :value="value.methodCode"
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
                            <ul
                                class="function-list"
                                v-if="functionType === 'functionList'"
                            >
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
                                                'select': value.methodCode === functionData.funcCode,
                                                'function-item': true
                                            }"
                                            :key="functionData.funcName"
                                            @click="handleChooseFunction(functionData)"
                                        >
                                            <span class="function-item-name" v-bk-overflow-tips>{{ functionData.funcName }}</span>
                                            <i
                                                class="bk-icon icon-edit-line function-tool mt10"
                                                @click.stop="handleEditFunction(functionData)"
                                            ></i>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
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
        <edit-function-dialog
            :show.sync="isShowEditFunctionDialog"
            :select-func-code="selectFuncCode"
            :insert-function="insertFunctionData"
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
            value: {
                type: Object
            },
            config: {
                type: Object
            }
        },

        data () {
            return {
                functionTypeList: [
                    { name: 'eventTemplate', label: '事件模板' },
                    { name: 'functionMarket', label: '函数市场' },
                    { name: 'functionList', label: '已有函数' }
                ],
                searchFunctionName: '',
                functionType: 'functionList',
                marketFunctionList: [],
                isLoading: false,
                isShowEditFunctionDialog: false,
                selectFuncCode: '',
                insertFunctionData: undefined
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups']),

            computedFunctionData () {
                let functionData
                switch (this.functionType) {
                    case 'eventTemplate':
                        functionData = this
                            .config
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

            handleChooseFunction (functionData) {
                this.$emit('choose', functionData)
                this.handleClose()
            },

            handleEditFunction (functionData) {
                this.selectFuncCode = functionData.funcCode
                this.insertFunctionData = undefined
                this.isShowEditFunctionDialog = true
                this.handleClose()
            },

            handleCreateFunction ({ id, ...functionData }) {
                this.insertFunctionData = {
                    ...getDefaultFunction(),
                    ...functionData,
                    projectId: this.$route.params.projectId
                }
                this.isShowEditFunctionDialog = true
                this.handleClose()
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

    .choose-input {
        width: 264px;
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
            @mixin scroller;
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
            background-image: linear-gradient(transparent 31px, rgb(220, 222, 229) 1px) !important;
        }
        ::v-deep .bk-tab-label-wrapper, ::v-deep .bk-tab-label-list, ::v-deep .bk-tab-label-list li {
            height: 32px !important;
            line-height: 32px !important;
        }
        ::v-deep .bk-tab-label-list li .bk-tab-label {
            font-size: 12px;
        }
    }
</style>
