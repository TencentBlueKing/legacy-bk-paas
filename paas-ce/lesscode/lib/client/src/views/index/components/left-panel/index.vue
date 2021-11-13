<template>
    <aside
        id="editPageLeftSideBar"
        class="main-left-sidebar"
        :class="{
            'is-collapse': isCollapse
        }">
        <div class="main-left-side-nav">
            <ul class="nav-tabs">
                <li v-for="(item, index) in leftNavTabList"
                    class="nav-item"
                    :class="{
                        active: item.name === activeSideNav
                    }"
                    :key="index"
                    v-bk-tooltips="item.label"
                    :data-name="item.name"
                    @click="activeSideNav = item.name">
                    <i :class="['bk-drag-icon', item.icon]">
                        <i v-if="item.redPoint" class="red-point"></i>
                    </i>
                </li>
            </ul>
        </div>
        <div
            v-if="activeSideNav === 'nav-tab-component'"
            class="sidebar-panel">
            <div class="sidebar-hd">
                <ul class="category-tabs">
                    <li
                        v-for="(tab, index) in componentTabs.list"
                        class="tab-item"
                        :class="{ active: tab.active }"
                        :key="index"
                        @click.stop.prevent="handleToggleCompTab(index)">
                        <template v-if="tab.name === 'base'">
                            <bk-dropdown-menu
                                v-if="tab.name === 'base'"
                                class="toggle-component"
                                ref="dropdownMenuComp"
                                trigger="click"
                                @show="isShowToggleComponentLib = true"
                                @hide="isShowToggleComponentLib = false">
                                <div slot="dropdown-trigger" class="dropdown-trigger-text">
                                    <span
                                        v-if="curComponentLib === 'bk'"
                                        class="tab-item-label"
                                        title="蓝鲸Vue组件库">
                                        蓝鲸Vue组件库
                                    </span>
                                    <span
                                        v-else-if="curComponentLib === 'element'"
                                        class="tab-item-label"
                                        title="element">
                                        element-ui
                                    </span>
                                    <i
                                        class="bk-drag-icon toggle-icon"
                                        :class="isShowToggleComponentLib ? 'bk-drag-angle-down-fill' : 'bk-drag-angle-up-fill'" />
                                </div>
                                <ul class="bk-dropdown-list" slot="dropdown-content">
                                    <li :class="curComponentLib === 'bk' ? 'selected' : ''">
                                        <a
                                            href="javascript:;"
                                            @click.stop.prevent="toggleComponentLib('bk')">
                                            蓝鲸Vue组件库
                                            <i
                                                v-bk-tooltips="{
                                                    content: tab.tips,
                                                    placements: ['bottom-end']
                                                }"
                                                class="bk-drag-icon bk-drag-vesion-fill" />
                                        </a>
                                    </li>
                                    <li :class="curComponentLib === 'element' ? 'selected' : ''">
                                        <a
                                            href="javascript:;"
                                            @click.stop.prevent="toggleComponentLib('element')">
                                            element-ui
                                            <i
                                                v-bk-tooltips="{
                                                    content: elementUiTips,
                                                    placements: ['bottom-end']
                                                }" class="bk-drag-icon bk-drag-vesion-fill" />
                                        </a>
                                    </li>
                                </ul>
                            </bk-dropdown-menu>
                        </template>
                        <template v-else>
                            <span class="tab-item-label">{{tab.label}}</span>
                        </template>
                    </li>
                </ul>
                <div class="search-bar">
                    <component-search
                        :key="componentTabsCurrentRefresh"
                        :source="componentConfigList"
                        :result.sync="componentSearchResult" />
                </div>
            </div>
            <div class="sidebar-bd">
                <component
                    :key="componentTabsCurrentRefresh"
                    :is="componentTabs.current.component"
                    :search-result="componentSearchResult"
                    :draging-component.sync="curDragingComponent"
                    @setCurSelectedComponent="setTreeSelected"
                    v-bind="componentTabs.current.props">
                </component>
            </div>
        </div>
        <div
            v-show="activeSideNav === 'nav-tab-template'"
            class="sidebar-panel">
            <template-panel :draging-component.sync="curDragingComponent" />
        </div>
        <div
            v-show="activeSideNav === 'nav-tab-tree'"
            class="sidebar-panel">
            <component-tree ref="componentTree" />
        </div>
        <i
            class="bk-drag-icon bk-drag-angle-left collapse-icon"
            v-bk-tooltips.right="{
                content: '查看所有组件',
                disabled: !isCollapse
            }"
            @click="handleCollapseSide">
        </i>
    </aside>
