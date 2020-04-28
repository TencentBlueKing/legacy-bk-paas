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
    <div class="component-wrapper" :class="renderData.type === 'render-grid' ? 'grid' : ''"
        :ref="`${renderData.componentId}-wrapper`" :style="wrapperNodeStyle"
        @mouseenter.stop="componentWrapperMouseenterHandler(renderData, $event)"
        @mouseleave.stop="componentWrapperMouseleaveHandler(renderData, $event)"
        @click.stop="componentWrapperClickHandler(renderData, $event)"
        @contextmenu.stop="componentWrapperClickHandler(renderData, $event)">
        <context-menu class="component-context-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            @update:show="show => contextMenuVisible = show">
            <a href="javascript:;" @click="handleContextmenuDelete">删除</a>
        </context-menu>

        <component :is="renderData.type"
            v-bind="bindProps"
            :component-data="componentData"
            :style="renderData.renderStyles"
            :ref="renderData.componentId">
            <template v-if="renderDataSlot">
                <template v-if="isMultSlot">
                    <render-slot
                        v-for="(item, index) in renderDataSlot.val"
                        :key="index"
                        :name="renderDataSlotName"
                        :slot-data="item" />
                </template>
                <template v-else>
                    <render-slot :name="renderDataSlotName" :slot-data="renderDataSlot.val" />
                </template>
            </template>
        </component>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters, mapMutations } from 'vuex'
    import { bus } from '@/common/bus'
    import { uuid, getNodeWithClass, removeClassWithNodeClass, getStyle, findComponent } from '@/common/util'
    import RenderSlot from './slot'

    export default {
        name: 'render-component',
        components: {
            RenderSlot,
            renderGrid: () => import('./grid'),
            renderRow: () => import('./row'),
            renderCol: () => import('./col')
        },
        props: {
            componentData: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                renderData: {},
                renderDataSlotName: '',
                renderDataSlot: null,
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
                contextMenuTarget: null
            }
        },
        computed: {
            ...mapGetters('drag', [
                'targetData'
            ]),
            isMultSlot () {
                return this.renderDataSlot && Array.isArray(this.renderDataSlot.val)
            }
        },
        watch: {
            'renderData.componentId': {
                handler (val, old) {
                    if (val) {
                        if (this.renderData.type !== 'render-grid') {
                            // this.componentWrapperNode = this.$refs[`${val}-wrapper`]
                            const domNode = this.$refs[val].$el
                            const componentDisplay = getStyle(domNode, 'display')
                            let ret = ''
                            if (componentDisplay) {
                                if (componentDisplay === 'block') {
                                    ret = 'block'
                                } else if (componentDisplay === 'inline-block' || componentDisplay === 'inline') {
                                    ret = 'inline-block'
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
            }
        },
        created () {
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
            this.contextMenuTarget = this.renderData.type !== 'render-grid'
                ? this.$refs[`${this.renderData.componentId}-wrapper`]
                : null
        },
        methods: {
            ...mapMutations('drag', [
                'setCurSelectedComponentData',
                'setTargetData'
            ]),

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
                }
            },
            pushComponentToTree () {
                const targetData = _.cloneDeep(this.targetData)
                const selfNode = findComponent(this.targetData, this.renderData.componentId)
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
                    const { renderStyles = {}, renderProps = {}, renderEvents = {} } = data.modifier
                    this.renderData.renderStyles = renderStyles
                    this.renderData.renderProps = renderProps
                    this.renderData.renderEvents = renderEvents
                    this.updateBindProps()

                    // 把组件的 display 样式更改同步到 .component-wrapper 元素上
                    if (renderStyles.display) {
                        this.wrapperNodeStyle = Object.assign({}, this.wrapperNodeStyle, {
                            display: renderStyles.display
                        })
                    }
                }
            },

            /**
             * 组件点击事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperClickHandler (renderData, e) {
                if (renderData.type === 'render-grid') {
                    return
                }

                removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
                removeClassWithNodeClass('.component-wrapper', 'selected')

                const curComponentNode = getNodeWithClass(e.target, 'component-wrapper')
                curComponentNode.classList.add('selected')

                this.setCurSelectedComponentData(_.cloneDeep(this.renderData))
            },

            /**
             * 组件 wrapper mouseenter 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMouseenterHandler (renderData, e) {
                if (renderData.type === 'render-grid') {
                    return
                }

                const target = e.target
                target.classList.add('component-wrapper-hover')
            },

            /**
             * 组件 wrapper mouseleave 事件回调
             *
             * @param {Object} renderData 当前行数据
             * @param {Object} e 事件对象
             */
            componentWrapperMouseleaveHandler (renderData, e) {
                if (renderData.type === 'render-grid') {
                    return
                }

                const target = e.target
                target.classList.remove('component-wrapper-hover')
            },

            removeComponent (e) {
                e.stopPropagation()
            }
        }
    }
</script>
<style lang="postcss">
    @import "./component.css";
</style>
