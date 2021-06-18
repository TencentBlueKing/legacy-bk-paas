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
                        :last-directives="modifier.renderDirectives"
                        :component-id="curSelectedComponentData.componentId"
                        :component-type="curSelectedComponentData.type"
                        :key="curSelectedComponentData.renderKey"
                        @on-change="handleModifier" />
                </div>
            </bk-tab-panel>
        </bk-tab>
        <div class="empty" v-if="!Object.keys(curSelectedComponentData).length">
            <span>请选择组件</span>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import allComponentConf from '@/element-materials/materials'
    import iconComponentList from '@/element-materials/materials/icon-list.js'
    import { bus } from '@/common/bus'
    import ModifierStyles from './styles'
    import ModifierProps from './props'
    import ModifierEvents from './events'
    import ModifierDirectives from './directives'
    import cloneDeep from 'lodash.clonedeep'

    const baseComponentList = allComponentConf['bk'].concat(allComponentConf['element'] || [])

    const materialConfig = [
        ...baseComponentList,
        ...iconComponentList
    ]
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
                result.renderProps[key] = props[key]
            })
        }
        if (data.renderEvents) {
            result.renderEvents = { ...data.renderEvents }
        }
        if (data.renderDirectives) {
            result.renderDirectives = [...data.renderDirectives]
        }
        return result
    }

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
                modifier: {
                    renderStyles: {},
                    renderProps: {},
                    renderEvents: {},
                    renderDirectives: []
                }
            }
        },
        computed: {
            ...mapGetters('drag', [
                'curSelectedComponentData'
            ]),
            material () {
                // 从配置表中根据name，找到对应name组件的配置
                let { name } = this.curSelectedComponentData
                if (!name) {
                    return { styles: [], props: {}, events: [], directives: [] }
                }
                if (name === 'radio-group' && this.curSelectedComponentData.renderProps && this.curSelectedComponentData.renderProps.slots && this.curSelectedComponentData.renderProps.slots.name === 'bk-radio-button') {
                    name = 'radio-button-group'
                }
                let realMaterialConfig = { styles: [], props: {}, events: [], directives: [] }
                const defaultMaterialConfig = materialConfig.find(_ => _.name === name)
                if (defaultMaterialConfig) {
                    // 系统内置组件
                    realMaterialConfig = defaultMaterialConfig
                } else {
                    // 用户上传自定义组件
                    const customComponentList = window.customCompontensPlugin.map(callback => {
                        const [config] = callback(Vue)
                        return config
                    })
                    const custom = customComponentList.find(_ => _.name === name)
                    if (custom) {
                        realMaterialConfig = custom
                    }
                }
                const { styles = [], events = [], directives = [] } = realMaterialConfig

                /** 对Props进行处理，当Props的display属性为false时，不在配置面板中显示 */
                const originProps = realMaterialConfig.props || {}
                const props = Object.keys(originProps).reduce((acc, cur) => {
                    if (!originProps[cur].hasOwnProperty('display') || originProps[cur].display) {
                        acc[cur] = originProps[cur]
                    }
                    return acc
                }, {})

                return {
                    styles,
                    props,
                    events,
                    directives
                }
            },
            modifierCom () {
                // 当前属性面板的编辑组件
                const comMap = {
                    styles: ModifierStyles,
                    props: ModifierProps,
                    events: ModifierEvents,
                    directives: ModifierDirectives
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
                    const cData = cloneDeep(componentData)

                    // 默认展示props设置tab
                    // this.tabPanelActive = 'props'
                    this.tabPanelActive = cData.tabPanelActive || 'props'
                    // 选中某个组件，获取获取该组件的renderStyles，renderProps，renderEvents作为本次操作的默认值
                    const { renderStyles = {}, renderProps = {}, renderEvents = {}, renderDirectives = [] } = cData
                    this.modifier = Object.freeze({
                        renderStyles,
                        renderProps,
                        renderEvents,
                        renderDirectives
                    })
                },
                immediate: true,
                deep: true
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
                        padding: 0 20px;
                        .bk-tab-label-item {
                            width: 25%;
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