</template>
<script>
    import Vue from 'vue'
    import iconComponentList from '@/element-materials/materials/icon-list.js'
    import allComponentConf from '@/element-materials/materials'
    import ComponentCustomPanel from '../../children/component-panel-custom'
    import ComponentBasePanel from '../../children/component-panel-base'
    import ComponentSearch from '../../children/component-search'
    import ComponentTree from '../../children/component-tree'
    import TemplatePanel from '../../children/template-panel.vue'

    export default {
        name: '',
        components: {
            [ComponentCustomPanel.name]: ComponentCustomPanel,
            [ComponentBasePanel.name]: ComponentBasePanel,
            ComponentSearch,
            ComponentTree,
            TemplatePanel
        },
        data () {
            const baseComponentList = Object.freeze(allComponentConf['bk'])

            return {
                isCollapse: false,
                activeSideNav: 'nav-tab-component',
                isShowToggleComponentLib: false,
                curComponentLib: 'bk',
                baseComponentList: baseComponentList,
                componentTabsCurrentRefresh: Date.now(),
                componentSearchResult: null,
                componentTabs: {
                    list: [
                        {
                            name: 'base',
                            label: '基础组件',
                            active: true,
                            tips: '当前组件库版本为“latest”，<a target="_blank" href="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/changelog" style="cursor: pointer;color: #3a84ff">查看更新日志</a>'
                        },
                        {
                            name: 'custom',
                            label: '自定义组件',
                            active: false
                        },
                        {
                            name: 'icon',
                            label: '图标',
                            active: false
                        }
                    ],
                    current: {
                        component: ComponentBasePanel.name,
                        props: {
                            componentList: baseComponentList,
                            componentGroupList: allComponentConf['bkComponentGroupList'],
                            type: 'base',
                            loading: true
                        }
                    }
                },
                panelMap: {
                    base: {
                        component: ComponentBasePanel.name,
                        props: {
                            componentList: baseComponentList,
                            componentGroupList: allComponentConf['bkComponentGroupList'],
                            type: 'base'
                        }
                    },
                    custom: {
                        component: ComponentCustomPanel.name,
                        props: {
                            componentList: [],
                            componentGroupList: [],
                            type: 'custom',
                            loading: true
                        }
                    },
                    icon: {
                        component: ComponentBasePanel.name,
                        props: {
                            componentList: iconComponentList,
                            componentGroupList: ['小图标', '填充图标', '线性图标'],
                            type: 'icon'
                        }
                    }
                }
            }
        },
        computed: {
            componentConfigList () {
                return this.componentTabs.current.props.componentList
            }
        },
        watch: {
            curComponentLib (curComponentLib) {
                this.componentTabs.current.props.componentList = this.baseComponentList
                this.componentTabs.current.props.componentGroupList = allComponentConf[`${curComponentLib}ComponentGroupList`]

                this.panelMap.base.props.componentList = this.baseComponentList
                this.panelMap.base.props.componentGroupList = allComponentConf[`${curComponentLib}ComponentGroupList`]
            }
        },
        created () {
            this.curDragingComponent = null

            this.elementUiTips = '当前组件库版本为“2.15.1”，<a target="_blank" href="https://github.com/ElemeFE/element/releases" style="cursor: pointer;color: #3a84ff">查看更新日志</a>'
            
            this.leftNavTabList = [
                {
                    icon: 'bk-drag-custom-comp-default',
                    name: 'nav-tab-component',
                    label: {
                        content: '组件库',
                        placement: 'right',
                        interactive: false
                    }
                },
                {
                    icon: 'bk-drag-template-fill',
                    name: 'nav-tab-template',
                    redPoint: true,
                    label: {
                        content: '模板库',
                        placement: 'right',
                        interactive: false
                    }
                },
                {
                    icon: 'bk-drag-level-down',
                    name: 'nav-tab-tree',
                    label: {
                        content: '页面组件树',
                        placement: 'right',
                        interactive: false
                    }
                }
            ]
        },
        methods: {
            registerCustomComponent () {
                const ExtraGroup = {
                    Favourite: '我的收藏',
                    Public: '其他项目公开的组件'
                }
                // 包含所有的自定组件
                window.__innerCustomRegisterComponent__ = {}
                const script = document.createElement('script')
                script.src = `/${parseInt(this.$route.params.projectId)}/${parseInt(this.$route.params.pageId)}/component/register.js`
                script.onload = () => {
                    const allCustomComponentList = []
                    window.customCompontensPlugin.forEach((callback) => {
                        const [
                            config,
                            componentSource,
                            baseInfo
                        ] = callback(Vue)
                        window.__innerCustomRegisterComponent__[config.type] = componentSource
                        allCustomComponentList.push({
                            ...config,
                            group: baseInfo.category,
                            meta: baseInfo
                        })
                    })

                    const publicList = []
                    const otherList = []
                    for (const comp of allCustomComponentList) {
                        if (comp.meta.offline) {
                            continue
                        }
                        if (comp.meta.isPublic) {
                            publicList.push({
                                ...comp,
                                group: ExtraGroup.Public
                            })
                        } else {
                            otherList.push(comp)
                        }
                    }
                    const customComponentList = Object.freeze([...otherList, ...publicList])
                    if (this.componentTabs.current.props.type === 'custom') {
                        this.componentTabs.current.props.componentList = customComponentList
                        this.componentTabs.current.props.loading = false
                    }
                    this.$emit('on-custom-component-loaded')
                }
                document.body.appendChild(script)
                this.$once('hook:beforeDestroy', () => {
                    document.body.removeChild(script)
                })
            },
            handleCollapseSide () {
                this.isCollapse = !this.isCollapse
            },
            handleToggleCompTab (index) {
                const currentTab = this.componentTabs.list[index]
                this.componentTabs.list.forEach(item => (item.active = false))
                currentTab.active = true

                const key = currentTab.name
                this.componentTabs.current.component = this.panelMap[key].component
                this.componentTabs.current.props = this.panelMap[key].props
                if (key === 'custom') {
                    this.componentTabs.current.props.componentList = this.customComponentList
                    this.componentTabs.current.props.loading = this.isCustomComponentLoading
                }

                if (key !== 'base') {
                    this.componentSearchResult = null
                }
            },
            toggleComponentLib (libName) {
                this.$refs.dropdownMenuComp[0].hide()
                if (this.curComponentLib === libName) {
                    return
                }
                this.curComponentLib = libName
                this.baseComponentList = Object.freeze(allComponentConf[libName])
                this.componentTabsCurrentRefresh = Date.now()
                this.componentSearchResult = null
            },
            setTreeSelected (id) {
                this.$refs.tree.setTreeSelected(id)
            }
        }
    }
