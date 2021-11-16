<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div class="material-modifier">
        <bk-tab
            :active="tabPanelActive"
            type="unborder-card"
            ext-cls="king-tab"
            @tab-change="handleModifier">
            <bk-tab-panel
                v-for="(tabPanel, panelIndex) in tabPanels"
                v-bind="tabPanel"
                :key="panelIndex" />
        </bk-tab>
        <div
            v-if="renderKey"
            class="material-modifier-container">
            <template v-for="(com, index) in modifierComList">
                <component
                    :is="com"
                    :key="`${renderKey}_${index}`" />
            </template>
        </div>
        <div v-if="!renderKey" class="empty">
            <span>请选择组件</span>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import ModifierStyles from './styles'
    import ModifierSlots from './slots'
    import ModifierGird from './gird'
    import ModifierForm from './form'
    import ModifierProps from './props'
    import ModifierEvents from './events'
    import ModifierDirectives from './directives'

    // const dataClean = data => {
    //     const isInvalid = val => {
    //         return val === null || val === undefined
    //     }
    //     const result = {
    //         renderStyles: {},
    //         renderProps: {}
    //     }
    //     if (data.renderStyles) {
    //         const styles = data.renderStyles
    //         Object.keys(styles).forEach(key => {
    //             if (isInvalid(styles[key]) || styles[key] === 'px') {
    //                 return
    //             }
    //             result.renderStyles[key] = styles[key]
    //         })
    //     }
    //     if (data.renderProps) {
    //         const props = data.renderProps
    //         Object.keys(props).forEach(key => {
    //             if (isInvalid(props[key].val)) {
    //                 return
    //             }
    //             result.renderProps[key] = props[key]
    //         })
    //     }
    //     if (data.renderEvents) {
    //         result.renderEvents = { ...data.renderEvents }
    //     }
    //     if (data.renderDirectives) {
    //         result.renderDirectives = [...data.renderDirectives]
    //     }
    //     if (data.renderSlots) {
    //         result.renderSlots = { ...data.renderSlots }
    //     }
    //     return result
    // }

    export default {
        name: '',
        components: {
            ModifierStyles,
            ModifierProps,
            ModifierEvents,
            ModifierDirectives
        },
        inheritAttrs: false,
        data () {
            return {
                tabPanels: [
                    { name: 'styles', label: '样式', count: 40 },
                    { name: 'props', label: '属性', count: 30 },
                    { name: 'events', label: '事件', count: 20 },
                    { name: 'directives', label: '指令', count: 10 }
                ],
                tabPanelActive: 'props',
                currentTabPanelType: 'unborder-card',
                renderKey: ''
            }
        },
        computed: {
            modifierComList () {
                // 当前属性面板的编辑组件
                const comMap = {
                    styles: [ModifierStyles],
                    props: [ModifierGird, ModifierForm, ModifierSlots, ModifierProps],
                    events: [ModifierEvents],
                    directives: [ModifierDirectives]
                }
                return comMap[this.tabPanelActive]
            }
        },
        
        created () {
            this.activeComponentNode = null
            const activeCallback = _.debounce(({ target }) => {
                this.tabPanelActive = target.tabPanelActive
                this.renderKey = target.renderKey
                this.activeComponentNode = target
            }, 60)

            const activeClearCallback = () => {
                this.tabPanelActive = 'props'
                this.renderKey = ''
                this.activeComponentNode = null
            }
            
            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', activeClearCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', activeClearCallback)
            })
        },
        methods: {
            handleModifier (tabPanelActive) {
                this.tabPanelActive = tabPanelActive
                if (this.activeComponentNode) {
                    this.activeComponentNode.setProperty('tabPanelActive', tabPanelActive)
                }
            }
        }
    }
</script>
<style lang='postcss'>
    @import "@/css/mixins/scroller";
    @import "@/css/variable";

    .material-modifier {
        .bk-tab.king-tab {
            .bk-tab-header {
                height: 47px;
                border-bottom: 1px solid $boxBorderColor;
                .bk-tab-label-wrapper {
                    background: #fff;
                    .bk-tab-label-list {
                        width: 100%;
                        height: 100%;
                        padding: 0 20px;
                        .bk-tab-label-item {
                            width: 25%;
                            line-height: 46px;
                            min-width: auto;
                            padding: 0 2px;
                            &.active::after {
                                left: 16%;
                                width: 68%;
                            }
                        }
                    }
                }
            }
            .bk-tab-section {
                padding: 0;
            }
            
        }
        .material-modifier-container {
            @mixin scroller;
            height: calc(100vh - 167px - 93px);
            padding-bottom: 20px;
            overflow-y: auto;
            position: relative;
            .no-style,
            .no-prop,
            .no-event,
            .no-slot {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
        /* bk-input 前后的 slot 文本样式 */
        .common-input-slot-text {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 32px;
            height: 100%;
            font-size: 14px;
            line-height: 20px;
            background: #fafbfd;
        }

        /* 属性校验失败的提示文本样式 */
        .modifier-input-error-text {
            color: $newRedColor;
            font-size: 12px;
            line-height: 16px;
        }

        /* 属性/样式输入框校验失败边框变红警告样式 */
        .king-input-modifier-style-error {
            input, textarea {
                border-color: $newRedColor !important;
                &:focus {
                    border-color: $newRedColor !important;
                }
            }
        }
        textarea.king-input-modifier-style-error, input.king-input-modifier-style-error {
            border-color: $newRedColor !important;
            &:focus {
                border-color: $newRedColor !important;
            }
        }
        .empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>
