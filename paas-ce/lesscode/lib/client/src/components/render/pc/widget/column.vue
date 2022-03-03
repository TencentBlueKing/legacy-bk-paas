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
    <draggable
        ref="draggable"
        :sort="true"
        :list="componentData.slot.default"
        :component-data="componentData"
        :group="{
            name: 'component',
            pull: true,
            put: [
                'layout',
                'component'
            ]
        }">
        <resolve-component
            v-for="slotComponentData in componentData.slot.default"
            ref="component"
            :key="slotComponentData.renderKey"
            :component-data="slotComponentData" />
    </draggable>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import Draggable from '../components/draggable'
    import ResolveComponent from '../resolve-component'

    export default {
        name: 'render-col',
        components: {
            Draggable,
            ResolveComponent
        },
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        inject: [
            'renderGrid'
        ],
        created () {
            const parentNodeChildCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    // 需要同时触发父级 grid 更新
                    this.autoType()
                }
            }

            LC.addEventListener('appendChild', parentNodeChildCallback)
            LC.addEventListener('removeChild', parentNodeChildCallback)
            
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('appendChild', parentNodeChildCallback)
                LC.removeEventListener('removeChild', parentNodeChildCallback)
            })
        },
        methods: {
            /**
             * @desc 自动排版子组件
             */
            autoType: _.throttle(function () {
                setTimeout(() => {
                    if (!this.$refs.component) {
                        return
                    }
                    const {
                        width: boxWidth,
                        left: boxLeft
                    } = this.$refs.draggable.$el.getBoundingClientRect()
                    const sepMarginLeft = 5
                    
                    // 计算 marginRight
                    this.$refs.component.forEach(componentInstance => {
                        const $el = componentInstance.$el
                        const {
                            left: componentLeft,
                            width: componentWidth
                        } = $el.getBoundingClientRect()
                        const {
                            marginLeft,
                            marginBottom
                        } = componentInstance.componentData.style
                        if (componentInstance.componentData.layoutType
                            || marginBottom === 'unset') {
                            componentInstance.componentData.setStyle('marginBottom', '10px')
                            return
                        }
                        if (!marginLeft || marginLeft === 'unset') {
                            if (componentLeft + componentWidth + sepMarginLeft < boxLeft + boxWidth) {
                                componentInstance.componentData.setStyle('marginRight', '10px')
                            }
                        }
                        if (!marginBottom || marginBottom === 'unset') {
                            componentInstance.componentData.setStyle('marginBottom', '10px')
                        }
                    })
                })
            }, 20)
        }
    }
</script>
