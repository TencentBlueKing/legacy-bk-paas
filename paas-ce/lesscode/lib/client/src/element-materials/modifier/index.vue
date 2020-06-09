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
        <bk-tab :active.sync="tabPanelActive" :type="currentTabPanelType" ext-cls="king-tab" @tab-change="handleModifier">
            <bk-tab-panel
                v-for="(tabPanel, panelIndex) in tabPanels"
                v-bind="tabPanel"
                :key="panelIndex">
                <div class="material-modifier-container">
                    <component
                        :is="modifierCom"
                        :material-config="materialComConfig"
                        :last-styles="modifier.renderStyles"
                        :last-props="modifier.renderProps"
                        :last-events="modifier.renderEvents"
                        :component-id="curSelectedComponentData.componentId"
                        :key="curSelectedComponentData.renderKey"
                        @on-change="handleModifier" />
                </div>
            </bk-tab-panel>
        </bk-tab>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import materialConfig from '@/element-materials/materials'
    import { bus } from '@/common/bus'
    import ModifierStyles from './styles'
    import ModifierProps from './props'
    import ModifierEvents from './events'

    const dataClean = data => {
        const isInvalid = val => {
            return val === null || val === undefined
        }
        const result = {
            renderStyles: {},
            renderProps: {}
        }
        if (data.renderStyles) {
            const styles = data.renderStyles
            Object.keys(styles).forEach(key => {
                if (isInvalid(styles[key]) || styles[key] === 'px') {
                    return
                }
                result.renderStyles[key] = styles[key]
            })
        }
        if (data.renderProps) {
            const props = data.renderProps
            Object.keys(props).forEach(key => {
                if (isInvalid(props[key].val)) {
                    return
                }
                if (Object.prototype.toString.call(props[key].val) === '[object Array]' && props[key].val.length < 1) {
                    return
                }
                if (Object.prototype.toString.call(props[key].val) === '[object Object]' && Object.keys(props[key].val).length < 1) {
                    return
                }
                result.renderProps[key] = props[key]
            })
        }
        if (data.renderEvents) {
            result.renderEvents = { ...data.renderEvents }
        }
        return result
    }

    export default {
        name: '',
        components: {
            ModifierStyles,
            ModifierProps,
            ModifierEvents
        },
        data () {
            return {
                tabPanels: [
                    { name: 'styles', label: '样式', count: 30 },
                    { name: 'props', label: '属性', count: 20 },
                    { name: 'events', label: '事件', count: 10 }
                ],
                tabPanelActive: 'props',
                currentTabPanelType: 'unborder-card'
            }
        },
        computed: {
            ...mapGetters('drag', [
                'curSelectedComponentData'
            ]),
            material () {
                // 从配置表中根据name，找到对应name组件的配置
                const { name } = this.curSelectedComponentData
                if (!name) {
                    return { styles: [], props: {}, events: [] }
                }
                const { styles = [], props = {}, events = [] } = materialConfig.find(_ => _.name === name)
                return {
                    styles,
                    props,
                    events
                }
            },
            modifierCom () {
                // 当前属性面板的编辑组件
                const comMap = {
                    styles: ModifierStyles,
                    props: ModifierProps,
                    events: ModifierEvents
                }
                return comMap[this.tabPanelActive]
            },
            materialComConfig () {
                // 当前属性面板编辑组件的渲染配置
                // if (!this.material.hasOwnProperty(this.tabPanelActive)) {
                //     // return this.tabPanelActive === 'styles' ? [] : {}
                //     return this.tabPanelActive === 'props' ? {} : []
                // }
                return this.material[this.tabPanelActive]
            }
        },
        watch: {
            curSelectedComponentData: {
                handler (componentData) {
                    // 默认展示props设置tab
                    // this.tabPanelActive = 'props'
                    this.tabPanelActive = componentData.tabPanelActive
                    // 选中某个组件，获取获取该组件的renderStyles，renderProps，renderEvents作为本次操作的默认值
                    const { renderStyles = {}, renderProps = {}, renderEvents = {} } = componentData
                    this.modifier = {
                        renderStyles,
                        renderProps,
                        renderEvents
                    }
                },
                deep: true
            }
        },
        created () {
            this.modifier = {
                renderStyles: {},
                renderProps: {},
                renderEvents: {}
            }
        },
        methods: {
            handleModifier (payload) {
                const modifier = dataClean({
                    ...this.modifier,
                    ...payload
                })

                modifier.tabPanelActive = this.tabPanelActive
                this.modifier = modifier
                console.log('from modifier', modifier)
                bus.$emit('on-update-props', {
                    componentId: this.curSelectedComponentData.componentId,
                    modifier
                })
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
                        padding: 0 32px;
                        .bk-tab-label-item {
                            width: 33%;
                            line-height: 46px;
                            min-width: auto;
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
            .material-modifier-container {
                @mixin scroller;
                height: calc(100vh - 167px - 93px);
                padding-bottom: 20px;
                overflow-y: auto;
                position: relative;
                .no-style,
                .no-prop,
                .no-event {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
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
            input {
                border-color: $newRedColor !important;
                &:focus {
                    border-color: $newRedColor !important;
                }
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
