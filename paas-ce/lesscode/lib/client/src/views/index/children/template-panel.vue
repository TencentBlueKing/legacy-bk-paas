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
    <section style="height:100%" v-bkloading="{ isLoading }">
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
            <div class="search-bar">
                <component-search :key="templateTabsCurrentRefresh" :source="renderTemplateList" :result.sync="searchResult" search-type="template" />
            </div>
        </div>
        <div class="sidebar-bd">
            <div class="component-panel-base">
                <section v-if="renderTemplateList.length">
                    <template v-for="(group, groupIndex) in renderGroupTemplateList">
                        <div
                            :key="groupIndex"
                            :class="getComponentGroupClass(group.id, groupIndex)"
                            v-show="!searchResult || (searchResult && (group.id === searchResult.categoryId || group.id === searchResult.offcialType))"
                        >
                            <div class="group-title" :title="group.categoryName" @click="handleCompGroupFold(group.id)">
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
                                    filter=".uninstall"
                                    @choose="onChoose($event, group.list)"
                                    @end="sourceAreaEndHandler">
                                    <template>
                                        <div v-for="(template, templateIndex) in group.list" class="template-item" :class="{ 'uninstall': type === 'market' && !template.hasInstall }" :key="templateIndex"
                                            v-show="!searchResult || template.id === searchResult.id">
                                            <div class="item-img">
                                                <img :src="template.previewImg" />
                                                <div class="mask" v-if="type === 'market' && !template.hasInstall">
                                                    <bk-button class="apply-btn" theme="primary" size="small" @click.stop="handleApply(template)">应用</bk-button>
                                                </div>
                                            </div>

                                            <div class="item-info" :title="template.templateName">
                                                <span class="item-name">{{ template.templateName }}</span>
                                                <span class="preview" @click="handlePreview(template.id)">预览</span>
                                            </div>
                                        </div>
                                    </template>
                                </vue-draggable>
                            </div>
                        </div>
                    </template>
                </section>
                <section v-else>
                    <bk-exception
                        class="group-empty"
                        type="empty"
                        scene="part">
                        <span>暂无模板</span>
                    </bk-exception>
                </section>
            </div>
        </div>
        <template-edit-dialog ref="templateApplyDialog" action-type="apply" :refresh-list="initTemplates"></template-edit-dialog>
    </section>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import componentSearch from './component-search.vue'
    import templateEditDialog from '@/views/project/template-manage/components/template-edit-dialog'
    import { PAGE_TEMPLATE_TYPE } from '@/common/constant'
    import { bus } from '@/common/bus'

    export default {
        name: 'template-panel',
        components: {
            componentSearch,
            templateEditDialog
        },
        props: {
            dragingComponent: {
                type: Object,
                default: null
            }
        },
        data () {
            return {
                isLoading: false,
                curDragingComponent: this.dragingComponent,
                type: 'project',
                marketTemplateGroups: PAGE_TEMPLATE_TYPE,
                projectTemplateList: [],
                marketTemplateList: [],
                projectTemplateGroupList: [],
                marketTemplateGroupList: [],
                templateTabs: {
                    list: [
                        { name: 'project', label: '项目模板', active: true },
                        { name: 'market', label: '模板市场', active: false }
                    ]
                },
                templateTabsCurrentRefresh: +new Date(),
                searchResult: null,
                templateGroupFolded: {}
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
            },
            renderTemplateList () {
                return this.type === 'project' ? this.projectTemplateList : this.marketTemplateList
            }
        },
        created () {
            this.initTemplates()
            bus.$on('update-template-list', this.initTemplates)
        },
        methods: {
            ...mapMutations('drag', [
                'setDraggableSourceGroup',
                'setFreeLayoutItemPlaceholderPointerEvents',
                'setCurSelectedComponentData'
            ]),
            async initTemplates () {
                try {
                    this.isLoading = true
                    const [projectTemplateGroups, projectTemplateList, tmpMarketTemplateList] = await Promise.all([
                        this.$store.dispatch('pageTemplate/categoryList', { projectId: this.projectId }),
                        this.$store.dispatch('pageTemplate/list', { projectId: this.projectId }),
                        this.$store.dispatch('pageTemplate/list', { type: 'OFFCIAL' })
                    ])
                    const marketTemplateList = tmpMarketTemplateList.map(item => ({
                        ...item,
                        hasInstall: projectTemplateList.filter(template => template.parentId === item.id).length > 0
                    }))
                    this.projectTemplateGroupList = projectTemplateGroups.map(item => ({
                        id: item.id,
                        categoryName: item.name,
                        list: projectTemplateList.filter(template => template.categoryId === item.id)
                    }))
                    this.marketTemplateGroupList = this.marketTemplateGroups.map(item => ({
                        id: item.id,
                        categoryName: item.name,
                        list: marketTemplateList.filter(template => template.offcialType === item.id)
                    }))
                    this.projectTemplateList = projectTemplateList
                    this.marketTemplateList = marketTemplateList
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.isLoading = false
                }
            },
            handleToggleTab (tab) {
                this.templateTabsCurrentRefresh = +new Date()
                this.type = tab.name || 'project'
            },
            onChoose (e, list) {
                const contentStr = list[e.oldIndex] && list[e.oldIndex].content
                const node = JSON.parse(contentStr)
                this.curDragingComponent = this.$td().cloneNode(node, true)
                
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
            },

            sourceAreaEndHandler (e) {
                this.setFreeLayoutItemPlaceholderPointerEvents('none')
            },

            getComponentGroupClass (groupId, groupIndex) {
                return [
                    'component-group',
                    {
                        'first': groupIndex === 0,
                        'folded': this.templateGroupFolded[groupId],
                        'search-show': this.searchResult && (groupId === this.searchResult.categoryId || groupId === this.searchResult.offcialType)
                    }
                ]
            },

            handleCompGroupFold (groupId) {
                this.$set(this.templateGroupFolded, groupId, !this.templateGroupFolded[groupId])
            },

            handlePreview (templateId) {
                window.open(`/preview-template/project/${this.projectId}/${templateId}`, '_blank')
            },

            handleApply (template) {
                this.$refs.templateApplyDialog.isShow = true
                this.$refs.templateApplyDialog.templateId = template.id
                this.$refs.templateApplyDialog.fromTemplate = template
                this.$refs.templateApplyDialog.dialog.formData = {
                    categoryId: '',
                    belongProjectId: this.projectId,
                    templateName: template.templateName
                }
            }
        }
    }
</script>

<style lang="postcss" scoped>
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
            .item-img {
                .mask .apply-btn {
                    display: block;
                }
            }
            .item-info {
                .item-name {
                    width: 90px;
                }
                .preview {
                    display: block;
                }
            }
        }
        .item-img {
            position: relative;
            width: 100%;
            height: 81px;
            img {
                width: 100%;
                height: 100%;
            }
            .mask {
                display: flex;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.1);
                align-items: center;
                .apply-btn {
                    display: none;
                    margin-left: 32px;
                }
            }
        }
        .item-info {
            display: flex;
            justify-content: space-between;
            padding: 4px 8px;
            font-size: 12px;
            .item-name {
                color: #63656e;
                width: 120px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .preview {
                display: none;
                color: #3a84ff;
                cursor: pointer;
            }
        }
    }
</style>
