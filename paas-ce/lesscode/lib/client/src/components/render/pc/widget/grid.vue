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
    <div :class="$style['grid']">
        <resolve-component
            v-for="slotComponentData in componentData.slot.default"
            :class="$style['col']"
            :key="slotComponentData.renderKey"
            :component-data="slotComponentData" />
        <template v-if="componentData.isActived">
            <div
                :class="$style['add-column']"
                key="append-column"
                role="append-column"
                @click="handleAddColumn"
                data-render-drag="disabled">
                <img src="../../../../images/svg/add-line.svg" />
            </div>
            <div
                :class="$style['add-clone']"
                key="clone-grid"
                role="clone-grid"
                @click="handleAddClone"
                data-render-drag="disabled">
                <img src="../../../../images/svg/add-line.svg" />
            </div>
        </template>
        <div
            v-if="isShowActiveBtn"
            :class="$style['active-btn']">
            选中行
        </div>
    </div>
</template>
<script>
    import LC from '@/element-materials/core'
    import ResolveComponent from '../resolve-component'

    export default {
        name: 'render-grid',
        components: {
            ResolveComponent
        },
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                isShowActiveBtn: false
            }
        },
        created () {
            this.spanTotalNumsMemo = 0
            this.updateChildColumn()

            const updateCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId
                    || (
                        event.target.type === 'render-column'
                        && event.target.parentNode.componentId === this.componentData.componentId
                    )) {
                    this.$forceUpdate()
                    this.updateChildColumn()
                }
            }
            const activeCallback = event => {
                this.isShowActiveBtn = event.target.parentNode === this.componentData
            }
            const activeClearCallback = () => {
                this.isShowActiveBtn = false
            }
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', activeClearCallback)

            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', activeClearCallback)
            })
        },
        methods: {
            updateChildColumn () {
                const columnNodeList = this.componentData.children
                const spanTotalNums = columnNodeList.reduce((result, columnNode) => {
                    return result + columnNode.prop.span
                }, 0)
                if (this.spanTotalNumsMemo === spanTotalNums) {
                    return
                }
                
                this.spanTotalNumsMemo = spanTotalNums
                columnNodeList.forEach(node => {
                    const renderWidth = `${Number((node.prop.span / spanTotalNums * 100).toFixed(4))}%`
                       
                    if (node.style.width !== renderWidth) {
                        node.setStyle('width', renderWidth)
                    }
                })
            },
            /**
             * @desc 克隆 grid——只克隆布局,数据树结构不克隆
             */
            handleAddClone () {
                const gridNode = LC.createNode('render-grid', false)
                this.componentData.children.forEach(() => {
                    gridNode.appendChild(LC.createNode('render-column'))
                })
                this.componentData.parentNode.insertAfter(gridNode, this.componentData)
            },
            /**
             * @desc 添加栅格
             */
            handleAddColumn () {
                if (this.componentData.children.length >= 12) {
                    this.messageWarn('最多支持12栅格')
                    return
                }
                this.componentData.appendChild(LC.createNode('render-column'))
            }
        }
    }
</script>
<style lang="postcss" module>
    .grid{
        position: relative;
        display: flex;
        /* 如果基础的 slot 可以拖拽需要设置这个屏蔽掉基础组件上面的 pointer-events: none 效果 */
        pointer-events: all;

        .col {
            border: 1px dashed #ccc;
            &:nth-child(n + 1) {
                border-right: none;
            }
            &:last-child{
                border-right: 1px dashed #ccc;
            }
        }

        .add-column,
        .add-clone {
            position: absolute;
            width: 20px;
            height: 20px;
            font-size: 14px;
            color: #fff;
            text-align: center;
            line-height: 19px;
            border-radius: 50%;
            background: #3A84FF;
            cursor: pointer;
            pointer-events: all;
            img {
                position: absolute;
                transform: translate(-50%, -50%);
                top: 50%;
                left: 50%;
                width: 14px;
                height: 14px;
            }
        }
        .add-column {
            top: 50%;
            right: -10px;
            transform: translateY(-50%);
            z-index: 11;
        }
        .add-clone {
            bottom: -9px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 11;
        }
        .active-btn {
            position: absolute;
            top: 0;
            left: -22px;
            z-index: 11;
            bottom: 0;
            display: flex;
            align-items: center;
            width: 20px;
            font-size: 12px;
            color: #fff;
            background: #3A84FF;
            border-radius: 2px;
            text-align: center;
            cursor: pointer;
            pointer-events: all;
        }
    }
</style>
