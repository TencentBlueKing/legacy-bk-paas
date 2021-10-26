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
        :class="$style['col']"
        :style="componentData.style">
        <draggable
            :sort="true"
            :list="componentData.slot.default"
            :component-data="componentData"
            :group="{
                name: groupType,
                pull: true,
                put: [
                    'render-grid',
                    'free-layout',
                    'component'
                ]
            }">
            <resolve-component
                v-for="slotComponentData in componentData.slot.default"
                :key="slotComponentData.renderKey"
                :component-data="slotComponentData" />
        </draggable>
    </div>
</template>

<script>
    import Draggable from '../components/draggable'
    import ResolveComponent from '../resolve-component'

    export default {
        name: 'render-col',
        components: {
            Draggable,
            ResolveComponent
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        inject: ['renderGrid'],
        data () {
            return {
                groupType: 'component'
            }
        },
        
        created () {
            this.calcStyle()
        },
        updated () {
            console.log('**************** col update **************', this.componentData.componentId)
        },
        methods: {
            calcStyle () {
                const siblingList = this.componentData.parentNode.children
                const gridSpanNums = siblingList.reduce((result, columnNode) => {
                    result += columnNode.prop.span
                    return result
                }, 0)
                const selfSpanNums = this.componentData.prop.span
                
                this.componentData.setStyle('width', `${Number((selfSpanNums / gridSpanNums * 100).toFixed(4))}%`)
            }
        }
    }
</script>

<style lang="postcss" module>
    .col {
        float: left;
        border: 1px dashed #ccc;
        ~ .col {
            border-left: none;
        }
    }
</style>
