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
    <div
        :class="{
            [$style['column']]: true,
            [$style['render-grid-empty']]: renderGrid.isColumnEmpty,
            [$style['empty']]: componentData.children.length < 1
        }">
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
    </div>
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
        inject: ['renderGrid'],
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        created () {
            const nodeCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    // 需要同时触发父级 grid 更新
                    this.autoType()
                }
            }

            LC.addEventListener('appendChild', nodeCallback)
            LC.addEventListener('removeChild', nodeCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('appendChild', nodeCallback)
                LC.removeEventListener('removeChild', nodeCallback)
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
<style lang="postcss" module>
    .column{
        position: relative;
        width: 100% !important;
        height: 100% !important;
        &.render-grid-empty{
            min-height: 64px !important;
        }
        &.empty{
            background: #FAFBFD;
            &::before{
                content: "请拖入组件";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #C4C6CC;
                pointer-events: all;
            }
        }
        .insert-before,
        .insert-after{
            position: absolute;
            top: 50%;
            z-index: 11;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3A84FF;
            cursor: pointer;
            pointer-events: all;
            transform: translateY(-50%);
            :global(img){
                width: 14px;
                height: 14px;
            }
        }
        .insert-before{
            left: -10px;
        }
        .insert-after{
            right: -10px;
        }
    }
</style>
