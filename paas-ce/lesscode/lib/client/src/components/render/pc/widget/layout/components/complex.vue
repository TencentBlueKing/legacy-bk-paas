<template>
    <div ref="layout">
        <bk-navigation
            navigation-type="top-bottom"
            default-open
            :need-menu="isShowSideMenu"
            v-bind="curTemplateData.renderProps || {}"
            :head-theme-color="curTemplateData.theme"
            :theme-color="curThemeColor"
            :class="{ 'white-theme': isWhiteTheme }">
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
                <span :class="{ 'title-desc': true, 'theme-desc': !isDefaultTheme }">{{ curTemplateData.siteName }}</span>
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
                            selected: selectTopMenuId === topMemu.id,
                            'theme-item': !isDefaultTheme
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
                    <div class="message-box" :class="{ 'theme-header': !isDefaultTheme }">
                        <span class="user-name">{{ user.username }}</span>
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
                        :toggle-active="true"
                        v-bind="curThemeColorProps">
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
            <slot />
        </bk-navigation>
    </div>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex'
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import { bus } from '@/common/bus'

    const unselectComponent = () => {
        const activeNode = LC.getActiveNode()
        if (activeNode) {
            activeNode.activeClear()
        }
        document.body.querySelectorAll('.component-wrapper').forEach($el => {
            $el.classList.remove('selected')
        })
    }

    export default {
        name: 'lesscode-layout',
        data () {
            return {
                navActive: '首页',
                selectTopMenuId: '',
                activeTopMenuId: '',
                isTopMenuSelected: false,
                isSideMenuSelected: false,
                defaultThemeColorProps: {
                    'item-hover-bg-color': '#3a4561',
                    'item-hover-color': '#FFFFFF',
                    'item-active-bg-color': '#0083FF',
                    'item-active-color': '#FFFFFF',
                    'item-default-bg-color': '#2C354D',
                    'item-default-color': '#acb5c6',
                    'item-default-icon-color': '#acb5c6',
                    'item-child-icon-default-color': '#acb5c6;',
                    'item-child-icon-hover-color': '#acb5c6;',
                    'item-active-icon-color': '#FFFFFF',
                    'item-hover-icon-color': '#FFFFFF',
                    'item-child-icon-active-color': '#FFFFFF',
                    'sub-menu-open-bg-color': '#272F45'
                }
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('drag', [
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
            },
            isDefaultTheme () {
                return !this.curTemplateData?.theme || this.curTemplateData?.theme === '#182132'
            },
            isWhiteTheme () {
                return this.curTemplateData?.theme && this.curTemplateData?.theme === '#FFFFFF'
            },
            curThemeColorProps () {
                return !this.isWhiteTheme ? this.defaultThemeColorProps : {}
            },
            curThemeColor () {
                return this.isWhiteTheme ? '#ffffff' : this.curThemeColorProps['item-default-bg-color']
            }
        },
        watch: {
            currentSideMenuList () {
                this.handleOpenMenu()
            }
        },
        created () {
            const activeCallback = () => {
                this.isTopMenuSelected = false
                this.isSideMenuSelected = false
                this.selectTopMenuId = ''
                this.activeTopMenuId = ''
                document.body.querySelectorAll('.component-wrapper').forEach($el => {
                    $el.classList.remove('selected')
                })
            }
            LC.addEventListener('active', activeCallback)
            bus.$on('on-template-change', this.handleTemplateChange)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
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
            handleSiteInfo (event) {
                unselectComponent()
                event.target.classList.add('selected')
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
                    theme,
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
                    theme,
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
    .theme-style {
        color: #fff;
        opacity: 0.86;
        font-weight: normal;
    }
    .component-wrapper .theme-desc {
        @extend .theme-style
    }
    .message-box.theme-header {
        &:hover {
            opacity: 1;
        }
        @extend .theme-style
    }
    .complex-top-menu-wraper{
        border: 1px  solid transparent;
        &:hover{
            border: 1px dashed #3a84ff;
        }
        &.selected {
            border: 1px solid #3a84ff;
        }
        .theme-desc {
            color: #fff;
        }
        .navigation-header-item{
            white-space: nowrap;
            border: 1px  solid transparent;
            &.theme-item {
                color: #fff;
                opacity: 0.68;
                &:hover {
                    opacity: 1;
                }
            }
            &:hover{
                border: 1px dashed #3a84ff;
            }
            &.selected {
                color: #fff;
                border: 1px solid #3a84ff;
            }
        }
    }
    .white-theme {
        .theme-desc {
            color: #313238;
        }
        .navigation-header-item.theme-item {
            color: #63656e;
            opacity: 1;
            &:hover {
                color: #000000;
            }
        }
        .message-box.theme-header {
            color: #63656E;
        }
    }
</style>
