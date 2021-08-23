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
    <section>
        <div class="sidebar-hd">
            <ul class="category-tabs">
                <li
                    v-for="(tab, index) in templateTabs.list"
                    :class="['tab-item', { active: tab.name === type }]"
                    :key="index"
                    @click.stop.prevent="handleToggleTab(tab)">
                    <template>
                        <span class="tab-item-label">{{tab.label}}</span>
                    </template>
                </li>
            </ul>
        </div>
        <div class="sidebar-bd">
            <!-- <div class="search-bar">
                <component-search :key="templateTabsCurrentRefresh" :source="componentConfigList" :result.sync="componentSearchResult" />
            </div> -->
            <div class="component-panel-base">
                <template v-for="(group, groupIndex) in renderGroupTemplateList">
                    <div
                        :key="groupIndex"
                        class="component-group">
                        <div class="group-title" :title="group.categoryName">
                            <i class="bk-drag-icon bk-drag-arrow-down"></i>
                            {{group.categoryName}}
                        </div>
                        <div class="group-content">
                            <vue-draggable
                                class="source-drag-area component-list template-list"
                                ghost-class="source-ghost"
                                chosen-class="source-chosen"
                                drag-class="source-drag"
                                :list="group.list"
                                :sort="false"
                                :group="draggableSourceGroup"
                                :force-fallback="false"
                                :clone="cloneFunc"
                                @choose="onChoose($event, group.list)"
                                @end="sourceAreaEndHandler">
                                <template>
                                    <div v-for="(template, templateIndex) in group.list" class="template-item" :class="placeholderElemDisplay" :key="templateIndex">
                                        <div class="item-img"><img :src="template.previewImg" /></div>
                                        <div class="item-name" :title="template.templateName">{{ template.templateName }}</div>
                                    </div>
                                </template>
                            </vue-draggable>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script>
    // import componentPanelMixin from './component-panel-mixin'
    import { mapGetters, mapMutations } from 'vuex'
    // import targetDataUtil from '@/common/targetData.js'

    export default {
        name: 'template-panel',
        // mixins: [componentPanelMixin],
        props: {
            dragingComponent: {
                type: Object,
                default: null
            }
        },
        data () {
            return {
                curDragingComponent: this.dragingComponent,
                type: 'project',
                projectTemplateGroupList: [],
                marketTemplateGroupList: [],
                templateTabs: {
                    list: [
                        { name: 'project', label: '项目模板', active: true },
                        { name: 'market', label: '模板市场', active: false }
                    ]
                },
                placeholderElemDisplay: ''
            }
        },
        computed: {
            ...mapGetters('drag', [
                'draggableSourceGroup',
                'targetData'
            ]),
            projectId () {
                return this.$route.params.projectId
            },
            renderGroupTemplateList () {
                return this.type === 'project' ? this.projectTemplateGroupList : this.marketTemplateGroupList
            }
        },
        created () {
            this.init()
        },
        methods: {
            ...mapMutations('drag', [
                'setDraggableSourceGroup',
                'setFreeLayoutItemPlaceholderPointerEvents',
                'setCurSelectedComponentData'
            ]),
            async init () {
                this.projectTemplateGroupList = await this.$store.dispatch('pageTemplate/listByCategory', {
                    projectId: this.projectId
                })
                this.marketTemplateGroupList = []
                console.log(this.renderGroupTemplateList, 2341)
            },
            handleToggleTab (tab) {
                this.type = tab.name || 'project'
            },
            onChoose (e, list) {
                const contentStr = list[e.oldIndex] && list[e.oldIndex].content
                const node = JSON.parse(contentStr)
                this.curDragingComponent = this.$td().cloneNode(node, true)
                
                this.placeholderElemDisplay = 'block'
                this.$emit('update:dragingComponent', this.curDragingComponent)
 
                const dragableSourceGroup = Object.assign({}, this.draggableSourceGroup, {
                    name: this.curDragingComponent.type || 'render-grid'
                })

                this.setDraggableSourceGroup(dragableSourceGroup)
            },
            cloneFunc () {
                return this.curDragingComponent
            },
            sourceAreaStartHandler (e) {
                this.setFreeLayoutItemPlaceholderPointerEvents('all')
                console.log('sourceAreaStartHandler', e, this.curDragingComponent)
            },

            sourceAreaEndHandler (e) {
                this.placeholderElemDisplay = ''
                this.setFreeLayoutItemPlaceholderPointerEvents('none')
                console.warn('sourceAreaEndHandler', this.curDragingComponent)
                console.warn('left to right end, targetData: ', this.targetData)
                console.warn('左侧面板拖动 grid 和 component 到画布中 end', e)
            }
        }
    }
</script>

<style lang="postcss">
    .category-tabs .tab-item {
        flex: 1;
        text-align: center;
    }
    .template-list {
        padding: 12px 0 0 10px !important;
    }
    .template-item {
        margin-bottom: 10px;
        margin-right: 8px;
        cursor: pointer;
        width: 136px;
        height: 111px;
        background: #ffffff;
        border: 1px solid #dcdee5;
        border-radius: 3px;

        &:hover {
            border: 1px solid #3a84ff;
        }
        .item-img img {
            width: 100%;
            height: 81px;
        }
        .item-name {
            padding: 4px 8px;
            color: #63656e;
            font-size: 12px;
            width: 120px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
