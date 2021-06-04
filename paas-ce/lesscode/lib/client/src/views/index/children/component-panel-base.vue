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
    <div class="component-panel-base">
        <template v-for="(group, groupIndex) in componentGroupList">
            <div
                v-show="isShowComponentGroup(group)"
                :key="groupIndex"
                :class="getComponentGroupClass(group, groupIndex)">
                <div class="group-title" :title="group" @click="handleCompGroupFold(group)">
                    <i class="bk-drag-icon bk-drag-arrow-down"></i>
                    {{group}}
                </div>
                <div class="group-content">
                    <vue-draggable
                        class="source-drag-area component-list"
                        :list="componentGroups[group]"
                        :sort="false"
                        :group="draggableSourceGroup"
                        :force-fallback="false"
                        ghost-class="source-ghost"
                        chosen-class="source-chosen"
                        drag-class="source-drag"
                        :move="onMove"
                        :clone="cloneFunc"
                        @start="sourceAreaStartHandler"
                        @choose="onChoose($event, group)"
                        @end="sourceAreaEndHandler">
                        <template v-if="type === 'base'">
                            <!-- @mouseenter="handleComponentMouseenter($event, component)" -->
                            <div v-for="(component, componentIndex) in componentGroups[group]" class="component-item" @dragstart="dragstartHandler" :class="placeholderElemDisplay" :key="componentIndex"
                                v-show="!searchResult || component.displayName === searchResult.displayName"
                                v-bk-tooltips="{ content: component.displayName, disabled: !(component.displayName && component.displayName.length > 8) }">
                                <div class="component-icon">
                                    <i class="bk-drag-icon" :class="component.icon"></i>
                                </div>
                                <div class="component-name" v-if="component.displayName">{{component.displayName}}</div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="icon-item" v-for="(component, componentIndex) in componentGroups[group]" @dragstart="dragstartHandler" :key="componentIndex"
                                v-show="!searchResult || component.name === searchResult.name">
                                <bk-icon :type="component.icon"></bk-icon>
                            </div>
                        </template>
                    </vue-draggable>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import componentPanelMixin from './component-panel-mixin'

    export default {
        name: 'component-panel-base',
        mixins: [componentPanelMixin],
        props: {
            componentGroupList: {
                type: Array,
                default: () => []
            },
            type: {
                type: String,
                default: ''
            }
        },
        computed: {
        },
        created () {
        },
        methods: {
        }
    }
</script>

<style lang="postcss">
    .component-panel-base {
        .icon-item {
            display: inline-block;
            cursor: pointer;
            width: 36px;
            height: 36px;
            background-color: #fafbfd;
            color: #979ba5;
            text-align: center;
            font-size: 16px;
            line-height: 36px;
            margin-right: 12px;
            margin-bottom: 10px;
            &:hover {
                background: #3A84FF;
                color: #FFF;
            }
            &:nth-child(6n) {
                margin-right: 0;
            }
        }
    }
</style>
