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
    <div :data-component-id="`component-${renderData.componentId}`"
        :base-component="renderData.type !== 'render-grid' && renderData.type !== 'free-layout' && !renderData.isCustomComponent && !renderData.isComplexComponent"
        :class="['wrapperCls', wrapperCls, (renderDataSlotName !== 'layout' ? 'component-wrapper' : '')]"
        :ref="`${renderData.componentId}-wrapper`" :style="Object.assign({}, wrapperNodeStyle, { top: renderData.renderStyles.top, left: renderData.renderStyles.left, width: renderData.renderStyles.width }, componentData.type === 'bk-swiper' ? { height: renderData.renderStyles.height } : {})"
        @mousedown.stop="componentWrapperMousedownHandler(renderData, $event)"
        @mouseenter.stop="componentWrapperMouseenterHandler(renderData, $event)"
        @mouseleave.stop="componentWrapperMouseleaveHandler(renderData, $event)"
        @click.stop="componentWrapperClickHandler(renderData, $event)"
        @contextmenu.stop="componentWrapperClickHandler(renderData, $event)">
        <component-menu class="component-context-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            :offset="getComputedMunuOffset"
            @update:show="show => contextMenuVisible = show">
            <a href="javascript:;" @click="handleContextmenuDelete">删除组件</a>
        </component-menu>
        <component-wrapper :render-data="renderData"
            :bind-props="bindProps"
            :refresh-key="renderDataSlotRefreshKey"
            :component-data="componentData"
            :ref="renderData.componentId">
            <template v-if="renderDataSlot">
                <template v-if="isMultSlot">
                    <template v-for="(item, index) in renderDataSlot.val">
                        <bk-table-column :label="item.label" v-if="renderDataSlotName === 'bk-table-column' && item.type === 'customCol'" :width="item.width" :key="item.templateCol + Math.random() * 1000">
                            <!-- eslint-disable-next-line -->
                            <template slot-scope="props">
                                <section v-html="item.templateCol"></section>
                            </template>
                        </bk-table-column>
                        <render-slot
                            v-else
                            :key="index"
                            :name="renderDataSlotName"
                            :slot-data="item"
                        />
                    </template>
                </template>
                <template v-else-if="renderDataSlotName === 'template'">
                    <section v-html="renderDataSlot.val"></section>
                </template>
                <template v-else-if="renderDataSlotName === 'layout'">
                    <div :class="getComponentWrapperClass(renderDataSlot.val.type)" :slot="getSlotName(renderDataSlot.val.slotName)">
                        <component :is="renderDataSlot.val.type" :key="`${componentData.renderKey}-layout`" :component-data="renderDataSlot.val">
                        </component>
                    </div>
                </template>
                <template v-else>
                    <render-slot :name="renderDataSlotName" :slot-data="renderDataSlot.val" />
                </template>
            </template>
        </component-wrapper>
        <!-- <component :is="renderData.type"
            v-bind="bindProps"
            :key="renderDataSlotRefreshKey"
            v-model="interactiveComponents.includes(renderData.type) ? renderData.interactiveShow : ''"
            :transfer="false"
            :component-type="componentData.type"
            :component-data="componentData"
            :style="Object.assign({}, renderData.renderStyles, (renderData.renderStyles && renderData.renderStyles.customStyle) || {}, { top: 0, left: 0 })"
            :ref="renderData.componentId">
            <template v-if="renderDataSlot">
                <template v-if="isMultSlot">
                    <template v-for="(item, index) in renderDataSlot.val">
                        <bk-table-column :label="item.label" v-if="renderDataSlotName === 'bk-table-column' && item.type === 'customCol'" :key="item.templateCol + Math.random() * 1000">
                            <template slot-scope="props">
                                <section v-html="item.templateCol"></section>
                            </template>
                        </bk-table-column>
                        <render-slot
                            v-else
                            :key="index"
                            :name="renderDataSlotName"
                            :slot-data="item"
                        />
                    </template>
                </template>
                <template v-else-if="renderDataSlotName === 'template'">
                    <section v-html="renderDataSlot.val"></section>
                </template>
                <template v-else-if="renderDataSlotName === 'layout'">
                    <component :is="renderDataSlot.val.type" :key="`${componentData.renderKey}-layout`" :component-data="renderDataSlot.val">
                    </component>
                </template>
                <template v-else>
                    <render-slot :name="renderDataSlotName" :slot-data="renderDataSlot.val" />
                </template>
            </template>
        </component> -->
    </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters, mapMutations } from 'vuex'
    import { bus } from '@/common/bus'
    import { uuid, getNodeWithClass, removeClassWithNodeClass, getStyle, findComponent, findComponentParentGrid, getContextOffset } from '@/common/util'
    import RenderSlot from './slot'
    import ComponentWrapper from './component-wrapper'
    import ComponentMenu from '@/components/widget/context-menu.vue'
    import WidgetForm from '@/components/widget/form'
    import WidgetFormItem from '@/components/widget/form-item'
    import offsetMixin from './offsetMixin'

    const components = {
        ComponentWrapper,
        ComponentMenu,
        RenderSlot,
        WidgetForm,
        WidgetFormItem,
        renderGrid: () => import('./grid'),
        renderRow: () => import('./row'),
        renderCol: () => import('./col'),
        freeLayout: () => import('./free-layout')
    }

    export default {
        name: 'render-component',
        components,
        mixins: [offsetMixin],
        props: {
            componentData: {
                type: Object,
                required: true
            }
        },
        data () {
            // 局部注册自定义组件
            for (const name in window.__innerCustomRegisterComponent__) {
                if (!this.$options.components[name]) {
                    this.$options.components[name] = window.__innerCustomRegisterComponent__[name]
                }
            }
            return {
                renderData: {},
                renderDataSlotName: '',
                renderDataSlot: null,
                renderDataSlotRefreshKey: Date.now(),
                bindProps: {},
                // componentWrapperNode: null,
                wrapperNodeStyle: {},
                BLOCK_ELEMS: [
                    'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'dl', 'table', 'form'
                ],
                INLINE_ELEMS: [
                    'span', 'a', 'strong', 'b', 'em', 'i', 'big', 'small', 'label', 'img', 'input', 'select', 'textarea'
                ],
                contextMenuVisible: false,
                contextMenuTarget: null,
                contextOffset: { x: 0, y: 0 }
            }
        },
        computed: {
            ...mapGetters('drag', ['targetData']),
            ...mapGetters('components', ['curNameMap', 'interactiveComponents']),
            isMultSlot () {
                return this.renderDataSlot && Array.isArray(this.renderDataSlot.val)
            },
            wrapperCls () {
                const renderDataType = this.renderData.type
                let ret = ''
                // 打包自定义组件时添加此类作为最上层父类，避免自定义组件的类污染画布页面的东西
                if (this.curNameMap[renderDataType]) {
                    ret += 'bk-layout-custom-component-wrapper'
                }

                let suffix = ''
                if (renderDataType === 'render-grid') {
                    suffix = ' grid'
                }
                if (renderDataType === 'free-layout') {
                    suffix = ' free-layout'
                }
                return `${ret}${suffix}`
            }
        },
        watch: {
            'renderData.componentId': {
                handler (val, old) {
                    this.renderData.isCustomComponent = !!this.curNameMap[this.renderData.type]
                    if (val) {
                        if (this.interactiveComponents.includes(this.renderData.type)) { // 交互式组件，将父级内容撑开
                            return {
                                display: 'block',
                                height: '100%',
                                margin: 0,
                                zIndex: 200
                            }
                        }
                        if (this.renderData.type !== 'render-grid' && this.renderData.type !== 'free-layout') {
                            // this.componentWrapperNode = this.$refs[`${val}-wrapper`]
                            const domNode = this.$refs[val].$el || this.$refs[val] // 原生html不会有$el元素
                            const componentDisplay = getStyle(domNode, 'display')
                            let ret = ''
                            if (componentDisplay) {
                                if (componentDisplay === 'block') {
                                    ret = 'block'
                                } else if (componentDisplay === 'inline-block' || componentDisplay === 'inline') {
                                    ret = 'inline-block'
                                } else if (componentDisplay === 'inline-flex') {
                                    ret = 'inline-flex'
                                }
                            } else {
                                const tagName = domNode.tagName.toLocaleLowerCase()
                                if (this.BLOCK_ELEMS.indexOf(tagName) > -1) {
                                    ret = 'block'
                                } else if (this.INLINE_ELEMS.indexOf(tagName) > -1) {
                                    ret = 'inline-block'
                                }
                            }
                            if (ret) {
                                this.wrapperNodeStyle = Object.assign({}, this.wrapperNodeStyle, {
                                    display: ret
                                })
                            }
                        }
                    }
                },
                immediate: true
            },
            componentData (v) {
                this.renderData = v
            }
        },
        created () {
            // console.log('from componnennt ===', this)
            // 这里切断引用的话会导致预览出现问题
            // this.renderData = Object.assign({}, this.componentData)

            this.renderData = this.componentData
            // 直接 json 回溯的话，json 配置中不会有 componentId
            if (!this.componentData.componentId) {
                this.renderData.componentId = this.componentData.name + '-' + uuid()
            }

            if (this.renderData.renderProps.slots) {
                this.renderDataSlotName = this.renderData.renderProps.slots.name
            }

            this.updateBindProps()
            // this.pushComponentToTree()
            bus.$on('on-update-props', this.updatePropsHandler)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('on-update-props', this.updatePropsHandler)
            })
        },
        mounted () {
            // this.componentWrapperNode = document.querySelector('.drag-wrapper')
            this.contextMenuTarget = (this.renderData.type !== 'render-grid' && this.renderData.type !== 'free-layout')
                ? this.$refs[`${this.renderData.componentId}-wrapper`]
                : null

            if (this.renderData.type !== 'render-grid' && this.renderData.type !== 'free-layout') {
                this.$emit('component-mounted', {
                    renderData: this.renderData,
                    elem: this.$el
                })
            }

            this.contextOffset = getContextOffset(this.$el)
        },
        methods: {
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData',
                'pushTargetHistory'
            ]),

            getSlotName (slotName) {
                return slotName || 'default'
            },

            getComponentWrapperClass (type) {
                return type === 'render-grid' ? 'bk-layout-grid-row-wrapper' : 'bk-layout-free-wrapper'
            },
            /**
             * 右键删除 component
             */
            handleContextmenuDelete () {
                setTimeout(() => {
                    const delBtn = document.querySelector('#del-component-right-sidebar')
                    delBtn && delBtn.click()
                }, 0)
                this.contextMenuVisible = false
            },

            updateBindProps () {
                const { renderProps } = this.renderData

                const bindProps = {}
                Object.keys(renderProps).forEach(renderPropsKey => {
                    bindProps[renderPropsKey] = renderProps[renderPropsKey].val
                })
                this.bindProps = bindProps

                if (this.renderData.renderProps.slots) {
                    this.renderDataSlot = this.renderData.renderProps.slots
                    this.renderDataSlotRefreshKey = Date.now()
                }
            },
            pushComponentToTree () {
                const targetData = _.cloneDeep(this.targetData)
                const selfNode = findComponent(targetData, this.renderData.componentId)
                selfNode.renderProps = this.renderData.renderProps
                this.setTargetData(targetData)
            },

            /**
             * on-update-props:component 事件回调
             *
             * @param {Object} data 更新的数据
             */
            updatePropsHandler (data) {
                if (data.componentId === this.renderData.componentId) {
                    // debugger
                    const pushData = {
                        type: 'update',
                        component: _.cloneDeep(this.renderData),
                        modifier: data.modifier
                    }
                    this.pushTargetHistory(pushData)
                    // const { renderStyles = {}, renderProps = {}, renderEvents = {} } = data.modifier
                    const { renderStyles = {}, renderProps = {}, renderEvents = {}, renderDirectives = [], tabPanelActive = 'props' } = data.modifier
                    this.renderData.renderStyles = renderStyles
                    this.renderData.renderProps = renderProps
                    this.renderData.renderEvents = renderEvents
                    this.renderData.renderDirectives = renderDirectives
                    this.renderData.tabPanelActive = tabPanelActive
                    this.updateBindProps()

                    // 把组件的 display 样式更改同步到 .component-wrapper 元素上
                    if (renderStyles.display) {
                        this.wrapperNodeStyle = Object.assign({}, this.wrapperNodeStyle, {
                            display: renderStyles.display
                        })
                    }

                    // 更新属性时，检测元素的 top + height 是否超过了容器的高度，如果超过了，那么就改变容器的高度
                    this.$nextTick(() => {
                        const parent = findComponentParentGrid(this.targetData, this.renderData.componentId)
                        if (!parent) return // 交互是组件没有parent，无需修改父容器

                        const top = parseInt(this.$el.style.top, 10)
                        const nodeHeight = parseInt(this.$el.getBoundingClientRect().height, 10)
                        if (nodeHeight + top > parseInt(parent.renderStyles.height, 10) + 3) {
                            parent.renderStyles.height = `${parseInt(nodeHeight + top + 100, 10)}px`
                            bus.$emit('on-update-free-layout-props', {
                                componentId: parent.componentId,
                                modifier: {
                                    renderStyles: parent.renderStyles
                                },
                                renderData: this.renderData,
                                dragNode: this.$el
                            })
                        }
                    })
                }
            },

            /**
             * 组件 wrapper mousedown 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMousedownHandler (renderData, e) {
                this.$emit('component-mousedown', {
                    renderData,
                    originalEvent: e
                })
            },

            /**
             * 组件点击事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperClickHandler (renderData, e) {
                if (renderData.type === 'render-grid' || renderData.type === 'free-layout') {
                    return
                }

                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'selected')
                removeClassWithNodeClass('.bk-layout-grid-row', 'row-hover')
                removeClassWithNodeClass('.bk-lesscode-free-layout', 'free-layout-hover')
                removeClassWithNodeClass('.wrapperCls', 'selected')
                removeClassWithNodeClass('.wrapperCls', 'wrapper-cls-selected')

                const curComponentNode = getNodeWithClass(e.target, 'wrapperCls')
                const className = this.renderDataSlotName === 'layout' ? 'wrapper-cls-selected' : 'selected'
                curComponentNode.classList.add(className)
                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
                bus.$emit('selected-tree', this.renderData.componentId)
                this.contextMenuVisible = false
            },

            /**
             * 组件 wrapper mouseenter 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMouseenterHandler (renderData, e) {
                if (renderData.type === 'render-grid' || renderData.type === 'free-layout') {
                    return
                }
                const className = this.renderDataSlotName === 'layout' ? 'wrapper-cls-hover' : 'component-wrapper-hover'
                const target = e.target
                target.classList.add(className)

                setTimeout(() => {
                    removeClassWithNodeClass('.bk-layout-grid-row', 'row-hover')
                    removeClassWithNodeClass('.bk-lesscode-free-layout', 'free-layout-hover')
                }, 100)
            },

            /**
             * 组件 wrapper mouseleave 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMouseleaveHandler (renderData, e) {
                if (renderData.type === 'render-grid' || renderData.type === 'free-layout') {
                    return
                }
                const className = this.renderDataSlotName === 'layout' ? 'wrapper-cls-hover' : 'component-wrapper-hover'
                const target = e.target
                target.classList.remove(className)
            }
        }
    }
</script>
<style lang="postcss">
    @import "./component.css";
    .wrapperCls {
        .bk-dialog-wrapper > .bk-dialog {
            pointer-events: none;
            .bk-dialog-body {
                pointer-events: auto;
            }
        }
        .bk-sideslider-wrapper > .bk-sideslider-content {
            padding: 10px;
        }
    }

</style>