</script>
<style lang="postcss">
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .main-left-sidebar {
        .sidebar-panel {
            overflow: hidden;
            height: 100%;
            width: calc(100% - 42px)
        }
        .sidebar-hd {
            .toggle-component {
                .bk-dropdown-list {
                    white-space: normal;
                    line-height: 1;
                    li {
                        a {
                            font-size: 14px;
                        }
                        &.selected {
                            background-color: #f4f6fa;
                            a {
                                color: #3a84ff;
                            }
                        }
                    }
                    .bk-drag-vesion-fill {
                        margin-left: 7px;
                    }
                }
            }
            .category-tabs {
                display: flex;
                height: 46px;
                border-bottom: 1px solid #ccc;
                padding: 0 20px;

                .tab-item {
                    font-size: 14px;
                    padding: 0 8px;
                    margin-right: 4px;
                    height: 46px;
                    line-height: 46px;
                    white-space: nowrap;
                    cursor: pointer;
                    &:hover {
                        color: #3A84FF;
                    }
                    &.active {
                        color: #3A84FF;
                        border-bottom: 2px solid #3A84FF;
                    }
                    &:last-child {
                        margin-right: 0;
                    }
                    .tab-item-label {
                        font-size: 14px;
                        @mixin ellipsis 96px;
                    }
                    .toggle-icon {
                        line-height: 46px;
                        overflow: hidden;
                        display: inline-block;
                    }
                }
            }

            .search-bar {
                padding: 12px 20px;
                border-bottom: 1px solid #DCDEE5;
            }
        }
        .sidebar-bd {
            @mixin scroller;
            height: calc(100% - 104px);
            overflow-y: overlay;

            .component-group {
                .group-title {
                    position: relative;
                    height: 40px;
                    line-height: 38px;
                    font-size: 14px;
                    background: #F5F6FA;
                    color: #63656E;
                    padding-left: 42px;
                    padding-right: 16px;
                    border-top: 1px solid #DCDEE5;
                    border-bottom: 1px solid #DCDEE5;
                    cursor: pointer;
                    @mixin ellipsis 100%, block;

                    .bk-drag-arrow-down {
                        position: absolute;
                        top: 7px;
                        left: 16px;
                        font-size: 24px;
                        color: #979BA5;
                        transition: all .1s linear;
                    }
                }
                .group-content {
                    .group-empty {
                        padding: 0 0 12px 0;
                        margin-top: -28px;
                        .bk-exception-img.part-img {
                            height: 80px;
                        }
                        .bk-exception-text.part-text {
                            font-size: 12px;
                            margin-top: -8px;
                        }
                    }
                }

                .component-list {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 10px 12px 0 12px;
                    .component-item {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 60px;
                        height: 68px;
                        color: #979BA5;
                        border: 1px solid #DCDEE5;
                        border-radius: 2px;
                        background: #FAFBFD;
                        margin-right: 12px;
                        margin-bottom: 10px;
                        cursor: pointer;
                        &:nth-of-type(4n) {
                            margin-right: 0;
                        }

                        &:hover {
                            border: 1px solid #3A84FF;
                            background: #3A84FF;
                            color: #FFF;
                            .component-introduction,
                            .favorite-btn {
                                opacity: 1;
                            }
                        }
                        &.favorite {
                            .favorite-btn {
                                opacity: 1;
                            }
                        }

                        .component-icon {
                            margin: 11px 0 2px 0;
                            .bk-drag-icon {
                                font-size: 16px;
                            }
                        }
                        .component-name {
                            font-size: 12px;
                            flex: none;
                            padding: 0 5px;
                            margin-top: 1px;
                            @mixin ellipsis 100%, -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            word-break: break-all;
                            white-space: normal;
                        }
                        .component-introduction,
                        .favorite-btn {
                            position: absolute;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            top: -1px;
                            width: 16px;
                            height: 16px;
                            border-radius: 2px;
                            opacity: 0;
                            transition: all .125s ease;
                            .bk-icon,
                            .bk-drag-icon {
                                font-size: 12px;
                                transform: scale(0.9);
                            }
                            .bk-drag-favorite {
                                color: #FE9C00;
                            }
                            &:hover {
                                background: #0E52C2;
                            }
                        }
                        .component-introduction{
                            left: -1px;
                            .bk-drag-icon {
                                color: #fff;
                            }
                        }
                        .favorite-btn{
                            right: -1px;
                        }
                    }
                }

                &.first,
                &.search-show {
                    .group-title {
                        border-top: none;
                        padding-top: 1px;
                    }
                }

                &.folded {
                    margin-bottom: 8px;

                    .group-content {
                        display: none;
                    }

                    .group-title {
                        .bk-drag-arrow-down {
                            transform: rotate(-90deg);
                            top: 8px;
                        }
                    }
                }

                &.public {
                    margin-bottom: 30px;
                    .group-title {
                        position: relative;
                        &::before {
                            content: "";
                            position: absolute;
                            left: 0;
                            top: 0;
                            border-top: 26px solid #3A84FF;
                            border-right: 26px solid transparent;
                        }
                        .tag-name {
                            position: absolute;
                            top: 0;
                            left: 0;
                            font-size: 12px;
                            color: #fff;
                            line-height: normal;
                            transform: scale(0.65) rotate(-45deg) translate(-5px, -5px);
                        }
                    }

                    .group-content {
                        .group-empty {
                            padding: 0;
                            margin-top: 0;
                        }
                    }
                }
            }
        }
    }
</style>
