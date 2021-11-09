<template>
    <div ref="layout" class="monitor-navigation">
        <bk-navigation
            navigation-type="top-bottom"
            default-open
            :need-menu="isShowSideMenu"
            v-bind="curTemplateData.renderProps || {}">
            <div
                slot="side-header"
                class="component-wrapper"
                style="display: flex"
                @mouseenter.stop="componentWrapperMouseenterHandler"
                @mouseleave.stop="componentWrapperMouseleaveHandler"
                @click.stop="handleSiteInfo">
                <span class="title-icon">
                    <img style="width: 28px; height: 28px" :src="curTemplateData.logo" />
                </span>
                <span class="title-desc">{{ curTemplateData.siteName }}</span>
            </div>
            <template slot="header">
                <div
                    class="navigation-header complex-top-menu-wraper"
                    :class="{
                        selected: isTopMenuSelected
                    }"
                    @click.stop="handleTopMenuClick">
                    <div
                        v-for="(topMemu) in curTemplateData.topMenuList"
                        :key="topMemu.id"
                        class="navigation-header-item"
                        :class="{
                            selected: selectTopMenuId === topMemu.id
                        }"
                        @click.stop="handleTopMenuSelect(topMemu)">
                        {{topMemu.name}}
                    </div>
                </div>
                <bk-popover
                    theme="light lesscode-layout-message"
                    :arrow="false"
                    placement="bottom-start"
                    offset="-20, 10"
                    :tippy-options="{ 'hideOnClick': false }">
                    <div class="message-box">
                        <span>{{ user.username }}</span>
                        <i class="bk-icon icon-down-shape"></i>
                    </div>
                    <template slot="content">
                        <div class="message-item" @click="handleLogout">退出</div>
                    </template>
                </bk-popover>
            </template>
            <template v-if="isShowSideMenu" slot="menu">
                <div
                    class="side-menu-wraper"
                    :class="{
                        selected: isSideMenuSelected
                    }"
                    @click.stop="handleSideMenuClick">
                    <bk-navigation-menu
                        ref="menu"
                        :unique-opened="false"
                        :default-active="navActive"
                        :toggle-active="true">
                        <bk-navigation-menu-item
                            v-for="(menuItem) in currentSideMenuList"
                            ref="item"
                            :key="`${menuItem.id}_${refreshKey}`"
                            :has-child="menuItem.children && !!menuItem.children.length"
                            :icon="menuItem.icon"
                            :id="menuItem.name">
                            <span>{{menuItem.name}}</span>
                            <div slot="child">
                                <bk-navigation-menu-item
                                    v-for="(childrenItem) in menuItem.children"
                                    :key="`${childrenItem.id}`"
                                    :id="childrenItem.pageCode"
                                    default-active>
                                    <span>{{ childrenItem.name }}</span>
                                </bk-navigation-menu-item>
                            </div>
                        </bk-navigation-menu-item>
                    </bk-navigation-menu>
                </div>
            </template>
            <div class="nav-container">
                <slot />
            </div>
        </bk-navigation>
    </div>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex'
    import _ from 'lodash'
    import { bus } from '@/common/bus'
    import { getNodeWithClass, removeClassWithNodeClass } from '@/common/util'

    const unselectComponent = () => {
        removeClassWithNodeClass('.bk-layout-grid-row', 'selected')
        removeClassWithNodeClass('.component-wrapper', 'selected')
        removeClassWithNodeClass('.side-menu-wraper', 'selected')
        removeClassWithNodeClass('.complex-top-menu-wraper', 'selected')
        removeClassWithNodeClass('.navigation-header-item', 'selected')
        removeClassWithNodeClass('.wrapperCls', 'wrapper-cls-selected')
    }

    export default {
        name: 'lesscode-layout',
        data () {
            return {
                navActive: '首页',
                selectTopMenuId: '',
                activeTopMenuId: '',
                isTopMenuSelected: false,
                isSideMenuSelected: false
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('drag', [
                'curSelectedComponentData',
                'curTemplateData'
            ]),
            ...mapGetters('layout', ['pageLayout']),
            isShowSideMenu () {
                return this.currentSideMenuList.length > 0
            },
            currentSideMenuList () {
                const { topMenuList } = this.curTemplateData
                const topMenu = _.find(topMenuList, _ => _.id === this.activeTopMenuId)
                if (!topMenu || !topMenu.children || topMenu.children.length < 1) {
                    return []
                }
                return topMenu.children
            }
        },
        watch: {
            curSelectedComponentData: {
                handler () {
                    const curComponentNode = getNodeWithClass(this.$refs.layout, 'component-wrapper')
                    curComponentNode.classList.remove('selected')
                    this.isTopMenuSelected = false
                    this.isSideMenuSelected = false
                    this.selectTopMenuId = ''
                    this.activeTopMenuId = ''
                },
                deep: true
            },
            currentSideMenuList () {
                this.handleOpenMenu()
            }
        },
        created () {
            bus.$on('on-template-change', this.handleTemplateChange)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('on-template-change', this.handleTemplateChange)
            })
            this.refreshKey = Date.now()
        },
        methods: {
            ...mapMutations('drag', ['setCurTemplateData']),
            componentWrapperMouseenterHandler (event) {
                event.target.classList.add('component-wrapper-hover')
            },
            componentWrapperMouseleaveHandler (event) {
                event.target.classList.remove('component-wrapper-hover')
            },
            handleOpenMenu () {
                if (!this.$refs.item) {
                    return
                }
                this.refreshKey = Date.now()
                setTimeout(() => {
                    this.$refs.item.forEach(item => item.handleOpen())
                })
            },
            handleSiteInfo () {
                unselectComponent()
                const curComponentNode = getNodeWithClass(event.target, 'component-wrapper')
                curComponentNode.classList.add('selected')
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'info'
                })
            },
            handleTopMenuClick () {
                if (this.isTopMenuSelected) {
                    return
                }
                unselectComponent()
                this.isTopMenuSelected = true
                this.selectTopMenuId = ''
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'complexTop'
                })
            },
            handleTopMenuSelect (topMenu) {
                if (this.selectTopMenuId === topMenu.id) {
                    return
                }
                unselectComponent()
                this.selectTopMenuId = topMenu.id
                this.activeTopMenuId = topMenu.id
                this.isTopMenuSelected = false
                this.isSideMenuSelected = false
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'complexSide',
                    menuActive: this.selectTopMenuId
                })
            },
            handleSideMenuClick () {
                if (this.isSideMenuSelected) {
                    return
                }
                unselectComponent()
                this.isTopMenuSelected = false
                this.isSideMenuSelected = true
                this.activeTopMenuId = this.selectTopMenuId
                this.selectTopMenuId = ''
            },
            handleTemplateChange (templateData) {
                const {
                    logo,
                    siteName,
                    topMenuList,
                    renderProps
                } = templateData

                let panelActive = templateData.panelActive

                // 选中的顶部导航被删除，清空导航选中状态
                if (this.selectTopMenuId) {
                    if (!_.find(topMenuList, _ => _.id === this.selectTopMenuId)) {
                        this.selectTopMenuId = ''
                        this.activeTopMenuId = ''
                        panelActive = ''
                    }
                }

                this.setCurTemplateData({
                    ...this.curTemplateData,
                    logo,
                    siteName,
                    topMenuList,
                    panelActive,
                    renderProps
                })

                this.handleOpenMenu()
            },
            handleLogout () {
                this.messageWarn('请部署后使用本功能')
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .complex-top-menu-wraper{
        border: 1px  solid transparent;
        &:hover{
            border: 1px dashed #3a84ff;
        }
        &.selected {
            border: 1px solid #3a84ff;
        }
        .navigation-header-item{
            white-space: nowrap;
            border: 1px  solid transparent;
            &:hover{
                border: 1px dashed #3a84ff;
            }
            &.selected {
                color: #fff;
                border: 1px solid #3a84ff;
            }
        }
    }
</style>
