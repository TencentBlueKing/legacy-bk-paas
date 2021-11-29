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
        <render-row
            :ref="componentData.componentId"
            :style="componentData.style">
            <render-col
                v-for="(componentItem, columnIndex) in componentData.slot.default"
                :component-data="componentItem"
                :key="componentItem.componentId"
                :count="getSpanNums()"
                :class="{
                    last: columnIndex === componentData.slot.default.length - 1
                }" />
        </render-row>
        <template v-if="componentData.isActived">
            <div
                :class="$style['add-column']"
                @click="handleAddColumn"
                data-render-drag="disabled">
                <img src="../../../images/svg/add-line.svg" />
            </div>
            <div
                :class="$style['add-clone']"
                @click="handleAddClone"
                data-render-drag="disabled">
                <img src="../../../images/svg/add-line.svg" />
            </div>
        </template>
    </div>
</template>

<script>
    import LC from '@/element-materials/core'
    import renderRow from './row'
    import renderCol from './col'
    import offsetMixin from './offset-mixin'

    export default {
        name: 'render-grid',
        components: {
            renderRow,
            renderCol
        },
        provide () {
            return {
                renderGrid: this
            }
        },
        mixins: [offsetMixin],
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            getSpanNums () {
                return this.componentData.children.reduce((result, columnNode) => {
                    return result + columnNode.prop.span
                }, 0)
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
            },
            /**
             * @desc 克隆 grid，只克隆布局数据树结构不克隆
             */
            handleAddClone () {
                const gridNode = LC.createNode('render-grid')
                this.componentData.children.forEach(() => {
                    gridNode.appendChild(LC.createNode('render-column'))
                })
                this.componentData.parentNode.appendChild(gridNode)
            }
        }
    }
</script>
<style lang="postcss" module>
    .grid{
        position: relative;
        z-index: inherit;
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
            z-index: 1;
        }
        .add-clone {
            bottom: -9px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }
    }
</style>
