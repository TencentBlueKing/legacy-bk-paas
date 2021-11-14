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
    <div class="component-panel-custom" v-bkloading="{ isLoading: isLoading, opacity: 1 }">
        <div v-show="!isLoading">
            <template v-show="componentGroupList.length">
                <div
                    v-for="(group, groupIndex) in componentGroupList"
                    v-show="isShowComponentGroup(group)"
                    :key="groupIndex"
                    :class="[getComponentGroupClass(group, groupIndex), ({ [ExtraGroup.Favourite]: 'favourite', [ExtraGroup.Public]: 'public' })[group]]">
                    <div class="group-title" :title="group" @click="handleCompGroupFold(group)">
                        <span v-if="group === ExtraGroup.Public" class="tag-name">公共</span>
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
                            :clone="cloneFunc"
                            @start="sourceAreaStartHandler"
                            @choose="onChoose($event, group)"
                            @end="sourceAreaEndHandler"
                        >
                            <template v-for="(component, componentIndex) in componentGroups[group]">
                                <div
                                    class="component-item"
                                    :class="[placeholderElemDisplay, { favorite: component.meta && component.meta.favorite }]"
                                    :key="componentIndex"
                                    v-show="!searchResult || component.displayName === searchResult.displayName"
                                    v-bk-tooltips="{
                                        content: component.displayName,
                                        disabled: !(component.displayName && component.displayName.length > 8)
                                    }"
                                    :ref="`component-item_${component.name}_${groupIndex}`">
                                    <div class="component-icon">
                                        <i class="bk-drag-icon" :class="component.icon || 'bk-drag-custom-comp-default'"></i>
                                    </div>
                                    <div class="component-name" v-if="component.displayName">{{component.displayName}}</div>
                                    <div
                                        v-if="group === ExtraGroup.Public"
                                        class="component-introduction"
                                        @mouseenter="handleShowIntroduction(component, $event)"
                                        @mouseleave="handleHideIntroduction">
                                        <i class="bk-icon icon-info-circle" />
                                    </div>
                                    <div
                                        v-if="Object.values(ExtraGroup).includes(group)"
                                        class="favorite-btn"
                                        v-bk-tooltips="{
                                            content: (component.meta && component.meta.favorite) ? '取消收藏' : '添加收藏',
                                            onShow () {
                                                const inst = $refs[`component-item_${component.name}_${groupIndex}`][0].tippyInstance
                                                inst && inst.hide()
                                            }
                                        }"
                                        @click.stop="handleClickFavorite(component)">
                                        <i :class="['bk-drag-icon', `bk-drag-favorite${(component.meta && component.meta.favorite) ? '' : '-o' }`]"></i>
                                    </div>
                                </div>
                            </template>
                        </vue-draggable>
                        <bk-exception
                            v-show="!componentGroups[group] || (componentGroups[group] && !componentGroups[group].length)"
                            class="group-empty"
                            type="empty"
                            scene="part">
                            <span>暂无数据</span>
                        </bk-exception>
                    </div>
                </div>
            </template>
            <bk-exception v-show="!componentGroupList.length" class="exception-wrap-item exception-part" type="empty" scene="part">
                <div>暂无组件或已下架，<bk-link theme="primary" @click="handleCreate">去创建</bk-link></div>
            </bk-exception>
            <div class="fixed-opts">
                <bk-link class="text-link" theme="primary" icon="bk-drag-icon bk-drag-jump-link" @click="handleCreate(true)">新建更多自定义组件</bk-link>
            </div>
            <div style="display: none">
                <div ref="introduction" class="component-introduction-dialog" v-bkloading="{ isLoading: isDiscriptionLoading }">
                    <table>
                        <tr>
                            <td class="label">来源项目：</td>
                            <td>{{ componentIntroduction.projectName }}</td>
                        </tr>
                        <tr>
                            <td class="label">最新版本：</td>
                            <td>{{ componentIntroduction.lastVersion }}</td>
                        </tr>
                        <tr>
                            <td class="label">当前版本：</td>
                            <td>{{ componentIntroduction.version }}</td>
                        </tr>
                        <tr>
                            <td class="label">上传人：</td>
                            <td>{{ componentIntroduction.updateUser }}</td>
                        </tr>
                        <tr>
                            <td class="label">组件简介：</td>
                            <td>{{ componentIntroduction.description }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Tippy from 'bk-magic-vue/lib/utils/tippy'
    import componentPanelMixin from './component-panel-mixin'

    const ExtraGroup = {
        Favourite: '我的收藏',
        Public: '其他项目公开的组件'
    }

    export default {
        name: 'component-panel-custom',
        mixins: [componentPanelMixin],
        props: {
            loading: Boolean
        },
        data () {
            return {
                ExtraGroup,
                favoriteIdList: [],
                contentLoading: true,
                isDiscriptionLoading: false,
                componentIntroduction: {}
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            },
            componentGroups () {
                const favoriteComponentList = []
                this.componentList.forEach(component => {
                    if (this.favoriteIdList.includes(component.meta.id)) {
                        component.meta.favorite = true
                        favoriteComponentList.push({ ...component, group: ExtraGroup.Favourite })
                    } else {
                        component.meta.favorite = false
                    }
                })
                const componentGroups = {
                    [ExtraGroup.Favourite]: favoriteComponentList
                }
                this.componentList.forEach(component => {
                    const groupName = component.group
                    const componentGroup = componentGroups[groupName]
                    if (componentGroup) {
                        componentGroup.push(component)
                    } else {
                        componentGroups[groupName] = [component]
                    }
                })
                return componentGroups
            },
            componentGroupList () {
                const componentGroupList = [ExtraGroup.Favourite]
                const groupList = []
                Object.keys(this.componentGroups).forEach(group => {
                    if (!Object.values(ExtraGroup).includes(group)) {
                        const child = this.componentGroups[group][0]
                        const order = child ? child.meta.categoryOrder : -1
                        groupList.push({ group, order })
                    }
                })
                groupList.sort((a, b) => a.order - b.order)
                return componentGroupList.concat([...groupList.map(item => item.group), ExtraGroup.Public])
            },
            isLoading () {
                return this.contentLoading || this.loading
            }
        },
        created () {
            this.fetchFavoriteList()
        },
        methods: {
            async fetchFavoriteList (silent) {
                try {
                    if (!silent) {
                        this.contentLoading = true
                    }
                    const favoriteList = await this.$store.dispatch('components/favoriteList', {
                        projectId: this.projectId
                    })
                    this.favoriteIdList = favoriteList.map(item => item.compId)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.contentLoading = false
                }
            },
            async handleShowIntroduction (component, event) {
                const componentId = component.meta.id
                const componentVersionId = component.meta.versionId
                this.popperInstance = Tippy(event.target, {
                    placement: 'top-start',
                    trigger: 'manual',
                    theme: 'light custom-component-introduction',
                    hideOnClick: false,
                    animateFill: false,
                    animation: 'slide-toggle',
                    lazy: false,
                    ignoreAttributes: true,
                    boundary: 'window',
                    distance: 20,
                    arrow: true,
                    zIndex: window.__bk_zIndex_manager.nextZIndex()
                })
                this.componentIntroduction = {}
                this.isDiscriptionLoading = true
                this.popperInstance.setContent(this.$refs.introduction)
                this.popperInstance.popperInstance.update()
                this.popperInstance.show()
                try {
                    const [componentData, componentVersionData] = await Promise.all([
                        this.$store.dispatch('components/detail', {
                            id: componentId
                        }),
                        this.$store.dispatch('components/versionDetail', {
                            versionId: componentVersionId
                        })
                    ])
                    if (!this.popperInstance) {
                        return
                    }
                    this.componentIntroduction = Object.freeze({
                        ...componentVersionData,
                        lastVersion: componentData.version
                    })
                    setTimeout(() => {
                        this.popperInstance.popperInstance.update()
                    })
                } finally {
                    this.isDiscriptionLoading = false
                }
            },
            handleHideIntroduction () {
                if (this.popperInstance) {
                    this.popperInstance.hide()
                    this.popperInstance.destroy()
                    this.popperInstance = null
                }
            },
            async handleClickFavorite (component) {
                try {
                    const data = {
                        compId: component.meta.id,
                        projectId: this.projectId
                    }
                    if (component.meta.favorite) {
                        await this.$store.dispatch('components/favoriteDelete', { data })
                        this.messageSuccess('取消成功')
                    } else {
                        await this.$store.dispatch('components/favoriteAdd', { data })
                        this.messageSuccess('收藏成功')
                    }

                    // 更新数据状态
                    this.fetchFavoriteList(true)
                } catch (e) {
                    console.error(e)
                }
            },
            handleCreate (newTab) {
                const route = this.$router.resolve({
                    name: 'componentManage',
                    params: {
                        projectId: this.projectId
                    }
                })
                if (newTab) {
                    window.open(route.href, '_blank')
                } else {
                    this.$router.push(route.location)
                }
            }
        }
    }
</script>

<style lang="postcss">
    .component-panel-custom {
        height: 100%;

        .fixed-opts {
            position: fixed;
            bottom: 0;
            background: #FFF;
            width: 300px;
            padding: 4px 14px;

            .text-link {
                .bk-link-text {
                    font-size: 12px;
                }
            }
        }
    }

    .is-collapse {
        .component-panel-custom {
            .fixed-opts {
                display: none;
            }
        }
    }
</style>
