<template>
    <div ref="layout">
        <bk-navigation
            :header-title="navActive"
            :side-title="siteTitle"
            default-open
            navigation-type="left-right"
            need-menu
            v-bind="curTemplateData.renderProps || {}"
            @toggle="handleToggle"
            :theme-color="themeColor">
            <template slot="side-header">
                <div
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
            </template>
            <template slot="header">
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
            <template slot="menu">
                <div
                    class="side-menu-wraper"
                    :class="{
                        selected: isSideMenuSelected
                    }"
                    @click.stop="handleSideMenuSelect">
                    <bk-navigation-menu
                        ref="menu"
                        :unique-opened="false"
                        :default-active="navActive"
                        :toggle-active="true"
                        v-bind="themeColorProps">
                        <bk-navigation-menu-item
                            v-for="(menuItem) in curTemplateData.menuList"
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
    import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'

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
                siteTitle: 'lesscode',
                isToggle: false,
                navActive: '首页',
                isSideMenuSelected: false,
                whiteThemeColorProps: {
                    'item-default-bg-color': 'white',
                    'item-hover-bg-color': '#f0f1f5',
                    'sub-menu-open-bg-color': '#f5f7fa',
                    'item-hover-color': '#63656e',
                    'item-active-color': '#699df4',
                    'item-default-color': '#63656e',
                    'item-default-icon-color': '#63656ead',
                    'item-child-icon-default-color': '#63656ead',
                    'item-child-icon-hover-color': '#313238',
                    'item-active-icon-color': '#699df4',
                    'item-hover-icon-color': '#63656e',
                    'item-child-icon-active-color': '#699df4'
                }
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('drag', [
                'curTemplateData'
            ]),
            ...mapGetters('layout', ['pageLayout']),
            isDefaultTheme () {
                return !this.curTemplateData?.theme || this.curTemplateData?.theme === '#182132'
            },
            isWhiteTheme () {
                return this.curTemplateData?.theme && this.curTemplateData?.theme === '#FFFFFF'
            },
            isBlackTheme () {
                return this.curTemplateData?.theme && this.curTemplateData?.theme === '#1A1A1A'
            },
            // 左侧导航菜单主题色 选中项背景色
            activeTheme () {
                return this.isDefaultTheme
                    ? '#3c96ff' : this.isBlackTheme
                        ? '#ffffff33' : this.isWhiteTheme
                            ? '#E1ECFF' : this.curTemplateData?.theme
            },
            // 左侧导航主题色
            themeColor () {
                return this.isWhiteTheme ? '#ffffff' : '#182132'
            },
            themeColorProps () {
                let props = {
                    'item-active-bg-color': this.isWhiteTheme ? '#e1ecff' : this.activeTheme
                }
                if (this.isWhiteTheme) { // 白色主题需要设置以下属性
                    props = { props, ...this.whiteThemeColorProps }
                }
                return props
            }
        },
        created () {
            const activeCallback = () => {
                document.body.querySelectorAll('.component-wrapper').forEach($el => {
                    $el.classList.remove('selectd')
                })
                this.isSideMenuSelected = false
            }
            LC.addEventListener('active', activeCallback)
            bus.$on('on-template-change', this.handleTemplateChange)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                bus.$off('on-template-change', this.handleTemplateChange)
            })
            this.refreshKey = Date.now()
        },
        mounted () {
            this.handleOpenMenu()
        },
        methods: {
            ...mapMutations('drag', ['setCurTemplateData']),
            componentWrapperMouseenterHandler (event) {
                event.target.classList.add('component-wrapper-hover')
            },
            componentWrapperMouseleaveHandler (event) {
                event.target.classList.remove('component-wrapper-hover')
            },
            /**
             * @desc 展开菜单
             */
            handleOpenMenu () {
                if (!this.$refs.item) {
                    return
                }
                this.refreshKey = Date.now()
                setTimeout(() => {
                    this.$refs.item.forEach(item => item.handleOpen())
                })
            },
            /**
             * @desc 选中站点Logo 块进行配置
             * @param { Object } event
             */
            handleSiteInfo (event) {
                unselectComponent()
                this.isSideMenuSelected = false
                event.target.classList.add('selected')
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'info'
                })
            },
            /**
             * @desc 选中左侧导航进行配置
             */
            handleSideMenuSelect () {
                unselectComponent()
                this.isSideMenuSelected = true
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'menu'
                })
            },
            /**
             * @desc 更新模板配置
             * @param { Object } payload
             */
            handleTemplateChange (payload) {
                const {
                    logo,
                    siteName,
                    menuList,
                    renderProps,
                    theme
                } = payload
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    logo,
                    siteName,
                    menuList,
                    renderProps,
                    theme
                })
                this.handleOpenMenu()
            },
            handleToggle (value) {
                this.isToggle = value
            },
            handleLogout () {
                this.messageWarn('请部署后使用本功能')
            }
        }
    }
</script>
<style lang="postcss">
    .navigation-editor-wrapper{
        position: relative;
    }
</style>
